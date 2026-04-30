import os
from pathlib import Path

# Base Directories
BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
ASSETS_DIR = BASE_DIR / "assets"
OUTPUT_DIR = BASE_DIR / "outputs"
AI_ENGINE_DIR = BASE_DIR / "ai_engine"

# Asset Subdirs
VIDEO_ASSETS = ASSETS_DIR / "videos"
IMAGE_ASSETS = ASSETS_DIR / "images"
AUDIO_ASSETS = ASSETS_DIR / "audio"

# Output Subdirs
VIDEO_OUTPUT = OUTPUT_DIR / "videos"
LOG_OUTPUT = OUTPUT_DIR / "logs"

# Ensure directories exist
for path in [VIDEO_ASSETS, IMAGE_ASSETS, AUDIO_ASSETS, VIDEO_OUTPUT, LOG_OUTPUT]:
    path.mkdir(parents=True, exist_ok=True)

# LLM Config
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

# Pexels Config (Stock Video)
PEXELS_API_KEY = "BR666hnurQiAFefNRxw9sCGxbvAKdFn3nquyag7oo10c62fD3CH4c9o3"

# TTS Config
TTS_VOICE = "en-US-GuyNeural"
AVAILABLE_VOICES = [
    {"name": "Guy (Male)", "id": "en-US-GuyNeural"},
    {"name": "Aria (Female)", "id": "en-US-AriaNeural"},
    {"name": "Christopher (Male)", "id": "en-US-ChristopherNeural"},
    {"name": "Jenny (Female)", "id": "en-US-JennyNeural"},
]

# Server Config
HOST = "0.0.0.0"
PORT = 8000
DEBUG = True
