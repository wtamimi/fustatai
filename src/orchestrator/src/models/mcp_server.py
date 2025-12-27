from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from src.models.base import BaseModel

class McpServer(BaseModel):
    __tablename__ = 'mcp_server'
    __table_args__ = {'schema': 'config'}
    
    name = Column(String(100), nullable=False)
    description = Column(Text)
    transport = Column(String(50), default='stdio')
    mode = Column(String(50), default='autonomous')
    config_json = Column(JSONB, nullable=False)