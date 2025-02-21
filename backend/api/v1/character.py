from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.character import Character
from backend.schemas.character import CharacterCreate
from backend.schemas.custom_oauth_bearer import get_current_user
from sqlalchemy.future import select

router = APIRouter()

@router.post("/create-character/")
async def create_character(
    character_data: CharacterCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):

    result = await db.execute(select(Character).filter_by(name=character_data.name, user_id=current_user.id))
    existing_character = result.scalars().first()

    if existing_character:
        raise HTTPException(status_code=400, detail="Character with this name already exists.")

    new_character = Character(
        name=character_data.name,
        race=character_data.race,
        class_type=character_data.class_type,
        user_id=current_user.id
    )

    db.add(new_character)
    await db.commit()
    await db.refresh(new_character)

    return {"message": "Character created successfully", "character": new_character}
