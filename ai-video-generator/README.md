# AI Article to Video Generator 🎥

A production-ready pipeline that converts articles into narrated videos with structured scenes, AI narration, and automatic rendering.

## 🚀 Features
- **Llama 3 Powered**: Intelligent article decomposition into scenes.
- **AI Narration**: High-quality TTS for each scene.
- **FFmpeg Rendering**: Automated video assembly and concatenation.
- **Premium UI**: Modern, dark-themed Next.js interface with glassmorphism.

## 🛠️ Tech Stack
- **Frontend**: Next.js (React), TailwindCSS, Lucide Icons.
- **Backend**: FastAPI (Python), Uvicorn.
- **AI**: Ollama (Llama 3), Edge-TTS.
- **Video Engine**: FFmpeg.

## 📦 Installation

### 1. Prerequisites
- **Ollama**: [Download Ollama](https://ollama.com/) and run `ollama run llama3`.
- **FFmpeg**: Ensure `ffmpeg` is installed and in your system PATH.
- **Python 3.9+**
- **Node.js 18+**

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📂 Folder Structure
- `frontend/`: Next.js application.
- `backend/`: FastAPI server and orchestration logic.
- `ai_engine/`: LLM wrappers and prompt templates.
- `tts_engine/`: Text-to-speech generation logic.
- `video_engine/`: FFmpeg rendering and clip management.
- `assets/`: Temporary storage for generated audio/images.
- `outputs/`: Final rendered video files.

## 🔧 Configuration
Update `backend/config.py` to change:
- `OLLAMA_MODEL`: Default is `llama3`.
- `TTS_VOICE`: Default is `en-US-GuyNeural`.
- Storage paths for assets and outputs.

## 📝 Usage
1. Open the web UI at `http://localhost:3000`.
2. Enter an article title and paste the content.
3. Click **Generate AI Video**.
4. The system will:
   - Parse the article into scenes using Llama 3.
   - Generate narration for each scene.
   - Create visual placeholders for each scene.
   - Combine everything into a final `.mp4` file.
5. Preview and download the result!
