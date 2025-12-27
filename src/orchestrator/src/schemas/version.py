from pydantic import BaseModel
from datetime import date
from uuid import UUID

class VersionBase(BaseModel):
    version_number: str
    release_date: date
    release_description: str

class VersionCreate(VersionBase):
    pass

class Version(VersionBase):
    id: UUID

    class Config:
        from_attributes = True