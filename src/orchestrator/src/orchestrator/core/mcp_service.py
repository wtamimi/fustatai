from src.models.mcp_server import McpServer
#from fastapi import HTTPException
from typing import List, Optional
from src.orchestrator.helpers.hitl import add_human_in_the_loop

from langchain_mcp_adapters.client import MultiServerMCPClient


async def get_mcp_servers_tools(mcps: List[McpServer]):

    hitl_tools = []

    for mcp in mcps:
        mcp_json = {
            mcp.mcp_server.name: {
                **mcp.mcp_server.config_json,
                "transport": mcp.mcp_server.transport
            }
        }

        client = MultiServerMCPClient(mcp_json)

        tools = await client.get_tools()

        for tool in tools:
            if mcp.mcp_server.mode == 'supervised':
                hitl_tool = add_human_in_the_loop(tool)
                hitl_tools.append(hitl_tool)
            else:
                hitl_tools.append(tool)

    return hitl_tools


async def get_mcp_server_tools_info(mcp: McpServer):

    if not mcp:
        raise HTTPException(status_code=404, detail="McpServer not found")
    
    # Construct the new JSON structure
    result_json = {
        mcp.name: {
            **mcp.config_json,  # Unpacks existing keys (command and args)
            "transport": "stdio"  # Adds the required transport field
        }
    }

    client = MultiServerMCPClient(result_json)

    tools = await client.get_tools()

    result = await get_tools_info(tools)

    return result


async def get_tools_info(tools):
    return [
        {
            "tool_name": tool.name,
            "tool_description": tool.description
        }
        for tool in tools
    ]
