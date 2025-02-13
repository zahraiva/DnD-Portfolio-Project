from pydantic import BaseModel, EmailStr
from typing import Optional

class DungeonMasterBase(BaseModel):
    username: str
    email: EmailStr

class DungeonMasterCreate(DungeonMasterBase):
    password: str

    class Config:
        orm_mode = True

class DungeonMasterLogin(BaseModel):
    email: EmailStr
    password: str

class DungeonMasterResponse(DungeonMasterBase):
    id: int
    is_admin: bool

    class Config:
        orm_mode = True
