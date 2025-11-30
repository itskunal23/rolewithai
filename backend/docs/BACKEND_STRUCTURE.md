# Backend Structure

## Directory Organization

```
backend/
├── app/                          # Main application package
│   ├── __init__.py
│   ├── main.py                   # FastAPI application
│   │
│   ├── api/                      # API routes
│   │   ├── __init__.py
│   │   └── v1/                   # API version 1
│   │       ├── __init__.py
│   │       ├── auth.py           # Authentication endpoints
│   │       ├── dashboard.py      # Dashboard data endpoints
│   │       ├── projects.py       # Project generation endpoints
│   │       └── resume.py         # Resume upload/management endpoints
│   │
│   ├── core/                     # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py            # Configuration settings
│   │   ├── database.py          # Database connection & initialization
│   │   └── utils.py             # Utility functions
│   │
│   ├── models/                   # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py              # User model
│   │   ├── resume.py            # Resume model
│   │   ├── project.py           # Project model
│   │   ├── skill.py             # Skill model
│   │   └── role.py              # Role model
│   │
│   ├── services/                 # Business logic services
│   │   ├── __init__.py
│   │   ├── pdf_parser.py        # PDF text extraction
│   │   ├── nlp_extractor.py     # NLP entity extraction
│   │   ├── resume_pipeline.py   # Standard resume parsing pipeline
│   │   ├── enhanced_resume_pipeline.py  # Enhanced parsing pipeline
│   │   ├── normalizer.py        # Data normalization
│   │   ├── resume_scorer.py     # Resume scoring
│   │   ├── llm_orchestrator.py  # LLM integration (for projects)
│   │   └── embeddings.py        # Embedding generation (optional)
│   │
│   └── prompts/                  # LLM prompts
│       ├── __init__.py
│       ├── resume_parse_system.md
│       └── project_generation_system.md
│
├── data/                          # Data storage (gitignored)
│   ├── db/                       # SQLite database
│   └── uploads/                  # Uploaded PDFs
│
├── tests/                         # Test suite
│   ├── __init__.py
│   ├── conftest.py              # Pytest configuration
│   ├── test_api.py              # API endpoint tests
│   ├── test_pdf_parser.py       # PDF parser tests
│   └── test_resume_pipeline.py  # Pipeline tests
│
├── docs/                          # Documentation
│   ├── BACKEND_SYSTEM_DOCUMENTATION.md
│   ├── BUILD_SUMMARY.md
│   └── ...
│
├── app.py                         # Application entry point
├── requirements.txt              # Python dependencies
├── pytest.ini                    # Pytest configuration
├── Dockerfile                    # Docker image definition
├── docker-compose.yml            # Docker compose configuration
├── Makefile                      # Build automation
└── README.md                     # Main documentation
```

## Service Dependencies

### Core Services (Always Used)
- `pdf_parser.py` - PDF text extraction
- `nlp_extractor.py` - Entity extraction
- `normalizer.py` - Data normalization
- `resume_scorer.py` - Resume scoring

### Pipeline Services
- `resume_pipeline.py` - Standard pipeline (fallback)
- `enhanced_resume_pipeline.py` - Enhanced pipeline (primary)

### Optional Services
- `llm_orchestrator.py` - Used for project generation
- `embeddings.py` - Used for semantic matching (optional)

## Entry Points

- **Development**: `python app.py` (uses `app/main.py`)
- **Production**: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- **Docker**: Uses `app/main.py` directly

## Data Storage

- **Database**: `backend/data/db/rolewithai.db`
- **Uploads**: `backend/data/uploads/{user_id}/`
- **Note**: `app/data/` is legacy and should be removed

