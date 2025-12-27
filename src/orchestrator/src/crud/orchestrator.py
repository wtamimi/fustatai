from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete, update
from sqlalchemy.orm import selectinload, joinedload
from src.models.orchestrator import Orchestrator, OrchestratorSubAgent
from src.models.agent import Agent, AgentMcpServer

async def create_orchestrator(session: AsyncSession, orchestrator_data: dict):
    agents_data = orchestrator_data.pop('agents', [])
    db_orch = Orchestrator(**orchestrator_data)
    session.add(db_orch)
    await session.flush()
    
    for agent_data in agents_data:
        assoc = OrchestratorSubAgent(
            agent_id = agent_data['agent_id'],
            orchestrator_id = db_orch.id)
        session.add(assoc)
    
    await session.commit()
    return await get_orchestrator(session, str(db_orch.id))

async def get_orchestrator(session: AsyncSession, orchestrator_id: str):
    result = await session.execute(
        select(Orchestrator)
        .options(
            joinedload(Orchestrator.api_key),
            selectinload(Orchestrator.agent_associations)
            .joinedload(OrchestratorSubAgent.agent)
            .options(
                joinedload(Agent.api_key),
                selectinload(Agent.mcp_servers)
                .joinedload(AgentMcpServer.mcp_server)
            )
        )
        .filter(Orchestrator.id == orchestrator_id)
    )
    return result.unique().scalar_one_or_none()

async def get_all_orchestrators(session: AsyncSession):
    result = await session.execute(
        select(Orchestrator)
        .options(
            joinedload(Orchestrator.api_key),
            selectinload(Orchestrator.agent_associations)
            .joinedload(OrchestratorSubAgent.agent)
            .options(
                joinedload(Agent.api_key),
                selectinload(Agent.mcp_servers)
                .joinedload(AgentMcpServer.mcp_server)
            )
        ).order_by(Orchestrator.modified_at.desc())
    )
    return result.unique().scalars().all()

async def update_orchestrator(session: AsyncSession, orchestrator_id: str, orchestrator_data: dict):
    orch_uuid = UUID(orchestrator_id)

    agents_data = orchestrator_data.pop('agents', [])
    
    await session.execute(
        update(Orchestrator)
        .where(Orchestrator.id == orch_uuid)
        .values(**orchestrator_data)
    )

    # Clear existing associations
    await session.execute(
        delete(OrchestratorSubAgent)
        .where(OrchestratorSubAgent.orchestrator_id == orch_uuid)
    )
    await session.flush()

    for agent_data in agents_data:
        assoc = OrchestratorSubAgent(
            agent_id = agent_data['agent_id'],
            orchestrator_id = orch_uuid)
        session.add(assoc)
    
    await session.commit()
    return await get_orchestrator(session, orchestrator_id)

async def delete_orchestrator(session: AsyncSession, orchestrator_id: str):
    await session.execute(
        delete(Orchestrator).where(Orchestrator.id == orchestrator_id)
    )
    await session.commit()
    return True