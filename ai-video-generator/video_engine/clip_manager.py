import requests
import os
from backend.config import PEXELS_API_KEY, VIDEO_ASSETS, IMAGE_ASSETS, PIXABAY_API_KEY

class ClipManager:
    def __init__(self, pexels_key=PEXELS_API_KEY, pixabay_key=PIXABAY_API_KEY):
        self.pexels_key = pexels_key
        self.pixabay_key = pixabay_key
        self.pexels_url = "https://api.pexels.com/videos/search"
        self.pixabay_url = "https://pixabay.com/api/videos/"

    def fetch_stock_video(self, query: str, scene_id: int, job_id: str):
        # 1. Try Pexels
        if self.pexels_key:
            headers = {"Authorization": self.pexels_key}
        params = {
            "query": query,
            "per_page": 1,
            "page": scene_id, # Use scene_id as page to get different clips for each scene
            "orientation": "portrait",
            "size": "medium"
        }

        try:
            response = requests.get(self.pexels_url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()

            if data["videos"]:
                video_url = data["videos"][0]["video_files"][0]["link"]
                video_path = VIDEO_ASSETS / f"{job_id}_stock_{scene_id}.mp4"
                
                # Download the video
                print(f"Downloading stock video for query: {query}")
                v_res = requests.get(video_url)
                with open(video_path, "wb") as f:
                    f.write(v_res.content)
                return str(video_path)
        except Exception as e:
            print(f"Error fetching stock video: {e}")
        
        
        # 2. Try Pixabay (Fallback)
        if self.pixabay_key:
            return self.fetch_pixabay_video(query, scene_id, job_id)
        
        return None

    def fetch_pixabay_video(self, query: str, scene_id: int, job_id: str):
        print(f"Searching Pixabay for video: {query}")
        try:
            params = {
                "key": self.pixabay_key,
                "q": query,
                "per_page": 3,
                "page": scene_id, # Variety across scenes
                "video_type": "film"
            }
            res = requests.get(self.pixabay_url, params=params).json()
            if res.get("hits"):
                # Get the large version
                video_url = res["hits"][0]["videos"]["large"]["url"]
                video_path = VIDEO_ASSETS / f"{job_id}_pixabay_{scene_id}.mp4"
                
                v_res = requests.get(video_url)
                with open(video_path, "wb") as f:
                    f.write(v_res.content)
                return str(video_path)
        except Exception as e:
            print(f"Pixabay fetch failed: {e}")
        return None

    def fetch_stock_image(self, query: str, scene_id: int, job_id: str):
        # 1. Try Pexels first (Stock quality)
        if self.pexels_key:
            headers = {"Authorization": self.pexels_key}
            params = {"query": query, "per_page": 1, "orientation": "portrait"}
            try:
                url = "https://api.pexels.com/v1/search"
                response = requests.get(url, headers=headers, params=params)
                if response.status_code == 200:
                    data = response.json()
                    if data["photos"]:
                        img_url = data["photos"][0]["src"]["large2x"]
                        img_path = IMAGE_ASSETS / f"{job_id}_stock_{scene_id}.jpg"
                        res = requests.get(img_url)
                        with open(img_path, "wb") as f:
                            f.write(res.content)
                        return str(img_path)
            except:
                pass

        # 2. Try Wikimedia Commons (Real Public Figures / News)
        return self.fetch_wikimedia_image(query, scene_id, job_id)

    def fetch_wikimedia_image(self, query: str, scene_id: int, job_id: str):
        """
        Fetches a real image from Wikimedia Commons API.
        Great for public figures, buildings, and historical events.
        """
        print(f"Searching Wikimedia Commons for 'real' image: {query}")
        try:
            # First search for titles
            search_url = "https://commons.wikimedia.org/w/api.php"
            params = {
                "action": "query",
                "format": "json",
                "list": "search",
                "srsearch": query,
                "srnamespace": "6", # File namespace
                "srlimit": "1",
                "sroffset": scene_id - 1 # Get different images for different scenes
            }
            res = requests.get(search_url, params=params).json()
            
            if not res.get("query", {}).get("search"):
                return None

            file_title = res["query"]["search"][0]["title"]
            
            # Get the actual image URL
            img_info_params = {
                "action": "query",
                "format": "json",
                "prop": "imageinfo",
                "titles": file_title,
                "iiprop": "url"
            }
            info_res = requests.get(search_url, params=img_info_params).json()
            pages = info_res.get("query", {}).get("pages", {})
            for page_id in pages:
                image_url = pages[page_id]["imageinfo"][0]["url"]
                
                # Check if it's a valid image format
                if image_url.lower().endswith(('.jpg', '.jpeg', '.png')):
                    img_path = IMAGE_ASSETS / f"{job_id}_real_{scene_id}.jpg"
                    img_res = requests.get(image_url)
                    with open(img_path, "wb") as f:
                        f.write(img_res.content)
                    return str(img_path)
        except Exception as e:
            print(f"Wikimedia fetch failed: {e}")
        
        return None
