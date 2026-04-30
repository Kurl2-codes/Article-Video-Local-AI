import requests
import os
from backend.config import PEXELS_API_KEY, VIDEO_ASSETS

class ClipManager:
    def __init__(self, api_key=PEXELS_API_KEY):
        self.api_key = api_key
        self.base_url = "https://api.pexels.com/videos/search"

    def fetch_stock_video(self, query: str, scene_id: int):
        if not self.api_key:
            print("No Pexels API Key provided. Skipping stock video fetch.")
            return None

        headers = {"Authorization": self.api_key}
        params = {
            "query": query,
            "per_page": 1,
            "orientation": "portrait",
            "size": "medium"
        }

        try:
            response = requests.get(self.base_url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()

            if data["videos"]:
                video_url = data["videos"][0]["video_files"][0]["link"]
                video_path = VIDEO_ASSETS / f"stock_scene_{scene_id}.mp4"
                
                # Download the video
                print(f"Downloading stock video for query: {query}")
                v_res = requests.get(video_url)
                with open(video_path, "wb") as f:
                    f.write(v_res.content)
                return str(video_path)
        except Exception as e:
            print(f"Error fetching stock video: {e}")
        
        return None

    def fetch_stock_image(self, query: str, scene_id: int):
        if not self.api_key:
            return None

        headers = {"Authorization": self.api_key}
        params = {
            "query": query,
            "per_page": 1,
            "orientation": "portrait"
        }

        try:
            url = "https://api.pexels.com/v1/search"
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()

            if data["photos"]:
                img_url = data["photos"][0]["src"]["large2x"]
                img_path = IMAGE_ASSETS / f"stock_scene_{scene_id}.jpg"
                
                print(f"Downloading stock image for query: {query}")
                res = requests.get(img_url)
                with open(img_path, "wb") as f:
                    f.write(res.content)
                return str(img_path)
        except Exception as e:
            print(f"Error fetching stock image: {e}")
        
        return None
