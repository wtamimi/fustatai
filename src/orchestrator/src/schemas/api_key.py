from pydantic import BaseModel
from uuid import UUID
from typing import Optional
#from src.schemas.model_definition import ModelDefinition

class ApiKeyBase(BaseModel):
    name: str
    provider_name: str
    model_name: str
    base_url: Optional[str] = None
    secret_key: str
    #model_definition_id: UUID

class ApiKeyCreate(ApiKeyBase):
    pass

class ApiKeyUpdate(ApiKeyBase):
    pass

class ApiKey(ApiKeyBase):
    id: UUID
    #model_definition: ModelDefinition

    class Config:
        from_attributes = True