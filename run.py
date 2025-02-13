from fastapi import FastAPI
from backend.api.dungeon import router as dungeon_router

app = FastAPI()


app.include_router(dungeon_router)
