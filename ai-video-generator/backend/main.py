import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.routes import article
from backend.config import OUTPUT_DIR

app = FastAPI(title="AI Article to Video Generator")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for serving videos
app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR)), name="outputs")

# Routes
app.include_router(article.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Welcome to the AI Article to Video Generator API",
        "endpoints": {
            "process": "/api/process-article"
        }
    }

if __name__ == "__main__":
    import uvicorn
    from backend.config import HOST, PORT
    uvicorn.run(app, host=HOST, port=PORT)
