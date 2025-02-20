from backend.models import Character, DungeonMaster
from abc import ABC, abstractmethod
from sqlalchemy.orm import Session

class BaseRepository(ABC):
    @abstractmethod
    def create(self, db: Session, model, **kwargs):
        pass

    @abstractmethod
    def get_by_id(self, db: Session, model, object_id: str):
        pass

    @abstractmethod
    def update(self, db: Session, model, object_id: str, **kwargs):
        pass

    @abstractmethod
    def delete(self, db: Session, model, object_id: str):
        pass


class DungeonMasterRepository(BaseRepository):
    def create(self, db: Session, model, **kwargs):
        obj = model(**kwargs)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    def get_by_id(self, db: Session, model, object_id: str):
        return db.query(model).filter(model.id == object_id).first()

    def update(self, db: Session, model, object_id: str, **kwargs):
        db_obj = db.query(model).filter(model.id == object_id).first()
        if db_obj:
            for key, value in kwargs.items():
                setattr(db_obj, key, value)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        return None

    def delete(self, db: Session, model, object_id: str):
        db_obj = db.query(model).filter(model.id == object_id).first()
        if db_obj:
            db.delete(db_obj)
            db.commit()
            return db_obj
        return None

    def create_character(self, db: Session, dungeon_master_id: str, name: str, race: str, class_type: str):
        db_dungeon_master = db.query(DungeonMaster).filter(DungeonMaster.id == dungeon_master_id).first()
        if db_dungeon_master:
            return self.create(db, Character, name=name, race=race, class_type=class_type)
        return None

    def get_character_by_id(self, db: Session, character_id: str):
        return self.get_by_id(db, Character, character_id)

    def update_character(self, db: Session, character_id: str, name: str, race: str, class_type: str):
        return self.update(db, Character, character_id, name=name, race=race, class_type=class_type)

    def delete_character(self, db: Session, character_id: str):
        return self.delete(db, Character, character_id)
