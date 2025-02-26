from pydantic import BaseModel
from typing import Dict, Any, Optional

class GameSessionCreate(BaseModel):
    title: str
    story_id: str
    dungeon_master_id: str
    state: Optional[Dict[str, Any]]

class GameSessionUpdate(BaseModel):
    title: Optional[str] = None
    dungeon_master_id: Optional[str] = None
    story_id: Optional[str] = None
    state: Optional[Dict] = None

class GameSessionResponse(GameSessionCreate):
    id: str
