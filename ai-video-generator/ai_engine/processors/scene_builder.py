from ai_engine.llm_wrapper import LLMWrapper
from pathlib import Path
import json

class SceneBuilder:
    def __init__(self):
        self.llm = LLMWrapper()
        self.prompt_path = Path(__file__).parent.parent / "prompts" / "scene_prompt.txt"

    def build_scenes(self, title: str, content: str):
        with open(self.prompt_path, "r") as f:
            template = f.read()
        
        prompt = template.format(title=title, content=content)
        system_prompt = "You are a professional video script writer. Output JSON only."
        
        result = self.llm.generate_json(prompt, system_prompt)
        if result and "scenes" in result:
            return result["scenes"]
        
        print("Ollama unavailable or failed. Falling back to Mock Scene Generation...")
        return self.mock_build_scenes(title, content)

    def mock_build_scenes(self, title: str, content: str):
        # Heuristic: Find important entities for stock footage search
        important_keywords = ["Duterte", "ICC", "Judge", "Court", "Philippines", "Human Rights", "Justice", "Police"]
        
        paragraphs = [p.strip() for p in content.split("\n") if len(p.strip()) > 20]
        if not paragraphs:
            paragraphs = [content]
            
        mock_scenes = []
        for i, para in enumerate(paragraphs[:5]): # Limit to 5 scenes for mock
            # Try to find matching keywords in the paragraph
            found = [k for k in important_keywords if k.lower() in para.lower()]
            
            # If "Duterte" is found, prioritize it
            if "Duterte" in found:
                visual = "Rodrigo Duterte Philippines president news coverage"
            elif "ICC" in found or "Court" in found or "Judge" in found:
                visual = "International Criminal Court building or gavel judge courtroom"
            elif found:
                visual = f"{found[0]} cinematic professional stock footage"
            else:
                visual = f"Cinematic news shot related to {title[:30]}"

            mock_scenes.append({
                "id": i + 1,
                "title": f"Part {i + 1}: {title[:30]}...",
                "narration": para,
                "visual_description": visual,
                "emotion": "informative"
            })
        return mock_scenes
