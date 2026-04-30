import asyncio
import uuid
import os
from ai_engine.processors.scene_builder import SceneBuilder
from tts_engine.tts_service import TTSService
from video_engine.renderer import VideoRenderer
from video_engine.clip_manager import ClipManager
from backend.config import VIDEO_OUTPUT, IMAGE_ASSETS, AUDIO_ASSETS, PEXELS_API_KEY
from pathlib import Path

class VideoPipeline:
    def __init__(self):
        self.scene_builder = SceneBuilder()
        self.tts_service = TTSService()
        self.renderer = VideoRenderer()
        self.clip_manager = ClipManager()

    def create_job_id(self):
        return str(uuid.uuid4())

    async def run_full_pipeline(self, job_id: str, title: str, content: str, voice_id: str, job_store: dict):
        try:
            # 1. Generate Scenes
            job_store[job_id].update({"status": "Generating scenes with AI...", "progress": 20})
            scenes_data = self.scene_builder.build_scenes(title, content)
            if not scenes_data:
                raise Exception("Failed to generate scenes")

            job_dir = VIDEO_OUTPUT / job_id
            job_dir.mkdir(parents=True, exist_ok=True)

            processed_scenes = []
            scene_videos = []
            total_scenes = len(scenes_data)

            for i, scene in enumerate(scenes_data):
                scene_id = i + 1
                progress = 20 + int((i / total_scenes) * 60)
                job_store[job_id].update({
                    "status": f"Processing scene {scene_id} of {total_scenes}...",
                    "progress": progress
                })
                
                # 2. Generate Audio
                audio_filename = f"scene_{scene_id}"
                audio_path = await self.tts_service.generate_audio(
                    scene["narration"], f"{job_id}_{audio_filename}", voice=voice_id
                )
                
                duration = 5.0 
                try:
                    from mutagen.mp3 import MP3
                    duration = MP3(audio_path).info.length
                except:
                    pass

                # 3. Handle Visuals (Prioritizing 'Real' for People/Orgs)
                visual_query = scene["visual_description"]
                is_person = visual_query.startswith("PERSON:")
                is_org = visual_query.startswith("ORG:")
                
                # Strip prefix for search
                clean_query = visual_query.split(":", 1)[1] if ":" in visual_query else visual_query
                
                visual_path = None
                
                if is_person:
                    # FOR PEOPLE: Always try Real Photo (Wikimedia) first!
                    visual_path = self.clip_manager.fetch_wikimedia_image(clean_query, scene_id, job_id)
                
                if not visual_path:
                    # Try Stock Video (Pexels/Pixabay)
                    visual_path = self.clip_manager.fetch_stock_video(clean_query, scene_id, job_id)
                
                if not visual_path:
                    # Try Stock Image or Wikimedia as fallback
                    visual_path = self.clip_manager.fetch_stock_image(clean_query, scene_id, job_id)

                if not visual_path:
                    # Final fallback: News Placeholder
                    visual_path = IMAGE_ASSETS / f"{job_id}_scene_{scene_id}.png"
                    self.renderer.generate_placeholder_image(clean_query[:50], str(visual_path))
                    visual_path = str(visual_path)

                # 4. Create Scene Video
                scene_video_path = job_dir / f"scene_{scene_id}.mp4"
                self.renderer.create_scene_video(
                    audio_path, visual_path, str(scene_video_path), 
                    duration, subtitle_text=scene["narration"]
                )
                
                scene_videos.append(str(scene_video_path))
                scene["audio_path"] = audio_path
                scene["visual_path"] = str(visual_path)
                scene["duration"] = duration
                processed_scenes.append(scene)

            # 5. Concatenate everything
            job_store[job_id].update({"status": "Rendering final video...", "progress": 90})
            final_video_path = VIDEO_OUTPUT / f"{job_id}_final.mp4"
            self.renderer.concatenate_videos(scene_videos, str(final_video_path))

            # 6. Success & Cleanup
            job_store[job_id].update({
                "status": "completed", 
                "progress": 100, 
                "video_url": f"/outputs/videos/{job_id}_final.mp4",
                "scenes": processed_scenes
            })

            # AUTO CLEANUP: Delete temp scene videos, audio clips, and stock assets
            print(f"Cleaning up temporary assets for job {job_id}...")
            for scene in processed_scenes:
                try:
                    if os.path.exists(scene["audio_path"]):
                        os.remove(scene["audio_path"])
                    if os.path.exists(scene["visual_path"]) and job_id in scene["visual_path"]:
                        os.remove(scene["visual_path"])
                except Exception as e:
                    print(f"Cleanup warning: Could not delete scene asset: {e}")
            
            # Delete scene video clips and their directory
            import shutil
            if job_dir.exists():
                shutil.rmtree(job_dir)

        except Exception as e:
            print(f"Pipeline error for job {job_id}: {e}")
            job_store[job_id].update({"status": f"error: {str(e)}", "progress": 0})
