from pydantic import BaseModel
from typing import List, Optional

class ArticleRequest(BaseModel):
    title: str
    content: str
    voice_id: Optional[str] = None

class UrlRequest(BaseModel):
    url: str
    voice_id: Optional[str] = None

class Scene(BaseModel):
    id: int
    title: str
    narration: str
    visual_description: str
    emotion: str
    duration: Optional[float] = None
    audio_path: Optional[str] = None
    visual_path: Optional[str] = None

class VideoGenerationResponse(BaseModel):
    job_id: str
    status: str
    video_url: Optional[str] = None
    scenes: List[Scene]

class ProcessArticleResponse(BaseModel):
    scenes: List[Scene]
    job_id: str
    video_url: str
