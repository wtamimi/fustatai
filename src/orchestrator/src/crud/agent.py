from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import delete, update
from src.models.agent import Agent, AgentMcpServer

async def create_agent(db: AsyncSession, agent_data: dict):
    # Extract MCP servers separately
    mcp_servers = agent_data.pop('mcp_servers', [])
    
    # Create agent
    db_agent = Agent(**agent_data)
    db.add(db_agent)
    await db.flush()  # Get the agent ID
    
    # Add MCP server associations
    for mcp in mcp_servers:
        assoc = AgentMcpServer(
            agent_id=db_agent.id,
            mcp_server_id=mcp['mcp_server_id']
        )
        db.add(assoc)
    
    await db.commit()
    
    # Re-fetch the agent with relationships loaded to prevent DetachedInstanceError
    result = await db.execute(
        select(Agent)
        .options(
            selectinload(Agent.api_key),
            selectinload(Agent.mcp_servers).selectinload(AgentMcpServer.mcp_server)
        )
        .filter(Agent.id == db_agent.id)
    )
    return result.scalar_one_or_none()

async def get_agent(db: AsyncSession, agent_id: str):
    result = await db.execute(
        select(Agent)
        .options(
            selectinload(Agent.api_key),
            selectinload(Agent.mcp_servers).selectinload(AgentMcpServer.mcp_server)
        )
        .filter(Agent.id == agent_id)
    )
    return result.scalar_one_or_none()

async def get_all_agents(db: AsyncSession):
    result = await db.execute(
        select(Agent)
        .options(
            selectinload(Agent.api_key),
            selectinload(Agent.mcp_servers).selectinload(AgentMcpServer.mcp_server)
        ).order_by(Agent.modified_at.desc())
    )
    return result.scalars().all()

async def update_agent(db: AsyncSession, agent_id: str, agent_data: dict):
    agent_uuid = UUID(agent_id)

    # Extract MCP servers separately
    mcp_servers = agent_data.pop('mcp_servers', [])

    # Update agent
    await db.execute(
        update(Agent)
        .where(Agent.id == agent_uuid)
        .values(**agent_data)
    )

    # Clear existing associations
    await db.execute(
        delete(AgentMcpServer)
        .where(AgentMcpServer.agent_id == agent_uuid)
    )
    await db.flush()

    # Update MCP servers
    if mcp_servers:
        # Add new associations
        for mcp in mcp_servers:
            assoc = AgentMcpServer(
                agent_id=agent_uuid,
                mcp_server_id=mcp['mcp_server_id']
            )
            db.add(assoc)

    await db.commit()

    # Re-fetch the agent with relationships loaded
    result = await db.execute(
        select(Agent)
        .options(
            selectinload(Agent.api_key),
            selectinload(Agent.mcp_servers).selectinload(AgentMcpServer.mcp_server)
        )
        .filter(Agent.id == agent_uuid)
    )
    return result.scalar_one_or_none()

async def delete_agent(db: AsyncSession, agent_id: str):
    await db.execute(
        delete(Agent).where(Agent.id == agent_id)
    )
    await db.commit()
    return True