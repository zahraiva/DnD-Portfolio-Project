from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


class BaseRepository(ABC):
    @abstractmethod
    async def create(self, db: AsyncSession, model, **kwargs):
        pass

    @abstractmethod
    async def get(self, db: AsyncSession, model, object_id: str):
        pass

    @abstractmethod
    async def get_by_attribute(self, db: AsyncSession, model, attribute: str, value):
        pass

    @abstractmethod
    async def get_all_by_attribute(self, db: AsyncSession, model, attribute: str, value):
        pass

    @abstractmethod
    async def update(self, db: AsyncSession, model, object_id: str, **kwargs):
        pass

    @abstractmethod
    async def delete(self, db: AsyncSession, model, object_id: str):
        pass

    async def get_all(self, db: AsyncSession, model):
        pass


class DungeonMasterRepository(BaseRepository):
    async def create(self, db: AsyncSession, model, **kwargs):
        obj = model(**kwargs)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

    async def get(self, db: AsyncSession, model, object_id: str):
        result = await db.execute(select(model).where(model.id == object_id))
        return result.scalars().first()

    async def get_by_attribute(self, db: AsyncSession, model, attribute: str, value):
        result = await db.execute(select(model).where(getattr(model, attribute) == value))
        return result.scalars().first()

    async def get_all_by_attribute(self, db: AsyncSession, model, attribute: str, value):
        result = await db.execute(select(model).where(getattr(model, attribute) == value))
        return result.scalars().all()

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

    async def get_all(self, db: AsyncSession, model):
        result = await db.execute(select(model))
        return result.scalars().all()


