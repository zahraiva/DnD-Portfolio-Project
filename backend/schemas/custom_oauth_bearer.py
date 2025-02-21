from fastapi import Depends, HTTPException, Form
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import HTTPBearer
from backend.utils.token import verify_token, create_access_token
from backend.database import get_db
from backend.models.dungeon_master import DungeonMaster
from datetime import timedelta

http_token = HTTPBearer()

class CustomOAuthBearer:
    def __init__(self, email: str = Form(...), password: str = Form(...)):
        self.email = email
        self.password = password

async def get_token_from_credentials(token: str = Depends(http_token)):
    return token.credentials

async def get_current_user(token: str = Depends(get_token_from_credentials), db: AsyncSession = Depends(get_db)):
    try:
        payload = await verify_token(token)
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

    result = await db.execute(
        DungeonMaster.__table__.select().where(DungeonMaster.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

async def generate_access_token(user: DungeonMaster) -> str:
    access_token_expires = timedelta(minutes=30)
    return await create_access_token(
        data={"sub": user.id, "username": user.username}, expires_delta=access_token_expires
    )
