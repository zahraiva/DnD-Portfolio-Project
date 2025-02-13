from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class Map(BaseModel):
    __tablename__ = "map"

    name = Column(String, unique=True, index=True)
    description = Column(String)

    game_sessions = relationship("GameSession", back_populates="map")
