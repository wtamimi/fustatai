from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud.version import get_versions, get_latest_version
from src.schemas.version import Version
from src.core.database import get_db

router = APIRouter()

@router.get("/versions", response_model=list[Version])
async def get_all_versions(db: AsyncSession = Depends(get_db)):
    return await get_versions(db)

@router.get("/versions/current", response_model=Version)
async def get_current_version(db: AsyncSession = Depends(get_db)):
    result = await get_latest_version(db)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail="No records found"
        )
    return result