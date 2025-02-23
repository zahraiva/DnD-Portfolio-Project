from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.story import Story
from backend.schemas.story import StoryCreate, StoryUpdate, StoryResponse
from backend.schemas.custom_oauth_bearer import get_current_user
from sqlalchemy.future import select
from backend.service import facades

router = APIRouter(tags=["Story Operations"])

@router.post("/create-story/", response_model=StoryResponse)
async def create_story(
    story_data: StoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = await db.execute(select(Story).filter_by(title=story_data.title, dungeon_master_id=current_user.id))
    existing_story = result.scalars().first()

    if existing_story:
        raise HTTPException(status_code=400, detail="Story with this name already exists.")

    new_story = await facades.create_story(
        db=db,
        title=story_data.title,
        description=story_data.description,
        dungeon_master_id=current_user.id)

    return new_story

@router.get("/{story_id}", response_model=StoryResponse)
async def get_story(
        story_id: str,
        db: AsyncSession = Depends(get_db)
):
    story = await facades.get_story_by_id(db, story_id)
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story

@router.get("/get-all-stories", response_model=StoryResponse)
async def get_all_stories(db: AsyncSession = Depends(get_db)):
    stories = await facades.get_all_stories(db)
    return stories

@router.put("/update-story/{story_id}")
async def update_story(
        story_id: str,
        story_data: StoryUpdate,
        db: AsyncSession = Depends(get_db),
        current_user = Depends(get_current_user)
):
    updated_story = await facades.update_story(
        db=db,
        story_id=story_id,
        title=story_data.title,
        description=story_data.class_type,
        dungeon_master_id=current_user.id
    )

    if not updated_story:
        raise HTTPException(status_code=404, detail="Story not found or not owned by you")

    return updated_story

@router.delete("/{story_id}")
async def delete_story(
    story_id: str,
    db: AsyncSession = Depends(get_db)
):
    story = await facades.get_character_by_id(db, story_id)
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    await facades.delete_story(db, story_id)
    return {"detail": "Story deleted successfully"}