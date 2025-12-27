from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud.mcp_server import (
    create_mcp_server,
    get_mcp_server,
    get_all_mcp_servers,
    update_mcp_server,
    delete_mcp_server
)
from src.schemas.mcp_server import McpServerCreate, McpServerUpdate, McpServer
from src.core.database import get_db
from uuid import UUID
from src.orchestrator.core.mcp_service import get_mcp_server_tools_info

router = APIRouter(prefix="/mcp-servers", tags=["MCP Servers"])

@router.post("/", response_model=McpServer)
async def create_new_mcp_server(
    mcp_server: McpServerCreate,
    db: AsyncSession = Depends(get_db)
):
    return await create_mcp_server(mcp_server.dict())

@router.get("/", response_model=list[McpServer])
async def read_all_mcp_servers(db: AsyncSession = Depends(get_db)):
    return await get_all_mcp_servers()

@router.get("/{server_id}", response_model=McpServer)
async def read_mcp_server(server_id: UUID, db: AsyncSession = Depends(get_db)):
    server = await get_mcp_server(str(server_id))
    if not server:
        raise HTTPException(status_code=404, detail="McpServer not found")
    return server

@router.get("/{server_id}/tools", response_model=list[dict])
async def read_mcp_server_tools(server_id: UUID, db: AsyncSession = Depends(get_db)):
    server = await get_mcp_server(str(server_id))
    if not server:
        raise HTTPException(status_code=404, detail="McpServer not found")
    return await get_mcp_server_tools_info(server)

@router.put("/{server_id}", response_model=McpServer)
async def update_existing_mcp_server(
    server_id: UUID,
    mcp_server: McpServerUpdate,
    db: AsyncSession = Depends(get_db)
):
    updated = await update_mcp_server(str(server_id), mcp_server.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="McpServer not found")
    return updated

@router.delete("/{server_id}")
async def delete_existing_mcp_server(
    server_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    success = await delete_mcp_server(str(server_id))
    if not success:
        raise HTTPException(status_code=404, detail="McpServer not found")
    return {"message": "McpServer deleted successfully"}