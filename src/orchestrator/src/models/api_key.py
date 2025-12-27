from sqlalchemy import Column, String #, ForeignKey
from src.models.base import BaseModel

class ApiKey(BaseModel):
    __tablename__ = 'api_key'
    __table_args__ = {'schema': 'config'}
    
    name = Column(String(100), nullable=False, unique=True)
    provider_name = Column(String(100), nullable=False)
    model_name = Column(String(100), nullable=False)
    base_url = Column(String(255), nullable=True)
    secret_key = Column(String(255), nullable=False)
