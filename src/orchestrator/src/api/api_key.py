from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from src.core.database import get_db
from src.schemas.api_key import ApiKeyCreate, ApiKeyUpdate, ApiKey
from src.crud.api_key import (
    get_api_keys, get_api_key, create_api_key, update_api_key, delete_api_key
)

router = APIRouter(prefix="/api-keys", tags=["API Keys"])

@router.get("/", response_model=list[ApiKey])
async def list_api_keys(db: AsyncSession = Depends(get_db)):
    return await get_api_keys(db)

@router.get("/{key_id}", response_model=ApiKey)
async def read_api_key(key_id: UUID, db: AsyncSession = Depends(get_db)):
    key = await get_api_key(db, key_id)
    if not key:
        raise HTTPException(status_code=404, detail="API Key not found")
    return key

@router.post("/", response_model=ApiKey)
async def create(key: ApiKeyCreate, db: AsyncSession = Depends(get_db)):
    return await create_api_key(db, key)

@router.put("/{key_id}", response_model=ApiKey)
async def update(key_id: UUID, key: ApiKeyUpdate, db: AsyncSession = Depends(get_db)):
    updated = await update_api_key(db, key_id, key)
    if not updated:
        raise HTTPException(status_code=404, detail="API Key not found")
    return updated

@router.delete("/{key_id}", response_model=ApiKey)
async def delete(key_id: UUID, db: AsyncSession = Depends(get_db)):
    deleted = await delete_api_key(db, key_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="API Key not found")
    return deleted
