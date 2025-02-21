from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel
from typing import List

class DungeonMaster(BaseModel):
    __tablename__ = "dungeon_master"

    username = Column(String(100), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100), nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)

    characters = relationship("Character", back_populates="dungeon_master")
    story = relationship("Story", back_populates='dungeon_master')
    game_session = relationship("GameSession", back_populates="dungeon_master")
