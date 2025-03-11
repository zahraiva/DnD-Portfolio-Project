from pydantic import BaseModel
from typing import Optional, List

class CharacterCreate(BaseModel):
    name: str
    class_type: str
    skills: List[str]

class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    class_type: Optional[str] = None
    skills: Optional[List[str]] = None