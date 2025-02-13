from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class GameCharacter(BaseModel):
    __tablename__ = "game_character"

    character_id = Column(ForeignKey("character.id"), nullable=False)
    game_session_id = Column(ForeignKey("game_session.id"), nullable=False)

    character = relationship("Character", back_populates="game_characters")
    game_session = relationship("GameSession", back_populates="game_characters")
    character_actions = relationship("CharacterAction", back_populates="game_character")
