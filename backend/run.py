import asyncio
from fastapi import FastAPI
from backend.api.v1.auth import router as dungeon_router
from backend.api.v1.character import router as character_router
from backend.api.v1.story import router as story_router
from backend.api.v1.game_character import router as game_character_router
from backend.api.v1.game_session import router as game_session_router
from backend.api.v1.character_action import router as character_action_router
from backend.database import engine, Base
import uvicorn

app = FastAPI()

app.include_router(dungeon_router)
app.include_router(character_router)
app.include_router(story_router)
app.include_router(game_session_router)
app.include_router(game_character_router)
app.include_router(character_action_router)

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(create_tables())
    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True)
