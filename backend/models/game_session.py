from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import JSON
from backend.models.basemodel import BaseModel

class GameSession(BaseModel):
    __tablename__ = "game_session"

    title = Column(String(100), unique=True, index=True)
    dungeon_master_id = Column(String(36), ForeignKey("dungeon_master.id"))
    state = Column(JSON, nullable=False, default={})
    story_id = Column(String(36), ForeignKey("story.id"))

    story = relationship("Story", back_populates="game_sessions")
    character_actions = relationship("CharacterAction", back_populates="game_session")
    game_characters = relationship("GameCharacter", back_populates="game_session")
    dungeon_master = relationship("DungeonMaster", back_populates='game_session')