from sqlalchemy.future import select
from sqlalchemy import update, delete
from src.models.mcp_server import McpServer
from src.core.database import async_session

async def create_mcp_server(mcp_server: dict):
    async with async_session() as session:
        db_mcp_server = McpServer(**mcp_server)
        session.add(db_mcp_server)
        await session.commit()
        await session.refresh(db_mcp_server)
        return db_mcp_server

async def get_mcp_server(server_id: str):
    async with async_session() as session:
        result = await session.execute(
            select(McpServer).filter(McpServer.id == server_id))
        return result.scalar_one_or_none()

async def get_all_mcp_servers():
    async with async_session() as session:
        result = await session.execute(select(McpServer))
        return result.scalars().all()

async def update_mcp_server(server_id: str, mcp_server: dict):
    async with async_session() as session:
        await session.execute(
            update(McpServer)
            .where(McpServer.id == server_id)
            .values(**mcp_server)
        )
        await session.commit()
        return await get_mcp_server(server_id)

async def delete_mcp_server(server_id: str):
    async with async_session() as session:
        await session.execute(
            delete(McpServer).where(McpServer.id == server_id)
        )
        await session.commit()
        return True