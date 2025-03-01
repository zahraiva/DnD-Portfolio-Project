from pydantic import BaseModel
from typing import Optional

class CharacterActionCreate(BaseModel):
    game_session_id: str
    game_character_id: str
    roll_value: Optional[int] = None
    action: str

class CharacterActionResponse(BaseModel):
    game_character_id: str
    action: str

class StoryResponse(BaseModel):
    game_session_id: str
    story: str

class RollDiceResponse(BaseModel):
    dice_roll: int