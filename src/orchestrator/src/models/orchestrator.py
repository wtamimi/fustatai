from sqlalchemy import Column, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from src.models.base import Base, BaseModel

class Orchestrator(BaseModel):
    __tablename__ = 'orchestrator'
    __table_args__ = {'schema': 'agents'}
    
    name = Column(String(100), nullable=False)
    description = Column(Text)
    instructions = Column(Text, nullable=False)
    publish_as_app = Column(Boolean, default=True)  # New column
    app_type = Column(String(50), default="Productivity")  # New column
    api_key_id = Column(ForeignKey('config.api_key.id', ondelete='RESTRICT'), nullable=False)
    
    # Only define the forward relationship to APIKey
    api_key = relationship("ApiKey")

    # Relationship to association table
    agent_associations = relationship(
        "OrchestratorSubAgent",
        back_populates="orchestrator",
        cascade="all, delete-orphan"
    )

    @hybrid_property
    def agents(self):
        return self.agent_associations

class OrchestratorSubAgent(Base):
    __tablename__ = 'orchestrator_sub_agent'
    __table_args__ = {'schema': 'agents'}
    
    orchestrator_id = Column(ForeignKey('agents.orchestrator.id', ondelete='CASCADE'), primary_key=True)
    agent_id = Column(ForeignKey('agents.agent.id', ondelete='RESTRICT'), primary_key=True)
    
    orchestrator = relationship("Orchestrator", back_populates="agent_associations")
    agent = relationship("Agent", back_populates="orchestrator_associations")