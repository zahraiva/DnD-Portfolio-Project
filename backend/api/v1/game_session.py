from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.game_session import GameSession
from backend.schemas.game_session import GameSessionCreate, GameSessionResponse, GameSessionUpdate
from backend.schemas.custom_oauth_bearer import get_current_user
from sqlalchemy.future import select
from backend.service import facades
from typing import List

router = APIRouter(tags=["Game Session Operations"])

@router.post("/create-game_session/")
async def create_character(
    game_session_data: GameSessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await db.execute(select(GameSession).filter_by(title=game_session_data.title, dungeon_master_id=current_user.id))
    existing_game_session = result.scalars().first()

    if existing_game_session:
        raise HTTPException(status_code=400, detail="Character with this name already exists.")

    new_game_session = await facades.create_game_session(
        db=db,
        title=game_session_data.title,
        dungeon_master_id=current_user.id,
        state=game_session_data.state,
        story_id=game_session_data.story_id)

    return {"message": "Game session created successfully", "game_session": new_game_session}

@router.get("/game_session/{game_session_id}", response_model=GameSessionResponse)
async def get_game_session(game_session_id: str, db: AsyncSession = Depends(get_db)):
    game_session = facades.get_game_session(db, game_session_id)
    if not game_session:
        raise HTTPException(status_code=404, detail="Game session not found")
    return await game_session

@router.get("/game_sessions/{dungeon_master_id}")
async def get_all_game_sessions_by_dungeon_master(dungeon_master_id: str, db: AsyncSession = Depends(get_db)):
    game_sessions = await facades.get_game_sessions_by_dungeon_master(db, dungeon_master_id)
    if not game_sessions:
        raise HTTPException(status_code=404, detail="There is no any game session belonging to you")
    return game_sessions

@router.patch("/game_session/{game_session_id}", response_model=GameSessionResponse)
async def patch_game_session(
        game_session_id: str,
        state: dict,
        db: AsyncSession = Depends(get_db)
):
    updated_gme_session = await facades.patch_game_session(db, game_session_id, state)
    return updated_gme_session

@router.patch("/game_session/{game_session_id}/complete")
async def complete_game_session(game_session_id: str, db: AsyncSession = Depends(get_db)):
    try:
        game_session = await facades.end_game_session(db, game_session_id)
        return {"message": "Game session completed", "game_session_id": game_session_id, "state": game_session.state}
    except HTTPException as e:
        raise e

@router.get("/game_session/{game_session_id}/completed")
async def get_completed_game_session(game_session_id: str, db: AsyncSession = Depends(get_db)):
    try:
        status = await facades.get_completed_game_session(db, game_session_id)
        return {"message": "Game session is completed", "game_session_id": game_session_id, "state": status}
    except HTTPException as e:
        raise e

@router.put("/game_session/{game_session_id}", response_model=GameSessionResponse)
async def update_game_session(game_session_id: str, game_session_data: GameSessionUpdate, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    updated_game_session = await facades.update_game_session(
        db=db,
        game_session_id=game_session_id,
        title=game_session_data.title,
        state=game_session_data.state,
        story_id=game_session_data.story_id
    )
    if not updated_game_session:
        raise HTTPException(status_code=404, detail="Game session not found or not owned by you")

    return updated_game_session

@router.delete("/game_session/{game_session_id}")
async def delete_game_session(
    game_session_id: str,
    db: AsyncSession = Depends(get_db)
):
    game_session = await facades.get_game_session(db, game_session_id)
    if not game_session:
        raise HTTPException(status_code=404, detail="Game session not found")
    await facades.delete_game_session(db, game_session_id)
    return {"detail": "Game session deleted successfully"}