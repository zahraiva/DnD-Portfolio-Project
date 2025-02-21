import asyncio
from fastapi import FastAPI
from backend.api.v1.auth import router as dungeon_router
from backend.api.v1.character import router as character_router
from backend.database import engine, Base
import uvicorn

app = FastAPI()

app.include_router(dungeon_router)
app.include_router(character_router)

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(create_tables())
    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True)
