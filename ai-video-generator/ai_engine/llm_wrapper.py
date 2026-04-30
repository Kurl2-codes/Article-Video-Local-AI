import requests
import json
from backend.config import OLLAMA_BASE_URL, OLLAMA_MODEL

class LLMWrapper:
    def __init__(self, model=OLLAMA_MODEL, base_url=OLLAMA_BASE_URL):
        self.model = model
        self.base_url = base_url

    def generate(self, prompt: str, system_prompt: str = "You are a helpful AI assistant."):
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "system": system_prompt,
            "stream": False
        }
        
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            return response.json().get("response", "")
        except Exception as e:
            print(f"Error calling Ollama: {e}")
            return None

    def generate_json(self, prompt: str, system_prompt: str = ""):
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "system": system_prompt,
            "format": "json",
            "stream": False
        }
        
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            return json.loads(response.json().get("response", "{}"))
        except Exception as e:
            print(f"Error calling Ollama for JSON: {e}")
            return None
