# RoleWithAI Backend - Implementation Guide

## Executive Summary

This backend system processes PDF resumes locally using open-source models (Ollama for LLM, spaCy for NER, sentence-transformers for embeddings). All data on the dashboard is derived directly from uploaded PDFs—no synthetic data. The system runs entirely locally with zero API costs until you choose to add optional cloud acceleration.

## Quick Start

### 1. Install Dependencies

**Linux/Mac:**
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

**Windows:**
```powershell
cd backend
.\setup.ps1
```

### 2. Install Ollama

Download from https://ollama.com and install. Then pull a model:

```bash
ollama pull llama3.2:3b  # Small, fast (recommended for laptops)
# OR
ollama pull llama3.1:8b    # Better quality, needs more RAM
```

### 3. Start the Server

```bash
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uvicorn app.main:app --reload
```

Visit http://localhost:8000/docs for API documentation.

## Architecture Overview

### Data Flow

```
PDF Upload → Text Extraction → Rule-based Extraction → LLM Refinement → Scoring → Storage
```

### Components

1. **PDF Parser** (`app/services/pdf_parser.py`)
   - Extracts text from PDF using PyMuPDF
   - Preprocesses and normalizes text
   - Extracts contact info with regex

2. **NLP Extractor** (`app/services/nlp_extractor.py`)
   - Uses spaCy for named entity recognition
   - Extracts sections (education, experience, skills)
   - Pattern matching for skills

3. **LLM Orchestrator** (`app/services/llm_orchestrator.py`)
   - Calls Ollama API for structured JSON parsing
   - Refines rule-based extraction
   - Generates project specifications

4. **Embeddings Service** (`app/services/embeddings.py`)
   - Generates embeddings using sentence-transformers
   - Stores embeddings for skill matching
   - Enables semantic search (future RAG)

5. **Resume Scorer** (`app/services/resume_scorer.py`)
   - Calculates 0-100 score based on heuristics
   - Considers skills, experience, projects, education

6. **Resume Pipeline** (`app/services/resume_pipeline.py`)
   - Orchestrates all components
   - Handles fallback when LLM unavailable
   - Returns structured parsed data

## API Usage Examples

### 1. Register User

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepass123"
  }'
```

### 2. Login

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=securepass123"
```

Save the `access_token` from response.

### 3. Upload Resume

```bash
curl -X POST "http://localhost:8000/api/v1/resume/upload" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/resume.pdf"
```

### 4. Get Dashboard

```bash
curl -X GET "http://localhost:8000/api/v1/dashboard/USER_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Generate Project

```bash
curl -X POST "http://localhost:8000/api/v1/projects/generate" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_id": "RESUME_ID",
    "difficulty": "beginner",
    "role_title": "Data Scientist"
  }'
```

## Testing with Sample Resume

The system is designed to work with real resumes. For testing:

1. Use a real PDF resume (e.g., "Kunal Goenka Resume.pdf" mentioned in requirements)
2. Upload via API or frontend
3. Check parsed JSON in response
4. Verify dashboard is enabled after upload

### Integration Test

```bash
# Run tests
pytest tests/

# With coverage
pytest --cov=app --cov-report=html
```

## Dashboard Gating Logic

**Critical Rule**: Dashboard is only enabled (`enabled: true`) when:
- User has at least one resume in database
- Resume has `parsed_json` populated

Frontend must check `/api/v1/dashboard/{user_id}` and only render dashboard if `enabled: true`.

## LLM Prompts

### Resume Parsing Prompt

The system uses a structured prompt to extract JSON from raw resume text. See `app/services/llm_orchestrator.py` for the exact prompt.

Key requirements:
- Output ONLY valid JSON
- Follow exact schema
- No markdown, no explanations

### Project Generation Prompt

Generates project specifications with:
- Title and description
- Dataset source (public/free only)
- Step-by-step instructions
- Deliverables
- Rubric for evaluation

## Database Schema

### Tables

- `users` - User accounts
- `resumes` - Uploaded resumes with parsed JSON
- `skills` - Skill catalog
- `user_skills` - User skill proficiency
- `projects` - Generated project specs
- `roles` - Role templates (for matching)

### Parsed JSON Structure

Stored in `resumes.parsed_json` as JSON string. See `IMPLEMENTATION_GUIDE.md` for full schema.

## Deployment

### Docker Compose

```bash
docker-compose up --build
```

Then pull Ollama model:
```bash
docker exec -it rolewithai-ollama-1 ollama pull llama3.2:3b
```

### Production Considerations

1. **Security**
   - Change `SECRET_KEY` in production
   - Use environment variables
   - Enable HTTPS
   - Add rate limiting

2. **Performance**
   - Use GPU for Ollama (faster inference)
   - Consider caching embeddings
   - Add Redis for job queue (future)

3. **Scaling**
   - Move to PostgreSQL for production
   - Use pgvector for embeddings
   - Add background job workers

## Troubleshooting

### LLM Not Available

**Error**: "LLM is not available"

**Solutions**:
1. Check Ollama is running: `ollama list`
2. Verify model is pulled: `ollama pull llama3.2:3b`
3. Check `OLLAMA_BASE_URL` in `.env`
4. Test Ollama API: `curl http://localhost:11434/api/tags`

### spaCy Model Not Found

**Error**: "OSError: Can't find model"

**Solution**:
```bash
python -m spacy download en_core_web_sm
```

### Database Locked

**Error**: "database is locked"

**Solution**: 
- Close other connections
- For development, delete `data/db/rolewithai.db` and restart

### Import Errors

**Error**: "ModuleNotFoundError"

**Solution**:
```bash
pip install -r requirements.txt
```

## Extending the System

### Adding New Extraction Fields

1. Update parsed JSON schema in `llm_orchestrator.py`
2. Add extraction logic in `nlp_extractor.py` or `pdf_parser.py`
3. Update `resume_scorer.py` if field affects scoring
4. Update database model if needed

### Adding Cloud LLM Option

1. Create new orchestrator class (e.g., `CloudLLMOrchestrator`)
2. Add config flag `USE_CLOUD_LLM`
3. Update `resume_pipeline.py` to use appropriate orchestrator

### Adding Background Jobs

1. Install RQ or Celery
2. Create job queue
3. Move heavy tasks (project generation) to background
4. Add WebSocket/SSE for status updates

## Performance Tips

1. **LLM Inference**: Use GPU if available (Ollama auto-detects)
2. **Embeddings**: Cache embeddings for common skills
3. **Database**: Use connection pooling
4. **File Storage**: Consider object storage for production

## Cost Analysis

**Current Setup (Zero Cost)**:
- Ollama: Free (local)
- spaCy: Free (local)
- sentence-transformers: Free (local)
- SQLite: Free
- File storage: Local disk

**Optional Cloud Acceleration**:
- GPU VPS: $10-50/month (for faster LLM)
- Cloud embeddings: $0.0001 per 1K tokens (if using API)
- Database: Free (SQLite) or $0-25/month (managed PostgreSQL)

## Next Steps

1. **Week 1**: Test with real resumes, fix parsing edge cases
2. **Week 2**: Add more robust error handling
3. **Week 3**: Implement background jobs for async processing
4. **Week 4**: Add WebSocket for real-time status updates
5. **Week 5**: Optimize LLM prompts for better accuracy
6. **Week 6**: Add skill matching against job descriptions
7. **Week 7**: Implement RAG for job recommendations
8. **Week 8**: Production hardening and deployment

## Support

For issues or questions:
1. Check `README.md` for common issues
2. Review test files for usage examples
3. Check API docs at `/docs` endpoint

