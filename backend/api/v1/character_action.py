from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.character_action import CharacterAction
from backend.schemas.character_action import CharacterActionCreate, CharacterActionResponse, RollDiceResponse, StoryResponse
import openai
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

# @router.post("/continue_story/", response_model=StoryResponse)
# async def continue_story(game_session_id: str, db: AsyncSession = Depends(get_db)):
#     # Fetch the latest actions for the session
#     result = await db.execute(select(CharacterAction).filter(CharacterAction.game_session_id == game_session_id))
#     actions = result.scalars().all()
#
#     if not actions:
#         raise HTTPException(status_code=404, detail="No actions found for this session")
#
#     # Prepare prompt for AI
#     prompt = "The story so far:\n"
#     for action in actions:
#         prompt += f"{action.action} (rolled {action.roll_value})\n"
#
#     prompt += "\nWhat happens next?"
#
#     # Call OpenAI API (replace with your key)
#     openai.api_key = os.getenv("OPENAI_API_KEY")
#     response = await openai.ChatCompletion.acreate(
#         model="gpt-4",
#         messages=[{"role": "system", "content": "You are a Dungeon Master continuing a D&D adventure."},
#                   {"role": "user", "content": prompt}]
#     )
#
#     ai_response = response["choices"][0]["message"]["content"]
#
#     # Save AI response
#     new_story = Story(session_id=session_id, content=ai_response, created_at=datetime.utcnow())
#     db.add(new_story)
#     await db.commit()
#     await db.refresh(new_story)
#
#     return {"session_id": session_id, "story": ai_response}