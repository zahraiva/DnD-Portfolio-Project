from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from backend.utils.token import verify_token
from backend.database import get_db
from backend.models.dungeon_master import DungeonMaster

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = verify_token(token)
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

    user = db.query(DungeonMaster).filter(DungeonMaster.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user