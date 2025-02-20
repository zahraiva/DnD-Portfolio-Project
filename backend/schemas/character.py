from pydantic import BaseModel

class CharacterCreate(BaseModel):
    name: str
    race: str
    class_type: str