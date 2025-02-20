
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class Story(BaseModel):
    __tablename__ = "story"

    title = Column(String(100), unique=True, index=True)
    plot = Column(String(100))
    dungeon_master_id = Column(String(36), ForeignKey("dungeon_master.id"), nullable=False)