# RoleWithAI Backend

Production-grade FastAPI backend for resume parsing and career dashboard.

## 🏗️ Architecture

```
backend/
├── app/                    # Main application package
│   ├── api/v1/            # API endpoints
│   ├── core/              # Configuration & database
│   ├── models/            # SQLAlchemy models
│   ├── services/          # Business logic
│   └── prompts/          # LLM prompts
├── data/                  # Data storage (gitignored)
│   ├── db/               # SQLite database
│   └── uploads/          # Uploaded PDFs
├── tests/                # Test suite
└── docs/                 # Documentation
```

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Download spaCy model (optional, for better NER)
python -m spacy download en_core_web_sm

# Download Flair NER model (optional, for better entity extraction)
# Flair automatically downloads models on first use, but you can pre-download it:
python -c "from flair.models import SequenceTagger; SequenceTagger.load('ner-large')"
```

### Run Server

```bash
# Development
python app.py

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Server will be available at: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

## 📦 Core Services

### Required Services
- **PDFParser** - PDF text extraction (pdfplumber)
- **NLPExtractor** - Entity extraction (Flair NER + spaCy)
- **ResumePipeline** - Standard parsing pipeline
- **EnhancedResumePipeline** - Enhanced parsing with confidence scoring
- **ResumeNormalizer** - Data normalization
- **ResumeScorer** - Resume quality scoring

### Optional Services
- **LLMOrchestrator** - LLM integration (for project generation)
- **EmbeddingService** - Semantic embeddings (for skill matching)

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Resume
- `POST /api/v1/resume/upload` - Upload and parse resume
- `GET /api/v1/resume/{resume_id}` - Get parsed resume
- `GET /api/v1/resume` - List user resumes

### Dashboard
- `GET /api/v1/dashboard/{user_id}` - Get dashboard data
- `GET /api/v1/dashboard/{user_id}/stats` - Get dashboard stats

### Projects
- `POST /api/v1/projects/generate` - Generate AI project suggestion

## 🧪 Testing

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_resume_pipeline.py

# Run with coverage
pytest --cov=app tests/
```

## 📚 Documentation

See `docs/` directory for detailed documentation:
- `BACKEND_SYSTEM_DOCUMENTATION.md` - Complete system overview
- `BUILD_SUMMARY.md` - Build and deployment guide
- `IMPLEMENTATION_GUIDE.md` - Implementation details
- `OPTIMIZATION_SUMMARY.md` - Performance optimizations

## 🔧 Configuration

Configuration is managed in `app/core/config.py`:
- Database: SQLite (default) or PostgreSQL
- CORS: Configured for frontend access
- LLM: Optional Ollama integration

## 🐳 Docker

```bash
# Build image
docker build -t rolewithai-backend .

# Run with docker-compose
docker-compose up
```

## 📝 Development

### Code Structure
- **API Layer** (`app/api/v1/`) - Request/response handling
- **Service Layer** (`app/services/`) - Business logic
- **Model Layer** (`app/models/`) - Database models
- **Core** (`app/core/`) - Configuration and utilities

### Adding New Features
1. Add model in `app/models/`
2. Create service in `app/services/`
3. Add API endpoint in `app/api/v1/`
4. Write tests in `tests/`

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- CORS protection
- Input validation

## 📊 Performance

- Resume parsing: ≤ 0.4 seconds
- Zero external API costs (fully local)
- SQLite for development, PostgreSQL for production

## 🤝 Contributing

1. Follow PEP 8 style guide
2. Write tests for new features
3. Update documentation
4. Run linter before committing

## 📄 License

See LICENSE file for details.
