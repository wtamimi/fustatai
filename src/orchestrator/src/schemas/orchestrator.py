from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from src.schemas.api_key import ApiKey
from src.schemas.agent import Agent

class OrchestratorAgentBase(BaseModel):
    agent_id: UUID

class OrchestratorAgent(OrchestratorAgentBase):
    agent: Agent
    
    class Config:
        from_attributes = True

class OrchestratorBase(BaseModel):
    name: str
    description: str
    instructions: str
    publish_as_app: bool = True  # New field with default
    app_type: str = "Productivity"  # New field with default
    api_key_id: UUID
    agents: List[OrchestratorAgentBase] = []

class OrchestratorCreate(OrchestratorBase):
    pass

class OrchestratorUpdate(OrchestratorBase):
    pass

class OrchestratorResponse(OrchestratorBase):
    id: UUID
    api_key: ApiKey
    agents: List[OrchestratorAgent] = []

    class Config:
        from_attributes = True