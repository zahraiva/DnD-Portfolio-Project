from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.service.facade import DungeonMasterFacade
from backend.database import SessionLocal
from typing import List

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Sign-up route
@router.post("/signup")
def signup(username: str, email: str, password: str, db: Session = Depends(get_db)):
    user_facade = DungeonMasterFacade(db)
    try:
        return user_facade.signup(username, email, password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Login route
@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user_facade = DungeonMasterFacade(db)
    try:
        return user_facade.login(username, password)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
