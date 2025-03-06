from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.character import Character
from backend.schemas.character import CharacterCreate, CharacterUpdate
from backend.schemas.custom_oauth_bearer import get_current_user
from sqlalchemy.future import select
from backend.service import facades

router = APIRouter(prefix="/characters", tags=["Character Operations"])

@router.post("/create-character/")
async def create_character(
    character_data: CharacterCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await db.execute(select(Character).filter_by(name=character_data.name, dungeon_master_id=current_user.id))
    existing_character = result.scalars().first()

    if existing_character:
        raise HTTPException(status_code=400, detail="Character with this name already exists.")

    new_character = await facades.create_character(
        db=db,
        name=character_data.name,
        class_type=character_data.class_type,
        skills=character_data.skills,
        dungeon_master_id=current_user.id)

    return {"message": "Character created successfully", "character": new_character}


@router.get("/get_all_characters")
async def get_all_characters(db: AsyncSession = Depends(get_db)):
    characters = await facades.get_all_characters(db)
    return characters

@router.get("/{character_id}")
async def get_character(
    character_id: str,
    db: AsyncSession = Depends(get_db),
):
    character = await facades.get_character_by_id(db, character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character

@router.get("/get-all-characters/{dungeon_master_id}")
async def get_characters_by_dungeon_master(
        dungeon_master_id: str,
        db: AsyncSession = Depends(get_db)
):
    characters = await facades.get_characters_by_dungeon_master(db, dungeon_master_id)
    if not characters:
        raise HTTPException(status_code=404, detail="There is no any character belonging to you")
    return characters

@router.put("/update_character/{character_id}")
async def update_character(
        character_id: str,
        character_data: CharacterUpdate,
        db: AsyncSession = Depends(get_db),
        current_user = Depends(get_current_user)
):
    updated_character = await facades.update_character(
        db=db,
        character_id=character_id,
        name=character_data.name,
        class_type=character_data.class_type,
        skills=character_data.skills,
        dungeon_master_id=current_user.id
    )

    if not updated_character:
        raise HTTPException(status_code=404, detail="Character not found or not owned by you")

    return {"message": "Character updated successfully", "Character": updated_character}

@router.delete("/{character_id}")
async def delete_character(
    character_id: str,
    db: AsyncSession = Depends(get_db)
):
    character = await facades.get_character_by_id(db, character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    await facades.delete_character(db, character_id)
    return {"detail": "Character deleted successfully"}