from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class Character(BaseModel):
    __tablename__ = "character"

    name = Column(String(100), unique=True, index=True, nullable=False)
    class_type = Column(String(100), nullable=False)
    skills = Column(String(100), nullable=True)
    dungeon_master_id = Column(String(36), ForeignKey("dungeon_master.id"))

    dungeon_master = relationship("DungeonMaster", back_populates="character")
    game_characters = relationship("GameCharacter", back_populates="character")
