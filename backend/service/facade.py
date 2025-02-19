from backend.persistance.repository import DungeonMasterRepository
from sqlalchemy.orm import Session
from backend.models import DungeonMaster
from backend.utils.password import hash_password, verify_password
from backend.utils.Jwt import create_access_token
from datetime import timedelta
from typing import Any

class DungeonMasterFacade:
    def __init__(self, db: Session):
        self.db = db
        self.dungeon_master_repo = DungeonMasterRepository()

    def create_character(self, dungeon_master_id: int, name: str, race: str, class_type: str):
        """
        Facade method for creating a new character using DungeonMasterRepository.
        """
        return self.dungeon_master_repo.create_character(self.db, dungeon_master_id, name, race, class_type)

    def get_character_by_id(self, character_id: int):
        """
        Facade method for getting a character by its ID using DungeonMasterRepository.
        """
        return self.dungeon_master_repo.get_character_by_id(self.db, character_id)

    def update_character(self, character_id: int, name: str, race: str, class_type: str):
        """
        Facade method for updating a character using DungeonMasterRepository.
        """
        return self.dungeon_master_repo.update_character(self.db, character_id, name, race, class_type)

    def delete_character(self, character_id: int):
        """
        Facade method for deleting a character using DungeonMasterRepository.
        """
        return self.dungeon_master_repo.delete_character(self.db, character_id)

    def signup(self, username: str, email: str, password: str) -> dict:
        # Check if the user already exists
        user = self.db.query(DungeonMaster).filter(DungeonMaster.username == username).first()
        if user:
            raise Exception("User already exists")

        hashed_password = hash_password(password)
        new_user = DungeonMaster(username=username, email=email, hashed_password=hashed_password)

        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)

        return {"msg": "User created successfully", "user_id": new_user.id}

    def login(self, username: str, password: str) -> dict:
        # Get the user by username
        user = self.db.query(DungeonMaster).filter(DungeonMaster.username == username).first()
        if not user:
            raise Exception("Invalid credentials")

        if not verify_password(password, user.hashed_password):
            raise Exception("Invalid credentials")

        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        return {"access_token": access_token, "token_type": "bearer"}