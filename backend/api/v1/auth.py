from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.service import facades
from backend.database import get_db
from backend.schemas.auth import SignupRequest, SignupResponse, LoginResponse
from backend.schemas.custom_oauth_bearer import CustomOAuthBearer

router = APIRouter(tags=["Authentication"])

@router.post("/signup", response_model=SignupResponse)
async def signup(data: SignupRequest, db: AsyncSession = Depends(get_db)):
    return await facades.signup(db, data)

@router.post("/login", response_model=LoginResponse)
async def login(formdata: CustomOAuthBearer = Depends(), db: AsyncSession = Depends(get_db)):
    return await facades.login(db, formdata)