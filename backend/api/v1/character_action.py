from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.character_action import CharacterAction
from backend.models.game_character import GameCharacter
from backend.schemas.character_action import CharacterActionCreate, CharacterActionResponse, RollDiceResponse, StoryResponse
import openai
from openai import OpenAIError, Client
import os
from sqlalchemy.orm import joinedload
import asyncio
from sqlalchemy.future import select
from backend.service import facades
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/character-actions", tags=["Character Action Operations"])

@router.get("/roll-dice", response_model=RollDiceResponse)
async def roll_dice():
    dice_roll = await facades.roll_dice()
    return RollDiceResponse(dice_roll=dice_roll)

@router.post("/submit-action")
async def submit_action(
        action_data: CharacterActionCreate, db: AsyncSession = Depends(get_db)
):
    new_character_action = await facades.create_action(
        db,
        game_session_id=action_data.game_session_id,
        game_character_id=action_data.game_character_id,
        action=action_data.action,
        roll_value=action_data.roll_value
    )
    return {"message": "Character action submitted successfully", "Character_action": new_character_action}


@router.post("/continue-story/", response_model=StoryResponse)
async def continue_story(game_session_id: str, db: AsyncSession = Depends(get_db)):
    actions = await db.execute(
        select(CharacterAction)
        .options(
            joinedload(CharacterAction.game_character).joinedload(GameCharacter.character)
        )
        .where(CharacterAction.game_session_id == game_session_id)
    )
    actions = actions.scalars().all()

    if not actions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No actions found for this session")


    prompt = "The story so far:\n"
    for action in actions:
        prompt += f"{action.game_character.character.name} performs the action: '{action.action}' (rolled {action.roll_value})\n"

    prompt += "\nWhat happens next?"

    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="OpenAI API key is missing")


    client = Client(api_key=openai_api_key)

    try:

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a Dungeon Master continuing a D&D adventure."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=150,
        )

        ai_response = response.choices[0].message.content.strip()

        if "end game" in ai_response.lower():
            await facades.end_game_session(db, game_session_id)

        await facades.update_game_session_state(db, game_session_id, ai_response)

        return {"game_session_id": game_session_id, "story": ai_response}

    except OpenAIError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"OpenAI API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating story: {str(e)}")