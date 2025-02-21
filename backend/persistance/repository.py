from backend.models import Character, DungeonMaster
from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


class BaseRepository(ABC):
    @abstractmethod
    async def create(self, db: AsyncSession, model, **kwargs):
        pass

    @abstractmethod
    async def get_by_id(self, db: AsyncSession, model, object_id: str):
        pass

    @abstractmethod
    async def update(self, db: AsyncSession, model, object_id: str, **kwargs):
        pass

    @abstractmethod
    async def delete(self, db: AsyncSession, model, object_id: str):
        pass


class DungeonMasterRepository(BaseRepository):
    async def create(self, db: AsyncSession, model, **kwargs):
        obj = model(**kwargs)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

    async def get_by_id(self, db: AsyncSession, model, object_id: str):
        result = await db.execute(select(model).where(model.id == object_id))
        return result.scalars().first()

    async def update(self, db: AsyncSession, model, object_id: str, **kwargs):
        result = await db.execute(select(model).where(model.id == object_id))
        db_obj = result.scalars().first()

        if db_obj:
            for key, value in kwargs.items():
                setattr(db_obj, key, value)
            await db.commit()
            await db.refresh(db_obj)
            return db_obj
        return None

    async def delete(self, db: AsyncSession, model, object_id: str):
        result = await db.execute(select(model).where(model.id == object_id))
        db_obj = result.scalars().first()

        if db_obj:
            await db.delete(db_obj)
            await db.commit()
            return db_obj
        return None

    async def create_character(self, db: AsyncSession, dungeon_master_id: str, name: str, race: str, class_type: str):
        result = await db.execute(select(DungeonMaster).where(DungeonMaster.id == dungeon_master_id))
        db_dungeon_master = result.scalars().first()

        if db_dungeon_master:
            return await self.create(db, Character, name=name, race=race, class_type=class_type)
        return None

    async def get_character_by_id(self, db: AsyncSession, character_id: str):
        return await self.get_by_id(db, Character, character_id)

    async def update_character(self, db: AsyncSession, character_id: str, name: str, race: str, class_type: str):
        return await self.update(db, Character, character_id, name=name, race=race, class_type=class_type)

    async def delete_character(self, db: AsyncSession, character_id: str):
        return await self.delete(db, Character, character_id)
