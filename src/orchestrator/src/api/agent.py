from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from src.crud.agent import (
    create_agent,
    get_agent,
    get_all_agents,
    update_agent,
    delete_agent
)
from src.schemas.agent import AgentCreate, AgentUpdate, Agent, AgentGenerate
from src.core.database import get_db


router = APIRouter(prefix="/agents", tags=["Agents"])


@router.get("/", response_model=list[Agent])
async def read_all_agents(db: AsyncSession = Depends(get_db)):
    return await get_all_agents(db)

@router.get("/{agent_id}", response_model=Agent)
async def read_agent(agent_id: UUID, db: AsyncSession = Depends(get_db)):
    agent = await get_agent(db, str(agent_id))
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.post("/", response_model=Agent)
async def create_new_agent(
    agent: AgentCreate,
    db: AsyncSession = Depends(get_db)
):
    return await create_agent(db, agent.dict())

@router.post("/ai-generate", response_model=Agent)
async def create_new_agent(
    input: AgentGenerate,
    db: AsyncSession = Depends(get_db)
):
    # TODO: add AI generation
    # agent = await generate_sub_agent(db, input.user_prompt)

    # if agent:
    #     return await create_agent(db, agent.dict())
    # else:
        raise HTTPException(status_code=404, detail="Agent generation failed")

@router.put("/{agent_id}", response_model=Agent)
async def update_existing_agent(
    agent_id: UUID,
    agent: AgentUpdate,
    db: AsyncSession = Depends(get_db)
):
    updated = await update_agent(db, str(agent_id), agent.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Agent not found")
    return updated

@router.delete("/{agent_id}")
async def delete_existing_agent(
    agent_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    success = await delete_agent(db, str(agent_id))
    if not success:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"message": "Agent deleted successfully"}
