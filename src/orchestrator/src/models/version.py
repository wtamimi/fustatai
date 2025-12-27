from uuid6 import uuid7
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Date
from src.models.base import Base
from sqlalchemy.sql import func

class Version(Base):
    __tablename__ = "version"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid7)
    version_number = Column(String(50), nullable=False)
    release_date = Column(Date(), nullable=False, server_default=func.now())
    release_description = Column(String(255))
