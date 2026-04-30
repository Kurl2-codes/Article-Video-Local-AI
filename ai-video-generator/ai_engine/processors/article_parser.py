import trafilatura

class ArticleParser:
    @staticmethod
    def parse_url(url: str):
        downloaded = trafilatura.fetch_url(url)
        
        if not downloaded:
            # High-level fallback using cloudscraper to bypass Cloudflare/Bot-Shields
            try:
                import cloudscraper
                scraper = cloudscraper.create_scraper(
                    browser={
                        'browser': 'chrome',
                        'platform': 'windows',
                        'desktop': True
                    }
                )
                response = scraper.get(url, timeout=20)
                response.raise_for_status()
                downloaded = response.text
            except Exception as e:
                # Last ditch effort with requests if cloudscraper fails
                import requests
                headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'}
                try:
                    response = requests.get(url, headers=headers, timeout=15)
                    downloaded = response.text
                except:
                    raise Exception(f"Access Denied: This website is heavily protected. Please copy-paste the text instead. ({str(e)})")
        
        if not downloaded:
            raise Exception("Failed to fetch content from URL")
        
        # Extract title and content
        content = trafilatura.extract(downloaded, include_comments=False, include_tables=False)
        
        if content and ("Enable JavaScript" in content or "Cloudflare" in content or "Checking your browser" in content):
             raise Exception("This website is protected by a security puzzle. Please copy-paste the text manually!")
             
        if not content:
            # Try extraction without constraints if first attempt fails
            content = trafilatura.extract(downloaded)
            
        metadata = trafilatura.metadata.extract_metadata(downloaded) if hasattr(trafilatura, 'metadata') else None
        
        title = metadata.title if metadata and hasattr(metadata, 'title') and metadata.title else "Untitled Article"
        
        if not content:
            raise Exception("Failed to extract readable content from URL. Site might be protected.")
            
        return {
            "title": title,
            "content": content
        }
