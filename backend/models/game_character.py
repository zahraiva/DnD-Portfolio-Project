from sqlalchemy import Column, ForeignKey, String, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import JSON
from backend.models.basemodel import BaseModel

class GameCharacter(BaseModel):
    __tablename__ = "game_character"

    character_id = Column(String(36), ForeignKey("characters.id"), nullable=False)
    game_session_id = Column(String(36), ForeignKey("game_session.id"), nullable=False)
    dungeon_master_id = Column(String(36), ForeignKey('dungeon_master.id'))
    health = Column(Integer, default=100)
    experience = Column(Integer, default=0)
    level = Column(Integer, default=1)
    status = Column(String(36), default="active")
    inventory = Column(JSON, default=list)

    character = relationship("Character", back_populates="game_characters")
    game_session = relationship("GameSession", back_populates="game_characters")
    character_actions = relationship("CharacterAction", back_populates="game_character")
