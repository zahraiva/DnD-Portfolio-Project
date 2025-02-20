from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class CharacterAction(BaseModel):
    __tablename__ = "character_action"

    game_session_id = Column(String(36), ForeignKey("game_session.id"), nullable=False)
    game_character_id = Column(String(36), ForeignKey("game_character.id"), nullable=False)
    roll_value = Column(Integer, nullable=True)
    action = Column(String(255), nullable=False)

    game_session = relationship("GameSession", back_populates="character_actions")
    game_character = relationship("GameCharacter", back_populates="character_actions")
