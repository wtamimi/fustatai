from langchain_openai import ChatOpenAI

from langgraph_supervisor import create_supervisor
from langgraph.prebuilt import create_react_agent

import os
from dotenv import load_dotenv
from langgraph.checkpoint.memory import InMemorySaver


from typing import Callable
from langchain_core.tools import BaseTool, tool as create_tool
from langchain_core.runnables import RunnableConfig
from langgraph.types import interrupt
from langgraph.prebuilt.interrupt import HumanInterruptConfig, HumanInterrupt

# import sqlite3
# from langgraph.checkpoint.sqlite import SqliteSaver
# from langgraph.graph import StateGraph

load_dotenv(override=True)

model = ChatOpenAI(model="gpt-5-nano", api_key=os.getenv('OPENAI_API_KEY'))

checkpointer = InMemorySaver()

# Create a new SqliteSaver instance
# Note: check_same_thread=False is OK as the implementation uses a lock
# to ensure thread safety.
#conn = sqlite3.connect("data\\checkpoints.sqlite", check_same_thread=False)
#checkpointer = SqliteSaver(conn)

# tools

def add_human_in_the_loop(
    tool: Callable | BaseTool,
    *,
    interrupt_config: HumanInterruptConfig = None,
) -> BaseTool:
    """Wrap a tool to support human-in-the-loop review."""
    if not isinstance(tool, BaseTool):
        tool = create_tool(tool)

    if interrupt_config is None:
        interrupt_config = {
            # "allow_accept": True,
            # "allow_edit": True,
            # "allow_respond": True,
            "allow_ignore": True,
            "allow_respond": False,
            "allow_edit": False,
            "allow_accept": True            
        }

    @create_tool(  
        tool.name,
        description=tool.description,
        args_schema=tool.args_schema
    )
    def call_tool_with_interrupt(config: RunnableConfig, **tool_input):
        request: HumanInterrupt = {
            "action_request": {
                "action": tool.name,
                "args": tool_input
            },
            "config": interrupt_config,
            "description": "Please review the tool call"
        }
        response = interrupt([request])[0]  
        print(response)
        # approve the tool call
        if response["type"] == "accept":
            tool_response = tool.invoke(tool_input, config)
        # update tool call args
        elif response["type"] == "edit":
            tool_input = response["args"]["args"]
            tool_response = tool.invoke(tool_input, config)
        # respond to the LLM with user feedback
        elif response["type"] == "response":
            user_feedback = response["args"]
            tool_response = user_feedback
        elif response["type"] == "ignore":
            tool_response = "Tool is not available for use."
        else:
            raise ValueError(f"Unsupported interrupt response type: {response['type']}")

        return tool_response

    return call_tool_with_interrupt

def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b

def multiply(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b

def web_search(query: str) -> str:
    """Search the web for information."""
    return (
        "Here are the headcounts for each of the FAANG companies in 2024:\n"
        "1. **Facebook (Meta)**: 67,317 employees.\n"
        "2. **Apple**: 164,000 employees.\n"
        "3. **Amazon**: 1,551,000 employees.\n"
        "4. **Netflix**: 14,000 employees.\n"
        "5. **Google (Alphabet)**: 181,269 employees."
    )

# Create specialized agents

math_agent = create_react_agent(
    model=model,
    tools=[add_human_in_the_loop(add), add_human_in_the_loop(multiply)],
    name="math_expert",
    prompt="You are a math expert. Always use one tool at a time.",
)

research_agent = create_react_agent(
    model=model,
    tools=[add_human_in_the_loop(web_search)],
    name="research_expert",
    prompt="You are a world class researcher with access to web search. Do not do any math.",
)

# Create supervisor workflow
workflow = create_supervisor(
    [research_agent, math_agent],
    model=model,
    prompt=(
        "You are a team supervisor managing a research expert and a math expert. "
        "For current events, use research_agent. "
        "For math problems, use math_agent."
    ),
    output_mode="full_history"
)

# Compile and run
graph = workflow.compile(
        checkpointer=checkpointer
)
