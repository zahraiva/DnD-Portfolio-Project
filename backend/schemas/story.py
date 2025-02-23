from pydantic import BaseModel

class StoryCreate(BaseModel):
    title: str
    description: str

class StoryUpdate(BaseModel):
    title: str | None = None
    description: str | None = None

class StoryResponse(BaseModel):
    id: str
    title: str
    description: str