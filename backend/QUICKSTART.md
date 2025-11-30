# Quick Start Guide

Get RoleWithAI backend running in 5 minutes.

## Prerequisites

- Python 3.11+
- 8GB+ RAM
- Ollama (for LLM features)

## Step 1: Install Ollama

**Mac:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download from https://ollama.com/download

Then pull a model:
```bash
ollama pull llama3.2:3b
```

## Step 2: Setup Backend

```bash
cd backend

# Linux/Mac
chmod +x setup.sh && ./setup.sh

# Windows
.\setup.ps1
```

## Step 3: Start Server

```bash
# Activate virtual environment
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Start server
uvicorn app.main:app --reload
```

## Step 4: Test API

Visit http://localhost:8000/docs for interactive API documentation.

Or test with curl:

```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"test123"}'
```

## Docker Alternative

```bash
cd backend
docker-compose up --build

# In another terminal, pull model
docker exec -it rolewithai-ollama-1 ollama pull llama3.2:3b
```

## Next Steps

1. Upload a resume PDF via `/api/v1/resume/upload`
2. Check dashboard status via `/api/v1/dashboard/{user_id}`
3. Generate a project via `/api/v1/projects/generate`

See `IMPLEMENTATION_GUIDE.md` for detailed usage.

