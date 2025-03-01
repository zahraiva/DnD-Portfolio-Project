from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.schemas.game_character import GameCharacterCreate, GameCharacterResponse, GameCharacterUpdate, InventoryUpdate
from backend.service import facades
from typing import List

router = APIRouter(prefix="/game_characters", tags=["Game Character operations"])

@router.post("/")
async def create_game_character(game_character_data: GameCharacterCreate, db: AsyncSession = Depends(get_db)):
    new_game_character = await facades.create_game_character(db,
                                                         character_id=game_character_data.character_id,
                                                         game_session_id=game_character_data.game_session_id,
                                                         dungeon_master_id=game_character_data.dungeon_master_id,
                                                         health=game_character_data.health,
                                                         experience=game_character_data.experience,
                                                         level=game_character_data.level,
                                                         inventory=game_character_data.inventory)

    return {"message": "Game character created successfully", "game_character": new_game_character}

@router.get("/{game_session_id}/game_characters", response_model=List[GameCharacterResponse])
async def get_game_characters_by_session(game_session_id: str, db: AsyncSession = Depends(get_db)):
    game_characters = await facades.get_game_characters_by_game_session(db, game_session_id)
    if not game_characters:
        raise HTTPException(status_code=404, detail="There is no game character belonging to this game session")
    return game_characters

@router.get("/{game_character_id}", response_model=GameCharacterResponse)
async def get_game_character(game_character_id: str, db: AsyncSession = Depends(get_db)):
    game_character = await facades.get_game_character_by_id(db, game_character_id)
    if not game_character:
        raise HTTPException(status_code=404, detail="Game character not found")
    return game_character

@router.put("/{id}", response_model=GameCharacterResponse)
async def update_game_character(game_character_id: str, game_character_data: GameCharacterUpdate, db: AsyncSession = Depends(get_db)):
    updated_game_character = await facades.update_game_character(db,
                                                                 game_character_id,
                                                                 health=game_character_data.health,
                                                                 experience=game_character_data.experience,
                                                                 level=game_character_data.level,
                                                                 inventory=game_character_data.inventory,
                                                                 status=game_character_data.status)
    if not updated_game_character:
        raise HTTPException(status_code=404, detail="Game character not found")
    return updated_game_character

@router.patch("/{id}/inventory", response_model=GameCharacterResponse)
async def update_inventory(game_character_id: str, inventory_update: InventoryUpdate, db: AsyncSession = Depends(get_db)):
    return await facades.update_game_character_inventory(game_character_id,inventory_update.add_items, inventory_update.remove_items, db)

@router.delete("/{id}")
async def delete_game_character(game_character_id: str, db: AsyncSession = Depends(get_db)):
    game_character = await facades.get_game_character_by_id(db, game_character_id)
    if not game_character:
        raise HTTPException(status_code=404, detail="Game character not found")
    await facades.delete_game_character(db, game_character_id)
    return {"detail": "Game character deleted successfully"}