from sqlalchemy import Column, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from src.models.base import Base, BaseModel

class Agent(BaseModel):
    __tablename__ = 'agent'
    __table_args__ = {'schema': 'agents'}
    
    name = Column(String(150), nullable=False)
    description = Column(Text)
    role = Column(Text, nullable=False)
    task = Column(Text, nullable=False)
    instructions = Column(Text, nullable=False)
    publish_as_app = Column(Boolean, default=False)  # New column
    app_type = Column(String(50), default="Productivity")  # New column
    api_key_id = Column(ForeignKey('config.api_key.id', ondelete='RESTRICT'), nullable=False)
    
    # Only define the forward relationship to APIKey
    api_key = relationship("ApiKey")

    # Relationship to association table
    mcp_servers = relationship(
        "AgentMcpServer", 
        #back_populates="agent", 
        cascade="all, delete-orphan")

    orchestrator_associations = relationship(
        "OrchestratorSubAgent",
        back_populates="agent",
        cascade="all, delete-orphan"
    )

class AgentMcpServer(Base):
    __tablename__ = 'agent_mcp_server'
    __table_args__ = {'schema': 'agents'}
    
    agent_id = Column(ForeignKey('agents.agent.id', ondelete='CASCADE'), primary_key=True)
    mcp_server_id = Column(ForeignKey('config.mcp_server.id', ondelete='RESTRICT'), primary_key=True)
    
    agent = relationship("Agent")#, back_populates="mcp_server_associations")
    mcp_server = relationship("McpServer")