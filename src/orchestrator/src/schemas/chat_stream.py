from pydantic import BaseModel, Field
from typing import Union, Literal, Any, Dict, Optional
from enum import Enum
from datetime import datetime
from uuid import UUID

# Request Models
# Chat Test model > Task: Legacy to be merged with ChatStreamRequest in the future
class ChatTestStreamRequest(BaseModel):
    conversation_id: UUID
    message: str

# Chat type -> chat with orchestrator or sub agent
class ChatType(str, Enum):
    ORCHESTRATOR = "orchestrator"
    SUB_AGENT = "agent"

# Chat mode -> chat in test mode (no tracking) or live mode
class ChatMode(str, Enum):
    TEST = "test"
    LIVE = "live"

# Chat Live model
class ChatStreamRequest(BaseModel):
    id: UUID
    chat_type: ChatType = ChatType.ORCHESTRATOR
    chat_mode: ChatMode = ChatMode.LIVE
    conversation_id: UUID
    message: str

# Response Models
class StreamEventType(str, Enum):
    """Event types for frontend consumption"""
    AGENT_UPDATED = "agent_updated"
    MESSAGE_DELTA = "message_delta"
    MESSAGE_COMPLETE = "message_complete"
    TOOL_CALL = "tool_call"
    TOOL_OUTPUT = "tool_output"
    HANDOFF = "handoff"
    ERROR = "error"
    STREAM_START = "stream_start"
    STREAM_END = "stream_end"

class StreamResponseEvent(BaseModel):
    """Standardized event format for frontend"""
    event_type: StreamEventType
    data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.now)
    session_id: Optional[str] = None
