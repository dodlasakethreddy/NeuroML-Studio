import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load .env file
load_dotenv(BASE_DIR / ".env")

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "NeuroML Studio Backend")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "neuroml_production_jwt_secret_key_change_in_prod")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # Storage Paths
    STORAGE_DIR: str = str(BASE_DIR / os.getenv("STORAGE_DIR", "app/storage"))
    DATASETS_DIR: str = str(Path(STORAGE_DIR) / "datasets")
    MODELS_DIR: str = str(Path(STORAGE_DIR) / "trained_models")
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "50"))

    # Frontend URL & CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS",
        f"{FRONTEND_URL},http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
    )

    @property
    def cors_origins(self) -> List[str]:
        origins = [self.FRONTEND_URL] + [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
        return list(set(origins))

settings = Settings()

# Ensure storage directories exist
os.makedirs(settings.DATASETS_DIR, exist_ok=True)
os.makedirs(settings.MODELS_DIR, exist_ok=True)
