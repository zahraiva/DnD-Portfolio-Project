from pydantic import BaseModel, Field
from typing import Optional, List

class GameCharacterCreate(BaseModel):
    character_id: str
    game_session_id: str
    dungeon_master_id: str
    health: int = 100
    experience: int = 0
    level: int = 1
    inventory: list[str]
    status: str

class GameCharacterUpdate(BaseModel):
    health: int
    experience: int
    level: int
    inventory: list[str]
    status: str

class InventoryUpdate(BaseModel):
    add_items: Optional[list[str]] = None
    remove_items: Optional[list[str]] = None

class GameCharacterResponse(BaseModel):
    id: str
    game_session_id: str
    character_id: str
    health: int
    experience: int
    level: int
    inventory: List[str]
    status: str

