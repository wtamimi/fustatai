from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

# Request Models
class ChatRequest(BaseModel):
    conversation_id: UUID
    message: str = Field(..., example="Explain quantum computing", description="User's input message")

# Response Models
class ChatResponse(BaseModel):
    success: bool = Field(..., example=True, description="Request status")
    response: str = Field(..., example="Quantum computing uses qubits...", description="AI generated response")
    tokens_used: int = Field(..., example=42, description="Total tokens consumed")
    error: Optional[str] = Field(None, example="Invalid API key", description="Error message if any")
