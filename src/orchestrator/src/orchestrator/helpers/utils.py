import uuid
from typing import List, Dict, Any, Optional, AsyncGenerator
from datetime import datetime, timezone
from json import JSONEncoder
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage, ToolMessage


# Custom JSON Encoder for LangChain messages
class LangChainMessageEncoder(JSONEncoder):
    """Custom JSON encoder for LangChain message objects"""
    
    def default(self, obj: Any) -> Any:
        # Handle LangChain message objects
        if isinstance(obj, BaseMessage):
            serialized_message = {
                "content": obj.content,
                "additional_kwargs": getattr(obj, 'additional_kwargs', {}),
                "response_metadata": getattr(obj, 'response_metadata', {}),
                "type": obj.type,
                "name": getattr(obj, 'name', None),
                "id": getattr(obj, 'id', str(uuid.uuid4())),
                "example": getattr(obj, 'example', False),
            }
            
            # Add AI-specific fields
            if hasattr(obj, 'tool_calls'):
                serialized_message["tool_calls"] = getattr(obj, 'tool_calls', [])
            if hasattr(obj, 'invalid_tool_calls'):
                serialized_message["invalid_tool_calls"] = getattr(obj, 'invalid_tool_calls', [])
            if hasattr(obj, 'usage_metadata'):
                serialized_message["usage_metadata"] = getattr(obj, 'usage_metadata', None)
            
            # Add tool-specific fields
            if hasattr(obj, 'tool_call_id'):
                serialized_message["tool_call_id"] = getattr(obj, 'tool_call_id', None)
            if hasattr(obj, 'artifact'):
                serialized_message["artifact"] = getattr(obj, 'artifact', None)
            if hasattr(obj, 'status'):
                serialized_message["status"] = getattr(obj, 'status', None)
                
            return serialized_message
        
        # Handle other non-serializable objects
        try:
            #return super().default(obj)
            return str(obj)
        except TypeError:
            # Fallback: convert to string
            return str(obj)


def create_metadata(run_id: str, thread_id: str, assistant_id: str, 
                    headers: Dict[str, str], message) -> Dict[str, Any]:
    """Create metadata in the exact format of LangGraph Platform API"""
    #print(message)
    temp = {
        "created_by": "system",
        "graph_id": "agent",
        "assistant_id": assistant_id,
        "run_attempt": 1,
        "langgraph_version": "0.6.6",
        "langgraph_api_version": "0.3.1",
        "langgraph_plan": "developer",
        "langgraph_host": "self-hosted",
        "langgraph_api_url": "http://127.0.0.1:8000",
        "host": headers.get("host", "localhost:8000") if headers else None,
        "connection": headers.get("connection", "keep-alive") if headers else None,
        "content-length": headers.get("content-length", "227") if headers else None,
        "sec-ch-ua-platform": headers.get("sec-ch-ua-platform", "\"Windows\"") if headers else None,
        "user-agent": headers.get("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36") if headers else None,
        "sec-ch-ua": headers.get("sec-ch-ua", "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"") if headers else None,
        "dnt": headers.get("dnt", "1") if headers else None,
        "content-type": headers.get("content-type", "application/json") if headers else None,
        "sec-ch-ua-mobile": headers.get("sec-ch-ua-mobile", "?0") if headers else None,
        "accept": headers.get("accept", "*/*") if headers else None,
        "origin": headers.get("origin", "http://localhost:3000") if headers else None,
        "sec-fetch-site": headers.get("sec-fetch-site", "same-site") if headers else None,
        "sec-fetch-mode": headers.get("sec-fetch-mode", "cors") if headers else None,
        "sec-fetch-dest": headers.get("sec-fetch-dest", "empty") if headers else None,
        "referer": headers.get("referer", "http://localhost:3000/") if headers else None,
        "accept-encoding": headers.get("accept-encoding", "gzip, deflate, br, zstd") if headers else None,
        "accept-language": headers.get("accept-language", "en-US,en;q=0.9,ar-SA;q=0.8,ar;q=0.7") if headers else None,
        "x-request-id": headers.get("x-request-id", str(uuid.uuid4())) if headers else None,
        "langgraph_auth_user_id": "",
        "langgraph_request_id": headers.get("x-request-id", str(uuid.uuid4())) if headers else None,
        "run_id": run_id,
        "thread_id": thread_id,
        "user_id": "",
        #"langgraph_step": step,
        #"langgraph_node": node_name,
        #"langgraph_triggers": [f"branch:to:{node_name}"],
        #"langgraph_path": ["__pregel_pull", node_name],
        #"langgraph_checkpoint_ns": f"{node_name}:{str(uuid.uuid4()).replace('-', '')}",
        #"checkpoint_ns": f"{node_name}:{str(uuid.uuid4()).replace('-', '')}",
        "LANGSMITH_LANGGRAPH_API_VARIANT": "local_dev",
        "LANGSMITH_PROJECT": "local-agent"
    }
    result = {**temp, **message}
    return result

def convert_message_to_serializable(message):
    """Convert LangChain message to serializable format matching LangGraph API"""
    if isinstance(message, BaseMessage):
        # Handle content format (array for human, string for AI)
        content = message.content
        if isinstance(message, HumanMessage) and isinstance(content, str):
            content = [{"type": "text", "text": content}]
        
        return {
            "type": message.type,
            "content": content,
            "additional_kwargs": getattr(message, 'additional_kwargs', {}),
            "response_metadata": getattr(message, 'response_metadata', {}),
            "name": getattr(message, 'name', None),
            "id": getattr(message, 'id', str(uuid.uuid4())),
            "example": getattr(message, 'example', False),
            "tool_calls": getattr(message, 'tool_calls', []),
            "invalid_tool_calls": getattr(message, 'invalid_tool_calls', []),
            "usage_metadata": getattr(message, 'usage_metadata', None),
            "tool_call_id": getattr(message, 'tool_call_id', None),
            "artifact": getattr(message, 'artifact', None),
            "status": getattr(message, 'status', None)
        }
    return message


# not used - to be deleted
def serialize_state_values(values):
    """Recursively serialize state values, handling LangChain messages"""
    if isinstance(values, dict):
        return {k: serialize_state_values(v) for k, v in values.items()}
    elif isinstance(values, list):
        return [serialize_state_values(item) for item in values]
    elif isinstance(values, BaseMessage):
        return convert_message_to_serializable(values)
    else:
        return values

