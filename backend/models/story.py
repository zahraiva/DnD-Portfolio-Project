from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class Story(BaseModel):
    __tablename__ = "story"

    title = Column(String(100), unique=True, index=True)
    description = Column(String(255))
    dungeon_master_id = Column(String(36), ForeignKey("dungeon_master.id"), nullable=False)

    game_sessions = relationship("GameSession", back_populates="story")
    map = relationship("Map", back_populates="story")
    dungeon_master = relationship("DungeonMaster", back_populates="story")