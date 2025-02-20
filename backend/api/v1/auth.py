from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.service.facade import DungeonMasterFacade
from backend.database import get_db
from backend.schemas.auth import SignupRequest, LoginRequest, SignupResponse, LoginResponse

router = APIRouter()

@router.post("/signup", response_model=SignupResponse)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    user_facade = DungeonMasterFacade(db)
    return user_facade.signup(data)

@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user_facade = DungeonMasterFacade(db)
    return user_facade.login(data)
