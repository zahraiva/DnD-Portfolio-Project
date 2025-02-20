
from pydantic import BaseModel
from uuid import UUID

class SignupResponse(BaseModel):
    msg: str
    user_id: UUID

class LoginResponse(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str