from pydantic import BaseModel
from typing import Dict, Any, Optional
from uuid import UUID

class McpServerBase(BaseModel):
    name: str
    description: Optional[str] = None  # New field
    transport: str = "stdio"  # New field with default
    mode: str = "autonomous"  # New field with default
    config_json: Dict[str, Any]

class McpServerCreate(McpServerBase):
    pass

class McpServerUpdate(McpServerBase):
    pass

class McpServer(McpServerBase):
    id: UUID

    class Config:
        from_attributes = True