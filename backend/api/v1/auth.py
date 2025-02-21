from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.service.facade import DungeonMasterFacade
from backend.database import get_db
from backend.schemas.auth import SignupRequest, LoginRequest, SignupResponse, LoginResponse

router = APIRouter()

@router.post("/signup", response_model=SignupResponse)
async def signup(data: SignupRequest, db: Session = Depends(get_db)):
    user_facade = DungeonMasterFacade(db)
    return await user_facade.signup(data)

@router.post("/login", response_model=LoginResponse)
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    user_facade = DungeonMasterFacade(db)
    return await user_facade.login(data)
