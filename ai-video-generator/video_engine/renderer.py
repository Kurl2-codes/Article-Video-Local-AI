import subprocess
import os
import uuid
from pathlib import Path
from backend.config import VIDEO_OUTPUT, IMAGE_ASSETS

class VideoRenderer:
    def __init__(self):
        # Try to find ffmpeg in common locations if not in PATH
        self.ffmpeg_path = os.getenv("FFMPEG_PATH", "ffmpeg")
        
        # Simple check/fallback for common Windows installation paths
        if self.ffmpeg_path == "ffmpeg":
            common_paths = [
                r"C:\ffmpeg\bin\ffmpeg.exe",
                os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WinGet\Links\ffmpeg.exe"),
                os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin\ffmpeg.exe"),
            ]
            for p in common_paths:
                if os.path.exists(p):
                    self.ffmpeg_path = p
                    break
        print(f"Using FFmpeg at: {self.ffmpeg_path}")

    def wrap_text(self, text, width=45):
        import textwrap
        lines = textwrap.wrap(text, width=width)
        return "\n".join(lines[:2]) # Max 2 lines

    def create_scene_video(self, audio_path: str, visual_path: str, output_path: str, duration: float, subtitle_text: str = ""):
        """
        Creates a video clip for a single scene with optional subtitles.
        """
        is_video = visual_path.lower().endswith(('.mp4', '.mov', '.avi', '.jpg', '.jpeg', '.png'))
        # Actually is_video check above is a bit messy, let's fix
        visual_is_video = visual_path.lower().endswith(('.mp4', '.mov', '.avi'))
        
        # Prepare subtitle filter
        wrapped_text = self.wrap_text(subtitle_text)
        clean_text = wrapped_text.replace("'", "").replace(":", "").replace('"', "")
        font_path = "C\\:/Windows/Fonts/arial.ttf"
        subtitle_filter = (
            f"drawtext=text='{clean_text}':fontfile='{font_path}':fontcolor=white:fontsize=28:"
            f"box=1:boxcolor=black@0.6:boxborderw=8:x=(w-text_w)/2:y=h-220" # More compact for mobile
        )

        # Scale and crop for 9:16 vertical
        video_filter = f"scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,{subtitle_filter}"

        if not visual_is_video:
            cmd = [
                self.ffmpeg_path, "-y", "-loop", "1", "-i", visual_path, "-i", audio_path,
                "-c:v", "libx264", "-tune", "stillimage", "-r", "30", 
                "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2",
                "-pix_fmt", "yuv420p", "-t", str(duration), 
                "-vf", video_filter,
                "-map", "0:v", "-map", "1:a", # Force narration audio
                output_path
            ]
        else:
            cmd = [
                self.ffmpeg_path, "-y", "-stream_loop", "-1", "-i", visual_path, "-i", audio_path,
                "-c:v", "libx264", "-r", "30", 
                "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2", "-shortest",
                "-pix_fmt", "yuv420p", "-t", str(duration), 
                "-vf", video_filter,
                "-map", "0:v", "-map", "1:a", # Force narration audio
                output_path
            ]
        
        subprocess.run(cmd, check=True)
        return output_path

    def concatenate_videos(self, video_paths: list, final_output: str):
        """
        Concatenates scene clips using a direct command-line filter_complex.
        Includes a small delay to ensure Windows has released file locks.
        """
        import time
        time.sleep(1) # Give Windows a moment to release file handles

        if not video_paths:
            return None

        cmd = [self.ffmpeg_path, "-y"]
        for path in video_paths:
            cmd.extend(["-i", str(Path(path).absolute())])
            
        n = len(video_paths)
        filter_str = "".join([f"[{i}:v][{i}:a]" for i in range(n)])
        filter_str += f"concat=n={n}:v=1:a=1[v][a]"
        
        cmd.extend([
            "-filter_complex", filter_str,
            "-map", "[v]",
            "-map", "[a]",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-r", "30",
            "-c:a", "aac",
            "-b:a", "192k",
            "-ar", "44100",
            "-movflags", "+faststart",
            str(Path(final_output).absolute())
        ])
        
        print(f"Stitching {n} scenes...")
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            # Save error to a file for the user to see
            with open("ffmpeg_error.log", "w") as f:
                f.write(result.stderr)
            print(f"FFmpeg Error Details saved to ffmpeg_error.log")
            raise Exception(f"FFmpeg failed (Code {result.returncode})")
        
        return final_output

    def generate_placeholder_image(self, text: str, output_path: str):
        # Simplified to avoid drawtext font issues for now
        cmd = [
            self.ffmpeg_path,
            "-y",
            "-f", "lavfi",
            "-i", "color=c=indigo:s=1280x720:d=1",
            "-frames:v", "1",
            output_path
        ]
        subprocess.run(cmd, check=True)
        return output_path
