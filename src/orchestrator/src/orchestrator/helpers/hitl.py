from typing import Callable
from langchain_core.tools import BaseTool, tool as create_tool
from langchain_core.runnables import RunnableConfig
from langgraph.types import interrupt
from langgraph.prebuilt.interrupt import HumanInterruptConfig, HumanInterrupt

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
            "allow_respond": True,
            "allow_edit": True,
            "allow_accept": True            
        }

    # Check if the tool is async (has ainvoke)
    is_async = hasattr(tool, 'ainvoke') and callable(tool.ainvoke)

    if is_async:
        # Create an async tool
        @create_tool(  
            tool.name,
            description=tool.description,
            args_schema=tool.args_schema
        )
        async def call_tool_with_interrupt(config: RunnableConfig, **tool_input):
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
                tool_response = await tool.ainvoke(tool_input, config)
            # update tool call args
            elif response["type"] == "edit":
                tool_input = response["args"]["args"]
                tool_response = await tool.ainvoke(tool_input, config)
            # respond to the LLM with user feedback
            elif response["type"] == "response":
                user_feedback = response["args"]
                tool_response = user_feedback
            elif response["type"] == "ignore":
                tool_response = "Tool is not available for use."
            else:
                raise ValueError(f"Unsupported interrupt response type: {response['type']}")

            return tool_response

    else:

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
