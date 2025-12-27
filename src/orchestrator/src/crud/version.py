from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.models.version import Version

async def get_versions(db: AsyncSession):
    result = await db.execute(
        select(Version).order_by(Version.release_date.desc()))
    return result.scalars().all()

async def get_latest_version(db: AsyncSession):
    result = await db.execute(
        select(Version).order_by(Version.release_date.desc()).limit(1))
    return result.scalar_one_or_none()