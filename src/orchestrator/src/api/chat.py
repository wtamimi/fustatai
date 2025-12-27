# main.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from pydantic import BaseModel
from typing import List, Dict, Any, Optional#, AsyncGenerator
import asyncio
import importlib.metadata
import uuid
from datetime import datetime, timezone
import json
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.database import get_db
from langgraph.types import Command
from src.orchestrator.helpers.utils import convert_message_to_serializable, create_metadata, LangChainMessageEncoder
from src.orchestrator.runtime_service import get_agent
from src.orchestrator.core.lite_memory.sqlite_cp import get_saver


router = APIRouter(prefix="/chat", tags=["Chat"])


##################
# Info endpoint
##################

def get_langgraph_version() -> str:
    """Get the installed version of langgraph"""
    try:
        return importlib.metadata.version("langgraph")
    except importlib.metadata.PackageNotFoundError:
        return "0.0.0"  # Fallback version


@router.get("/info")
async def get_info() -> Dict[str, Any]:
    """
    Returns information about the server configuration.
    This endpoint is called by the agent-chat-ui to determine capabilities.
    """
    print(">>> Info API call")
    return {
        "version": "0.3.1",  # Your API adapter version
        "langgraph_py_version": get_langgraph_version(),
        "flags": {
            "assistants": True,    # You're using assistants
            "crons": False,        # Not using cron jobs
            "langsmith": True,     # Assuming you're using LangSmith
            "langsmith_tracing_replicas": True  # If using LangSmith replicas
        },
        "host": {
            "kind": "self-hosted",  # Important: indicates on-prem deployment
            "project_id": None,
            "host_revision_id": None,
            "revision_id": None,
            "tenant_id": None
        }
    }


##################
# Threads endpoint
##################

# In-memory storage for threads (replace with persistent storage in production)
threads_store = {}
# In-memory storage for tracking threads with agent Ids
kv_store = {}

class ThreadCreateRequest(BaseModel):
    thread_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}
    config: Optional[Dict[str, Any]] = {}
    if_exists: Optional[str] = "raise"
    ttl: Optional[Dict[str, Any]] = None
    supersteps: Optional[List[Dict[str, Any]]] = None

class ThreadResponse(BaseModel):
    thread_id: str
    created_at: str
    updated_at: str
    metadata: Dict[str, Any]
    status: str
    config: Dict[str, Any]
    values: Optional[Any] = None
    interrupts: Optional[Any] = None

@router.post("/threads", response_model=ThreadResponse)
async def create_thread(request: ThreadCreateRequest):
    """
    Creates a new thread with the provided metadata and config.
    Returns the thread object with generated ID and timestamps.
    """
    print(">>> Create Thread API call")
    print(f">>> Params: {request}")
    # Generate a unique thread ID
    thread_id = str(uuid.uuid4())
    print(f">>> Thread Id: {thread_id}")
    # Get current timestamp in ISO format with timezone
    current_time = datetime.now(timezone.utc).isoformat()
    
    # Create the thread object
    thread = {
        "thread_id": thread_id,
        "created_at": current_time,
        "updated_at": current_time,
        "metadata": request.metadata or {},
        "status": "idle",
        "config": request.config or {},
        "values": None
    }
    
    # Store the thread
    threads_store[thread_id] = thread
    
    return thread


# a GET endpoint to retrieve a thread by ID
@router.get("/threads/{thread_id}", response_model=ThreadResponse)
async def get_thread(thread_id: str):
    """Retrieve a thread by its ID"""
    print(">>> Get Thread API call")
    if thread_id not in threads_store:
        raise HTTPException(status_code=404, detail="Thread not found")
    return threads_store[thread_id]


# a DELETE endpoint to remove a thread
@router.delete("/threads/{thread_id}")
async def delete_thread(thread_id: str):
    """Delete a thread by its ID"""
    print(">>> Delete Thread API call")
    if thread_id not in threads_store:
        raise HTTPException(status_code=404, detail="Thread not found")
    del threads_store[thread_id]
    return {"status": "deleted", "thread_id": thread_id}


##################
# History endpoint
##################

class HistoryRequest(BaseModel):
    limit: Optional[int] = 1000

