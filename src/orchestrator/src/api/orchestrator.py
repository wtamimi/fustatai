from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud.orchestrator import (
    create_orchestrator,
    get_orchestrator,
    get_all_orchestrators,
    update_orchestrator,
    delete_orchestrator
)
from src.schemas.orchestrator import OrchestratorCreate, OrchestratorUpdate, OrchestratorResponse
from src.core.database import get_db
from uuid import UUID

router = APIRouter(prefix="/orchestrators", tags=["Agents"])

@router.post("/", response_model=OrchestratorResponse)
async def create_new_orchestrator(
    orchestrator: OrchestratorCreate,
    db: AsyncSession = Depends(get_db)
):
    result = await create_orchestrator(db, orchestrator.dict())
    if not result:
        raise HTTPException(status_code=400, detail="Error creating orchestrator")
    return result

@router.get("/", response_model=list[OrchestratorResponse])
async def read_all_orchestrators(db: AsyncSession = Depends(get_db)):
    return await get_all_orchestrators(db)

@router.get("/{orchestrator_id}", response_model=OrchestratorResponse)
async def read_orchestrator(
    orchestrator_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    orch = await get_orchestrator(db, str(orchestrator_id))
    if not orch:
        raise HTTPException(status_code=404, detail="Orchestrator not found")
    return orch

@router.put("/{orchestrator_id}", response_model=OrchestratorResponse)
async def update_existing_orchestrator(
    orchestrator_id: UUID,
    orchestrator: OrchestratorUpdate,
    db: AsyncSession = Depends(get_db)
):
    print(">>> Orchestrator Update Request:")
    print(orchestrator.model_dump_json(indent=2))
    updated = await update_orchestrator(db, str(orchestrator_id), orchestrator.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Orchestrator not found")
    return updated

@router.delete("/{orchestrator_id}")
async def delete_existing_orchestrator(
    orchestrator_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    success = await delete_orchestrator(db, str(orchestrator_id))
    if not success:
        raise HTTPException(status_code=404, detail="Orchestrator not found")
    return {"message": "Orchestrator deleted successfully"}