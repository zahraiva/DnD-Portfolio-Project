from sqlalchemy.orm import Session
from backend.models import Character, DungeonMaster
from abc import ABC, abstractmethod
from sqlalchemy.orm import Session

class BaseRepository(ABC):
    @abstractmethod
    def create(self, db: Session, model, **kwargs):
        pass

    @abstractmethod
    def get_by_id(self, db: Session, model, id: int):
        pass

    @abstractmethod
    def update(self, db: Session, model, id: int, **kwargs):
        pass

    @abstractmethod
    def delete(self, db: Session, model, id: int):
        pass


class DungeonMasterRepository(BaseRepository):
    def create(self, db: Session, model, **kwargs):
        """
        Create a new record in the database for the given model.
        """
        obj = model(**kwargs)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    def get_by_id(self, db: Session, model, id: int):
        """
        Get a record by its ID.
        """
        return db.query(model).filter(model.id == id).first()

    def update(self, db: Session, model, id: int, **kwargs):
        """
        Update a record in the database by its ID.
        """
        db_obj = db.query(model).filter(model.id == id).first()
        if db_obj:
            for key, value in kwargs.items():
                setattr(db_obj, key, value)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        return None

    def delete(self, db: Session, model, id: int):
        """
        Delete a record in the database by its ID.
        """
        db_obj = db.query(model).filter(model.id == id).first()
        if db_obj:
            db.delete(db_obj)
            db.commit()
            return db_obj
        return None

    # Specific Methods for DungeonMaster
    def create_character(self, db: Session, dungeon_master_id: int, name: str, race: str, class_type: str):
        db_dungeon_master = db.query(DungeonMaster).filter(DungeonMaster.id == dungeon_master_id).first()
        if db_dungeon_master:
            return self.create(db, Character, name=name, race=race, class_type=class_type)
        return None

    def get_character_by_id(self, db: Session, character_id: int):
        """
        Get a character by its ID.
        """
        return self.get_by_id(db, Character, character_id)

    def update_character(self, db: Session, character_id: int, name: str, race: str, class_type: str):
        """
        Update a character by its ID.
        """
        return self.update(db, Character, character_id, name=name, race=race, class_type=class_type)

    def delete_character(self, db: Session, character_id: int):
        """
        Delete a character by its ID.
        """
        return self.delete(db, Character, character_id)
