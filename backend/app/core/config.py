"""
Application configuration using Pydantic settings
"""
from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path

class Settings(BaseSettings):
    # API Settings
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 * 24 * 60  # 30 days
    
    # CORS - Allow all localhost variants for development
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://0.0.0.0:3000",
        "http://0.0.0.0:3001",
        # Allow all localhost ports in development
        "http://localhost:*",
        "http://127.0.0.1:*",
    ]
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./data/db/rolewithai.db")
    
    # File Storage
    UPLOAD_DIR: Path = Path("./data/uploads")
    DATA_DIR: Path = Path("./data")
    
    # LLM Settings
    LLM_MODE: str = os.getenv("LLM_MODE", "local")  # local, ollama, llama.cpp
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
    LLM_MAX_TOKENS: int = 2000
    LLM_TEMPERATURE: float = 0.1  # Low temperature for structured output
    
    # Embeddings
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DIM: int = 384
    
    # spaCy Model (lightweight, optional)
    SPACY_MODEL: str = os.getenv("SPACY_MODEL", "en_core_web_sm")
    
    # Flair NER Model (primary NER model)
    USE_FLAIR_NER: bool = os.getenv("USE_FLAIR_NER", "true").lower() == "true"
    FLAIR_NER_MODEL: str = os.getenv("FLAIR_NER_MODEL", "ner-large")
    
    # HuggingFace Token (optional - for private/gated models)
    HUGGINGFACE_TOKEN: str = os.getenv("HUGGINGFACE_TOKEN", "")
    
    # Background Jobs
    ENABLE_BACKGROUND_JOBS: bool = True
    JOB_TIMEOUT_SECONDS: int = 300
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from .env file

settings = Settings()

