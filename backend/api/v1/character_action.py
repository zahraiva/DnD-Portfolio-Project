from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.character_action import CharacterAction
from backend.schemas.character_action import CharacterActionCreate, CharacterActionResponse, RollDiceResponse, StoryResponse
import openai
import os
from sqlalchemy.future import select
from backend.service import facades

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
    """Continues the story using OpenAI's GPT-3 based on character actions."""
    # Fetch character actions for the given game session
    actions = await facades.get_character_action(db, game_session_id)
    if not actions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No actions found for this session")

    # Build the prompt for OpenAI API based on character actions
    prompt = "The story so far:\n"
    for action in actions:
        prompt += f"{action.game_character.character.name} performs the action: '{action.action}' (rolled {action.roll_value})\n"

    prompt += "\nWhat happens next?"

    try:
        # Make the request to OpenAI API to continue the story
        openai.api_key = os.getenv("OPENAI_API_KEY")
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a Dungeon Master continuing a D&D adventure."},
                {"role": "user", "content": prompt},
            ]
        )
        ai_response = response["choices"][0]["message"]["content"]

        # Update the game session state in the database
        await facades.update_game_session_state(db, game_session_id, ai_response)

        return {"session_id": game_session_id, "story": ai_response}

    except openai.error.OpenAIError as e:
        # Handle OpenAI-specific exceptions
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"OpenAI API error: {e}")
    except Exception as e:
        # Handle other unexpected errors
        raise HTTPException(status_code=500, detail=f"Error generating story: {str(e)}")