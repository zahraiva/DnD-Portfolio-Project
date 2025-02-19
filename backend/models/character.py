from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class Character(BaseModel):
    __tablename__ = "character"

    name = Column(String, unique=True, index=True, nullable=False)
    class_type = Column(String, nullable=False)
    skills = Column(String, nullable=True)
    dungeonmaster_id = Column(ForeignKey("dungeon_master.id"), nullable=False)

    dungeon_master = relationship("DungeonMaster", back_populates="characters")
    game_characters = relationship("GameCharacter", back_populates="character")
    character_actions = relationship("CharacterAction", back_populates="character")
