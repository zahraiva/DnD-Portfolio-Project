from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.models.basemodel import BaseModel

class Map(BaseModel):
    __tablename__ = "map"

    name = Column(String(100), unique=True, index=True)
    description = Column(String(255))
    story_id = Column(String(36), ForeignKey("story.id"), nullable=False)

    story = relationship("Story", back_populates="map")
