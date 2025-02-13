from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class DungeonMaster(BaseModel):
    __tablename__ = "dungeon_master"

    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_admin = Column(Boolean, default=False)

    game_sessions = relationship("GameSession", back_populates="dungeon_master")
