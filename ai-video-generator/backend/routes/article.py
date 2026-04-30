from fastapi import APIRouter, HTTPException, BackgroundTasks
from backend.models.schemas import ArticleRequest, ProcessArticleResponse, UrlRequest
from backend.services.pipeline import VideoPipeline
from ai_engine.processors.article_parser import ArticleParser

router = APIRouter()
pipeline = VideoPipeline()

# Simple in-memory job store
jobs = {}

@router.post("/process-article")
async def process_article(request: ArticleRequest, background_tasks: BackgroundTasks):
    job_id = pipeline.create_job_id()
    jobs[job_id] = {"status": "starting", "progress": 0, "video_url": None, "scenes": []}
    
    background_tasks.add_task(
        pipeline.run_full_pipeline, 
        job_id, request.title, request.content, request.voice_id, jobs
    )
    
    return {"job_id": job_id}

@router.post("/process-url")
async def process_url(request: UrlRequest, background_tasks: BackgroundTasks):
    try:
        article_data = ArticleParser.parse_url(request.url)
        job_id = pipeline.create_job_id()
        jobs[job_id] = {"status": "scraping", "progress": 10, "video_url": None, "scenes": []}
        
        background_tasks.add_task(
            pipeline.run_full_pipeline, 
            job_id, article_data["title"], article_data["content"], request.voice_id, jobs
        )
        
        return {"job_id": job_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process URL: {str(e)}")

@router.get("/job-status/{job_id}")
async def get_job_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]
