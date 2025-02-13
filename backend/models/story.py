from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class Story(BaseModel):
    __tablename__ = "story"

    title = Column(String, unique=True, index=True)
    plot = Column(String)

    game_sessions = relationship("GameSession", back_populates="story")
