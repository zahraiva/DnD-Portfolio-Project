import random
from typing import List
from sqlalchemy.orm.attributes import flag_modified
from backend.persistance.repository import DungeonMasterRepository
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models import DungeonMaster, Character, Story, GameSession, CharacterAction, GameCharacter
from backend.schemas.custom_oauth_bearer import CustomOAuthBearer
from backend.utils.password import hash_password, verify_password
from backend.utils.token import create_access_token
from datetime import timedelta
from fastapi import HTTPException
from backend.schemas.auth import SignupResponse, LoginResponse, SignupRequest
from sqlalchemy.future import select
from sqlalchemy import update

class DungeonMasterFacade:
    def __init__(self):
        self.dungeon_master_repo = DungeonMasterRepository()

    async def signup(self, db:AsyncSession, data: SignupRequest) -> SignupResponse:
        user = await db.execute(select(DungeonMaster).filter(DungeonMaster.username == data.username))
        user = user.scalars().first()
        if user:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_password = hash_password(data.password)
        new_user = await self.dungeon_master_repo.create(db, DungeonMaster, username=data.username, email=data.email, password=hashed_password)
        return SignupResponse(msg="User created successfully", user_id=new_user.id)

    async def login(self, db:AsyncSession, formdata: CustomOAuthBearer) -> LoginResponse:
        user = await db.execute(select(DungeonMaster).filter(DungeonMaster.username == formdata.username))
        user = user.scalars().first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not verify_password(formdata.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        access_token_expires = timedelta(minutes=30)
        access_token = await create_access_token(
            data={"sub": user.id, "username": user.username}, expires_delta=access_token_expires
        )

        return LoginResponse(access_token=access_token, token_type="bearer")

    async def create_character(self, db: AsyncSession, name: str, class_type: str, skills: str, dungeon_master_id: str):
        return await self.dungeon_master_repo.create(db, Character, name=name, class_type=class_type, skills=skills, dungeon_master_id=dungeon_master_id)

    async def get_character_by_id(self, db:AsyncSession, character_id: str):
        return await self.dungeon_master_repo.get(db, Character, character_id)

    async def get_all_characters(self, db: AsyncSession):
        return await self.dungeon_master_repo.get_all(db, Character)

    async def get_characters_by_dungeon_master(self, db: AsyncSession, dungeon_master_id: str):
        return await self.dungeon_master_repo.get_all_by_attribute(db, Character, "dungeon_master_id", dungeon_master_id)

    async def update_character(self, db:AsyncSession, character_id: str, name: str, class_type: str, skills: str, dungeon_master_id: str):
        return await self.dungeon_master_repo.update(db, Character, character_id, name=name, class_type=class_type, skills=skills, dungeon_master_id=dungeon_master_id)

    async def delete_character(self, db:AsyncSession, character_id: str):
        return await self.dungeon_master_repo.delete(db, Character, character_id)

    async def create_story(self, db: AsyncSession, title: str, description: str, dungeon_master_id: str):
        return await self.dungeon_master_repo.create(db, Story, title=title, description=description, dungeon_master_id=dungeon_master_id)

    async def get_story_by_id(self, db: AsyncSession, story_id):
        return await self.dungeon_master_repo.get(db, Story, story_id)

    async def get_stories_by_dungeon_master(self, db: AsyncSession, dungeon_master_id: str):
        return await self.dungeon_master_repo.get_all_by_attribute(db, Story, "dungeon_master_id", dungeon_master_id)

    async def get_story_by_title(self, db: AsyncSession, title: str):
        return await self.dungeon_master_repo.get_by_attribute(db, Story, "title", title)

    async def get_all_stories(self, db: AsyncSession):
        return await self.dungeon_master_repo.get_all(db, Story)

    async def update_story(self, db: AsyncSession, story_id: str, title: str, description: str, dungeon_master_id: str):
        return await self.dungeon_master_repo.update(db, Story, story_id, title=title, desciption=description, dungeon_master_id=dungeon_master_id)

    async def delete_story(self, db: AsyncSession, story_id: str):
        return await self.dungeon_master_repo.delete(db, Story, story_id)

    async def create_game_session(self, db: AsyncSession, title: str, dungeon_master_id: str, state: dict, story_id: str):
        return await self.dungeon_master_repo.create(db, GameSession, title=title, dungeon_master_id=dungeon_master_id, state=state, story_id=story_id)

    async def get_game_session(self, db: AsyncSession, game_session_id: str):
        return await self.dungeon_master_repo.get(db, GameSession, game_session_id)

    async def get_game_sessions_by_dungeon_master(self, db: AsyncSession, dungeon_master_id: str):
        return await self.dungeon_master_repo.get_all_by_attribute(db, GameSession, "dungeon_master_id", dungeon_master_id)

    async def patch_game_session(self, db: AsyncSession, game_session_id: str, state: dict):
        game_session = await self.get_game_session(db, game_session_id)
        if not game_session:
            raise HTTPException(status_code=404, detail="Game session not found")

        current_state = game_session.state if game_session.state else {}
        current_state.update(state)
        stmt = (
            update(GameSession)
            .where(GameSession.id == game_session_id)
            .values(state=current_state)
        )
        await db.execute(stmt)
        await db.commit()
        await db.refresh(game_session)
        return game_session

    async def end_game_session(self, db: AsyncSession, game_session_id: str):
        game_session = await self.get_game_session(db, game_session_id)
        if not game_session:
            raise HTTPException(status_code=404, detail="Game session not found")

        new_state = {"status": "completed"}
        return await self.patch_game_session(db, game_session_id, new_state)

    async def get_completed_game_session(self, db: AsyncSession, game_session_id: str):
        game_session = await self.get_game_session(db, game_session_id)
        if not game_session:
            raise HTTPException(status_code=404, detail="Game session not found")

        status = game_session.state.get("status")
        if status == "completed":
            return status
        else:
            raise HTTPException(status_code=400, detail="Game session is not completed")

    async def update_game_session(self, db: AsyncSession, game_session_id: str, title: str, story_id: str, state: dict):
        return await self.dungeon_master_repo.update(db, GameSession, game_session_id, title=title, story_id=story_id, state=state)

    async def delete_game_session(self, db: AsyncSession, game_session_id: str):
        return await self.dungeon_master_repo.delete(db, GameSession, game_session_id)

    async def create_game_character(self, db: AsyncSession,
                                    character_id: str,
                                    game_session_id: str,
                                    dungeon_master_id: str,
                                    health: int,
                                    experience: int,
                                    level: int,
                                    inventory: List[str]
                                    ):

        game_character = await self.dungeon_master_repo.create(
            db,
            GameCharacter,
            character_id=character_id,
            game_session_id=game_session_id,
            dungeon_master_id=dungeon_master_id,
            health=health,
            experience=experience,
            level=level,
            inventory=inventory
        )
        return game_character

    async def get_game_character_by_id(self, db: AsyncSession, game_character_id: str):
        return await self.dungeon_master_repo.get(db, GameCharacter, game_character_id)

    async def get_all_game_characters(self, db: AsyncSession):
        return await self.dungeon_master_repo.get_all(db, GameCharacter)

    async def get_game_characters_by_game_session(self, db: AsyncSession, game_session_id: str):
        return await self.dungeon_master_repo.get_all_by_attribute(db, GameCharacter, "game_session_id", game_session_id)

    async def update_game_character(self, db: AsyncSession, game_character_id: str, **kwargs):
        return await self.dungeon_master_repo.update(db, GameCharacter, game_character_id, **kwargs)

    async def delete_game_character(self, db: AsyncSession, game_character_id: str):
        return await self.dungeon_master_repo.delete(db, GameCharacter, game_character_id)

    async def update_game_character_inventory(self, game_character_id: str, add_items: list[str],
                                              remove_items: list[str], db: AsyncSession):
        result = await db.execute(select(GameCharacter).where(GameCharacter.id == game_character_id))
        game_character = result.scalars().first()

        if game_character is None:
            raise HTTPException(status_code=404, detail="Game character not found")

        if game_character.inventory is None:
            game_character.inventory = []

        for item in add_items:
            if item not in game_character.inventory:
                game_character.inventory.append(item)
        for item in remove_items:
            if item in game_character.inventory:
                game_character.inventory.remove(item)
        flag_modified(game_character, "inventory")

        await db.commit()
        await db.refresh(game_character)
        return game_character


    async def create_action(self, db: AsyncSession, game_session_id: str, game_character_id: str, roll_value: int, action: str):
        return await self.dungeon_master_repo.create(db, CharacterAction, game_session_id=game_session_id, game_character_id=game_character_id, roll_value=roll_value, action=action)

    async def roll_dice(self):
        return random.randint(1, 20)
