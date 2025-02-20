
from sqlalchemy import Column, DateTime, String
import uuid
from datetime import datetime, UTC
from backend.database import Base

class BaseModel(Base):
    __abstract__ = True

    id = Column(String(36), primary_key=True, unique=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)
