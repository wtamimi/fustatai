from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from src.schemas.api_key import ApiKey
from src.schemas.mcp_server import McpServer

class AgentMcpServerBase(BaseModel):
    mcp_server_id: UUID

class AgentMcpServer(AgentMcpServerBase):
    mcp_server: McpServer
    
    class Config:
        from_attributes = True

class AgentBase(BaseModel):
    name: str
    description: Optional[str] = None
    role: str
    task: str
    instructions: str
    publish_as_app: bool = False  # New field with default
    app_type: str = "Productivity"  # New field with default
    api_key_id: UUID
    mcp_servers: List[AgentMcpServerBase] = []

class AgentCreate(AgentBase):
    pass

class AgentUpdate(AgentBase):
    pass

class Agent(AgentBase):
    id: UUID
    api_key: ApiKey
    mcp_servers: List[AgentMcpServer] = []

    class Config:
        from_attributes = True

class AgentGenerate(BaseModel):
    user_prompt: str
