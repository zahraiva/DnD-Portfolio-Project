from backend.persistance.repository import DungeonMasterRepository
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models import DungeonMaster
from backend.utils.password import hash_password, verify_password
from backend.utils.token import create_access_token
from datetime import timedelta
from fastapi import HTTPException
from backend.schemas.auth import SignupResponse, LoginResponse, SignupRequest, LoginRequest
from sqlalchemy.future import select

class DungeonMasterFacade:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.dungeon_master_repo = DungeonMasterRepository()

    async def create_character(self, dungeon_master_id: str, name: str, race: str, class_type: str):
        return await self.dungeon_master_repo.create_character(self.db, dungeon_master_id, name, race, class_type)

    async def get_character_by_id(self, character_id: str):
        return await self.dungeon_master_repo.get_character_by_id(self.db, character_id)

    async def update_character(self, character_id: str, name: str, race: str, class_type: str):
        return await self.dungeon_master_repo.update_character(self.db, character_id, name, race, class_type)

    async def delete_character(self, character_id: str):
        return await self.dungeon_master_repo.delete_character(self.db, character_id)

    async def signup(self, data: SignupRequest) -> SignupResponse:
        user = await self.db.execute(select(DungeonMaster).filter(DungeonMaster.username == data.username))
        user = user.scalars().first()
        if user:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_password = hash_password(data.password)
        new_user = DungeonMaster(username=data.username, email=data.email, password=hashed_password)

        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)

        return SignupResponse(msg="User created successfully", user_id=new_user.id)

    async def login(self, data: LoginRequest) -> LoginResponse:
        user = await self.db.execute(select(DungeonMaster).filter(DungeonMaster.username == data.username))
        user = user.scalars().first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not verify_password(data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        access_token_expires = timedelta(minutes=30)
        access_token = await create_access_token(
            data={"sub": user.id, "username": user.username}, expires_delta=access_token_expires
        )

        return LoginResponse(access_token=access_token, token_type="bearer")
