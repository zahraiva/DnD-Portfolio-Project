from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.character import Character
from backend.schemas.character import CharacterCreate
from backend.utils.dependencies import get_current_user

router = APIRouter()

@router.post("/create-character/")
def create_character(
    character_data: CharacterCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    existing_character = db.query(Character).filter_by(
        name=character_data.name, user_id=current_user.id
    ).first()

    if existing_character:
        raise HTTPException(status_code=400, detail="Character with this name already exists.")


    new_character = Character(
        name=character_data.name,
        race=character_data.race,
        class_type=character_data.class_type,
        user_id=current_user.id
    )

    db.add(new_character)
    db.commit()
    db.refresh(new_character)

    return {"message": "Character created successfully", "character": new_character}