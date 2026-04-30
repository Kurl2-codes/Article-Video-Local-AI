import asyncio
import edge_tts
from pathlib import Path
from backend.config import AUDIO_ASSETS

class TTSService:
    def __init__(self, voice="en-US-GuyNeural"):
        self.voice = voice

    async def generate_audio(self, text: str, output_name: str, voice: str = None):
        output_path = AUDIO_ASSETS / f"{output_name}.mp3"
        selected_voice = voice if voice else self.voice
        communicate = edge_tts.Communicate(text, selected_voice)
        await communicate.save(output_path)
        return str(output_path)

    def get_audio_duration(self, file_path: str):
        try:
            from mutagen.mp3 import MP3
            audio = MP3(file_path)
            return audio.info.length
        except Exception:
            return 5.0
