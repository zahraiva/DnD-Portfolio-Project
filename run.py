from fastapi import FastAPI
from backend.api.v1.auth import router as dungeon_router
from backend.database import engine, Base
import uvicorn

def create_tables():
    Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(dungeon_router)



if __name__ == "__main__":
    create_tables()
    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True)