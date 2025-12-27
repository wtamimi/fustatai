from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.models.orchestrator import Orchestrator
from src.models.agent import Agent

async def get_all_apps(db: AsyncSession):
    result = await db.execute(
        select(
            Orchestrator.id,
            Orchestrator.name,
            Orchestrator.description,
            Orchestrator.app_type
            #Orchestrator.icon
        ).where(Orchestrator.publish_as_app == True)
    )
    return result.all()

async def get_all_agents(db: AsyncSession):
    result = await db.execute(
        select(
            Agent.id,
            Agent.name,
            Agent.description,
            Agent.app_type
            #Orchestrator.icon
        ).where(Agent.publish_as_app == True)
    )
    return result.all()
