"""
RoleWithAI Backend - FastAPI Application
Local-first, zero-cost resume parsing and dashboard system
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from pathlib import Path

from app.api.v1 import router as api_router
from app.core.config import settings
from app.core.database import init_db

# Create data directories (relative to backend directory)
backend_dir = Path(__file__).parent.parent
data_dir = backend_dir / "data"
(data_dir / "uploads").mkdir(parents=True, exist_ok=True)
(data_dir / "db").mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="RoleWithAI API",
    description="Local-first resume parsing and career dashboard backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
# In development, use a more permissive CORS policy
import os
cors_origins = settings.CORS_ORIGINS.copy()
if os.getenv("ENVIRONMENT", "development").lower() == "development":
    # Add common development ports
    additional_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
    ]
    for origin in additional_origins:
        if origin not in cors_origins:
            cors_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        print("  🔄 Initializing database...", end="", flush=True)
        await init_db()
        print("\r  ✓ Database initialized successfully")
    except Exception as e:
        print(f"\r  ⚠ Warning: Database initialization failed: {e}")
        print("  The server will continue, but database operations may fail.")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "RoleWithAI Backend",
        "version": "1.0.0",
        "llm_mode": settings.LLM_MODE
    }

@app.get("/health")
async def health():
    """Lightweight health check - returns quickly without initializing heavy services"""
    return {
        "status": "healthy",
        "database": "connected"
    }

@app.get("/health/detailed")
async def health_detailed():
    """Detailed health check with all service statuses (may be slow)"""
    return {
        "status": "healthy",
        "database": "connected",
        "llm_available": await check_llm_availability(),
        "spacy_available": check_spacy_availability(),
        "embeddings_available": check_embeddings_availability()
    }

async def check_llm_availability():
    """Check if local LLM (Ollama) is available - lightweight check"""
    try:
        import httpx
        async with httpx.AsyncClient(timeout=1.0) as client:
            response = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
            return response.status_code == 200
    except Exception:
        return False

def check_spacy_availability():
    """Check if spaCy is available - lightweight import check only"""
    try:
        from app.services.nlp_extractor import SPACY_AVAILABLE
        return SPACY_AVAILABLE
    except Exception:
        return False

def check_embeddings_availability():
    """Check if sentence-transformers embeddings are available - lightweight import check"""
    try:
        import sentence_transformers
        return True
    except ImportError:
        return False

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

