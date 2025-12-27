from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from enum import Enum

# Chat type -> chat with orchestrator or sub agent
# class AppType(str, Enum):
#     ORCHESTRATOR = "orchestrator"
#     AGENT = "agent"

class App(BaseModel):
    id: UUID
    name: str
    description: str
    icon: Optional[str] = None
    app_type: str # AppType = AppType.ORCHESTRATOR

    class Config:
        from_attributes = True