class CheckpointResponse(BaseModel):
    values: Dict[str, Any]
    next: List[str]
    tasks: List[Dict[str, Any]]
    metadata: Dict[str, Any]
    created_at: str
    checkpoint: Dict[str, str]
    parent_checkpoint: Dict[str, str]
    interrupts: List[Any]
    checkpoint_id: str
    parent_checkpoint_id: Optional[str]

class ThreadStateSearch(BaseModel):
    limit: Optional[int] = 10
    before: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    checkpoint: Optional[Dict[str, Any]] = None


@router.post("/threads/{thread_id}/history", response_model=List[CheckpointResponse])
async def get_thread_history(
    thread_id: str, 
    request: HistoryRequest, 
    db: AsyncSession = Depends(get_db),
    checkpointer = Depends(get_saver)):
    """
    Returns the full graph execution history for a specific thread.
    The history is ordered from most recent to oldest checkpoint.
    """
#    print(">>> Get History API call")
#    print(f">>> Params: {request}")
#    print(f">>> Thread Id: {thread_id}")

    if thread_id not in kv_store:
        raise HTTPException(status_code=404, detail="Thread not found")
    
    assistantId = kv_store.get(thread_id)

    if not assistantId:
        raise HTTPException(status_code=404, detail="Agent not found")

    try:

        # Get the history using LangGraph's get_state_history
        config = {"configurable": {"thread_id": thread_id}}
        
        agent = await get_compiled_graph(db, assistantId, checkpointer)

        # Get history and convert generator to list
        history = [cp async for cp in agent.aget_state_history(config)]
        
        # Format the response
        formatted_history = []

        for checkpoint in history:
            formatted_checkpoint = {
                "values": checkpoint.values,
                "next": list(checkpoint.next) if checkpoint.next else [],
                "tasks": _format_tasks(checkpoint.tasks),
                "metadata": checkpoint.metadata,
                "created_at": checkpoint.created_at if checkpoint.created_at else str(datetime.now(timezone.utc).isoformat()),
                "checkpoint": {
                    "checkpoint_id": checkpoint.config.get("configurable", {}).get("checkpoint_id"),
                    "thread_id": checkpoint.config.get("configurable", {}).get("thread_id") or thread_id,
                    "checkpoint_ns": checkpoint.config.get("configurable", {}).get("checkpoint_ns") or ""
                },
                "parent_checkpoint": {
                    "checkpoint_id": checkpoint.parent_config.get("configurable", {}).get("checkpoint_id") if checkpoint.parent_config else "",
                    "thread_id": checkpoint.parent_config.get("configurable", {}).get("thread_id") if checkpoint.parent_config else thread_id,
                    "checkpoint_ns": checkpoint.parent_config.get("configurable", {}).get("checkpoint_ns") if checkpoint.parent_config else ""
                },
                "interrupts": checkpoint.interrupts if checkpoint.interrupts else [],
                "checkpoint_id": checkpoint.config.get("configurable", {}).get("checkpoint_id"),
                "parent_checkpoint_id": checkpoint.parent_config.get("configurable", {}).get("checkpoint_id") if checkpoint.parent_config else ""
            }
            formatted_history.append(formatted_checkpoint)

        return formatted_history
    
    except ValueError as e:
        if "thread not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=f"Thread {thread_id} not found")
        print(f">>> Value Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f">>> Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

def _format_tasks(tasks) -> List[Dict[str, Any]]:
    """Format PregelTask objects into serializable dictionaries"""
    formatted_tasks = []

    for task in tasks:
        formatted_task = {
            "id": task.id,
            "name": task.name,
            "path": list(task.path) if hasattr(task, 'path') and task.path else [],
            "error": task.error,
            "interrupts": task.interrupts,
            "state": task.state,
            "result": task.result
        }
        # Remove the non-existent 'checkpoint' reference
        formatted_tasks.append(formatted_task)
        
    return formatted_tasks


##################
# Stream endpoint
##################

# Request and Response Models
class RunCreateStateful(BaseModel):
    assistant_id: str
    checkpoint: Optional[Dict[str, Any]] = None
    input: Optional[Any] = None
    command: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    config: Optional[Dict[str, Any]] = None
    context: Optional[Dict[str, Any]] = None
    stream_mode: Optional[List[str]] = ["values", "messages-tuple", "custom"]
    stream_subgraphs: Optional[bool] = False
    stream_resumable: Optional[bool] = False
    on_disconnect: Optional[str] = "cancel"
    interrupt_before: Optional[List[str]] = None
    interrupt_after: Optional[List[str]] = None


from langchain_core.messages import ToolMessage


@router.post("/threads/{thread_id}/runs/stream")
async def stream_run(
    thread_id: str, 
    request: RunCreateStateful,
    background_tasks: BackgroundTasks,
    http_request: Request,
    db: AsyncSession = Depends(get_db),
    checkpointer = Depends(get_saver)
):
    """
    Stream real-time updates with full LangGraph API compatibility.
    """

#    print(">>> Run Stream API call")
#    print(f">>> Thread Id: {thread_id}")
#    print(f">>> Request: {request}")

    if thread_id not in threads_store:
        raise HTTPException(status_code=404, detail=f"Thread {thread_id} not found")
    
    if thread_id not in kv_store:
        kv_store[thread_id] = request.assistant_id
        
    # Generate run ID
    run_id = str(uuid.uuid4())
    
    # Prepare configuration
    config = {
        "configurable": {
            "thread_id": thread_id #,
#                "assistant_id": request.assistant_id,
        }
    }

    # Get request headers for metadata
    headers = dict(http_request.headers)
        
    async def event_generator():
#            try:
            # Send metadata event
            # Yield metadata event first
            metadata_event = {
                "run_id": run_id,
                "attempt": 1
            }
            yield f"event: metadata\ndata: {json.dumps(metadata_event)}\nid: 0\n\n"

            # Get the compiled graph
            graph = await get_compiled_graph(db, request.assistant_id, checkpointer)

            event_id = 1
            
            # Handle different input types
            input_data = request.input or {}
            if request.command:
                #input_data = {"command": request.command}
                input_data = create_command_from_request(request.command)
#            print(f">>> Input Data: {input_data}")

            # Execute with streaming
            async for event in graph.astream(
                input_data,
                config=config,
                stream_mode=["values", "messages", "custom"]
            ):
#                print("STREAM EVENT--------")
#                print(event_id)
#                print(event)
#                print("--------")

                # Handle different stream modes
                if "messages-tuple" in request.stream_mode and 'messages' in event:
                    if isinstance(event, tuple) and len(event) == 2 :
                        message_chunk = event[1]
                        
                        # Convert message to serializable format
                        serialized_message = convert_message_to_serializable(message_chunk)
                        
                        # Create LangGraph-style metadata
                        langgraph_metadata = create_metadata(
                            run_id=run_id,
                            thread_id=thread_id,
                            assistant_id=request.assistant_id,
                            headers=headers,
                            message=serialized_message[1]
                        )
                        
                        # For messages-tuple, we need to send both message and metadata
                        messages_event = {
                            "event": "messages",
                            "data": [
                                serialized_message[0],
                                langgraph_metadata
                            ]
                        }
                        yield f"event: {messages_event['event']}\ndata: {json.dumps(messages_event['data'], cls=LangChainMessageEncoder)}\nid: {event_id}\n\n"
                        event_id += 1


                # Handle values mode (complete state)
                if "values" in request.stream_mode and 'values' in event:
                    values_event = {
                        "event": "values",
                        "data": event[1]
                    }
                    yield f"event: {values_event['event']}\ndata: {json.dumps(values_event['data'], cls=LangChainMessageEncoder)}\nid: {event_id}\n\n"
                    event_id += 1
                
                # Small delay to prevent overwhelming the client
                await asyncio.sleep(0.01)

    # Handle disconnection
    if request.on_disconnect == "cancel":
        background_tasks.add_task(cancel_run, run_id)
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*"
        }
    )
    

async def get_compiled_graph(db: AsyncSession, assistant_id: str, checkpointer):
    """
    Retrieve the compiled LangGraph for the given assistant ID.
    In a real implementation, this would fetch from your graph registry.
    """
    return await get_agent(db, assistant_id, checkpointer)


# Create Command object directly from the request command dict
def create_command_from_request(command_dict: Dict[str, Any]) -> Command:
    """
    Create a LangGraph Command object directly from the request command dictionary
    """
    # Simply pass the entire command dictionary to Command constructor
    # LangGraph's Command class will handle the field mapping internally
    return Command(**command_dict)


async def cancel_run(run_id: str):
    """
    Cancel a running execution based on run_id.
    """
    pass

