from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud.apps import get_all_apps, get_all_agents
from src.schemas.apps import App
from src.core.database import get_db


router = APIRouter(prefix="/apps", tags=["Apps"])


@router.get("/", response_model=list[App])
async def get_apps(db: AsyncSession = Depends(get_db)):
    orchestrator_apps = await _get_orchestrator_apps(db)
    agent_apps = await _get_agent_apps(db)
    return orchestrator_apps + agent_apps

# to be removed
@router.get("/agents", response_model=list[App])
async def get_apps(db: AsyncSession = Depends(get_db)):
    apps = await get_all_agents(db)
    return [{
        "id": app.id,
        "name": app.name,
        "description": app.description,
        "icon": "Bot",
        "app_type": "agent"
    } for app in apps]


# Helper function to fetch orchestrator apps
async def _get_orchestrator_apps(db: AsyncSession):
    apps = await get_all_apps(db)
    return [{
        "id": app.id,
        "name": app.name,
        "description": app.description,
        "icon": "Bot",
        "app_type": app.app_type
    } for app in apps]

# Helper function to fetch agent apps
async def _get_agent_apps(db: AsyncSession):
    apps = await get_all_agents(db)
    return [{
        "id": app.id,
        "name": app.name,
        "description": app.description,
        "icon": "Bot",
        "app_type": app.app_type
    } for app in apps]
