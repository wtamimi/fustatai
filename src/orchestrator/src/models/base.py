from sqlalchemy.ext.declarative import declared_attr
from uuid6 import uuid7
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.sql import func

class Base(DeclarativeBase):
    __abstract__ = True
    __table_args__ = {'schema': 'public'}
    
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

class BaseModel(Base):
    __abstract__ = True  # no table will be created for this class
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid7)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    created_by = Column(String(255), default='system')
    modified_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
    modified_by = Column(String(255), default='system')
