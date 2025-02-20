from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class GameSession(BaseModel):
    __tablename__ = "game_session"

    dungeon_master_id = Column(String(36), ForeignKey("dungeon_master.id"))
    map_id = Column(String(36), ForeignKey("map.id"))
    story_id = Column(String(36), ForeignKey("story.id"))

    story = relationship("Story", back_populates="game_sessions")
    character_actions = relationship("CharacterAction", back_populates="game_session")
    game_characters = relationship("GameCharacter", back_populates="game_session")
    dungeon_master = relationship("DungeonMaster", back_populates='game_session')