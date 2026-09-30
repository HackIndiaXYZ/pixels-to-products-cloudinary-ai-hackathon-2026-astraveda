import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    BACKEND_HOST: str = os.getenv("BACKEND_HOST", "127.0.0.1")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8000"))

    @property
    def is_cloudinary_configured(self) -> bool:
        return bool(
            self.CLOUDINARY_CLOUD_NAME 
            and self.CLOUDINARY_API_KEY 
            and self.CLOUDINARY_API_SECRET
            and self.CLOUDINARY_CLOUD_NAME != "your_cloud_name"
        )

settings = Settings()
