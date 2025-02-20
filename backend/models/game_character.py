from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class GameCharacter(BaseModel):
    __tablename__ = "game_character"

    character_id = Column(String(36), ForeignKey("character.id"), nullable=False)
    game_session_id = Column(String(36), ForeignKey("game_session.id"), nullable=False)
    dungeon_master_id = Column(String(36), ForeignKey('dungeon_master.id'))

    character = relationship("Character", back_populates="game_characters")
    game_session = relationship("GameSession", back_populates="game_characters")
    character_actions = relationship("CharacterAction", back_populates="game_character")
