from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from src.models.api_key import ApiKey
from src.schemas.api_key import ApiKeyCreate, ApiKeyUpdate
#from sqlalchemy.orm import selectinload

async def get_api_keys(db: AsyncSession):
    #result = await db.execute(select(ApiKey).order_by(ApiKey.name))
    result = await db.execute(
        select(ApiKey)
        #.options(selectinload(ApiKey.model_definition))
        .order_by(ApiKey.name)
    )
    return result.scalars().all()

async def get_api_key(db: AsyncSession, key_id):
    #result = await db.execute(select(ApiKey).where(ApiKey.id == key_id))
    result = await db.execute(
        select(ApiKey)
        #.options(selectinload(ApiKey.model_definition))
        .where(ApiKey.id == key_id)
    )
    return result.scalar_one_or_none()

async def create_api_key(db: AsyncSession, api_key: ApiKeyCreate):
    db_obj = ApiKey(**api_key.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    # Manually reload with relationship loaded
    result = await db.execute(
        select(ApiKey)
        #.options(selectinload(ApiKey.model_definition))
        .where(ApiKey.id == db_obj.id)
    )
    return result.scalar_one()

async def update_api_key(db: AsyncSession, key_id, api_key: ApiKeyUpdate):
    update_data = api_key.model_dump()

    result = await db.execute(
        update(ApiKey)
        .where(ApiKey.id == key_id)
        .values(**update_data)
        .returning(ApiKey)
    )
    await db.commit()

    updated = result.scalar_one_or_none()

    if updated:
        # Reload with relationship
        result = await db.execute(
            select(ApiKey)
            #.options(selectinload(ApiKey.model_definition))
            .where(ApiKey.id == updated.id)
        )
        return result.scalar_one_or_none()
    else: 
        return None

async def delete_api_key(db: AsyncSession, key_id):
    # Query the object with relationship BEFORE deletion
    result = await db.execute(
        select(ApiKey)
        #.options(selectinload(ApiKey.model_definition))
        .where(ApiKey.id == key_id)
    )
    obj = result.scalar_one_or_none()

    if not obj:
        return None
    
    await db.delete(obj)
    await db.commit()
    return obj
