from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class GameSession(BaseModel):
    __tablename__ = "game_session"

    dungeon_master_id = Column(Integer, ForeignKey("dungeon_master.id"))
    map_id = Column(Integer, ForeignKey("map.id"))
    story_id = Column(Integer, ForeignKey("story.id"))

    dungeon_master = relationship("DungeonMaster", back_populates="game_sessions")
    map = relationship("Map", back_populates="game_sessions")
    story = relationship("Story", back_populates="game_sessions")
