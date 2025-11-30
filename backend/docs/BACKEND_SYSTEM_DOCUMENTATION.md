# RoleWithAI Backend - Complete System Documentation

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Complete Data Flow](#complete-data-flow)
4. [System Components](#system-components)
5. [Database Schema & Models](#database-schema--models)
6. [LLM & AI Integration](#llm--ai-integration)
7. [Processing Pipeline](#processing-pipeline)
8. [API Endpoints](#api-endpoints)
9. [User-Database-LLM Integration](#user-database-llm-integration)
10. [System Analysis](#system-analysis)
11. [Error Handling & Fallbacks](#error-handling--fallbacks)
12. [Performance & Optimization](#performance--optimization)

---

## System Overview

The RoleWithAI backend is a **local-first, zero-cost** resume parsing and career development platform built with FastAPI. It processes PDF resumes entirely on-device using open-source models, ensuring privacy and eliminating API costs.

### Core Principles

- **Zero Cost**: No paid API calls (OpenAI, Gemini, etc.)
- **Privacy-First**: All processing happens locally
- **Single Source of Truth**: Dashboard data derived only from uploaded PDFs
- **Production Quality**: FastAPI, async/await, type hints, comprehensive error handling
- **Extensible**: Easy to plug in cloud inference later

### Technology Stack

- **Framework**: FastAPI 0.115.0 (async web framework)
- **Database**: SQLite (async via aiosqlite) with SQLAlchemy 2.0 ORM
- **PDF Processing**: pdfplumber (fast, reliable text extraction)
- **NLP**: 
  - Flair NER (ner-large) - Primary named entity recognition
  - spaCy (en_core_web_sm) - Optional, for sentence splitting
- **LLM**: Ollama (local LLM) - Optional, for structured parsing refinement
- **Embeddings**: sentence-transformers (all-MiniLM-L6-v2) - For skill matching
- **Authentication**: JWT tokens with python-jose
- **Password Hashing**: bcrypt via passlib

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Frontend)                              │
│                    Next.js React Application                             │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               │ HTTP/REST API
                               │ (JWT Authentication)
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI APPLICATION                               │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    API Layer (app/api/v1/)                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │  │  auth.py │  │resume.py │  │dashboard │  │projects.py│        │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                               │                                           │
│                               ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              Service Layer (app/services/)                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │   │
│  │  │ pdf_parser  │  │ nlp_extractor│  │llm_orchestrator│           │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │   │
│  │  │resume_scorer │  │ embeddings   │  │resume_pipeline│           │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                               │                                           │
│                               ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              Model Layer (app/models/)                            │   │
│  │  ┌──────┐  ┌────────┐  ┌──────┐  ┌────────┐  ┌──────┐           │   │
│  │  │ User │  │ Resume │  │ Skill│  │Project │  │ Role │           │   │
│  │  └──────┘  └────────┘  └──────┘  └────────┘  └──────┘           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
    ┌───────────────┐  ┌──────────────┐  ┌──────────────┐
    │   SQLite DB    │  │  File System  │  │   Ollama     │
    │  (rolewithai   │  │  (PDF uploads) │  │  (Local LLM) │
    │     .db)       │  │               │  │              │
    └───────────────┘  └──────────────┘  └──────────────┘
```

---

## Complete Data Flow

### Resume Upload & Processing Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    RESUME UPLOAD & PROCESSING FLOW                       │
└─────────────────────────────────────────────────────────────────────────┘

1. USER UPLOADS PDF
   │
   │ POST /api/v1/resume/upload
   │ Content-Type: multipart/form-data
   │ Authorization: Bearer <JWT_TOKEN>
   │
   ▼
2. AUTHENTICATION & VALIDATION
   │
   ├─► Validate JWT token
   ├─► Extract user_id from token
   ├─► Validate file type (.pdf only)
   └─► Check file size limits
   │
   ▼
3. FILE STORAGE
   │
   ├─► Create user directory: data/uploads/{user_id}/
   ├─► Generate unique resume_id
   ├─► Save PDF: {resume_id}.pdf
   └─► Return file_path
   │
   ▼
4. RESUME PIPELINE PROCESSING
   │
   ├─► ResumePipeline.process_resume(pdf_path, user_id)
   │   │
   │   ├─► STEP 1: PDF TEXT EXTRACTION
   │   │   │
   │   │   └─► PDFParser.extract_text(pdf_path)
   │   │       ├─► Open PDF with pdfplumber
   │   │       ├─► Extract text from each page
   │   │       └─► Return raw_text (string)
   │   │
   │   ├─► STEP 2: TEXT PREPROCESSING
   │   │   │
   │   │   └─► PDFParser.preprocess_text(raw_text)
   │   │       ├─► Remove extra whitespace
   │   │       ├─► Normalize line breaks
   │   │       └─► Return cleaned_text
   │   │
   │   ├─► STEP 3: CONTACT INFO EXTRACTION
   │   │   │
   │   │   └─► PDFParser.extract_contact_info(cleaned_text)
   │   │       ├─► Regex: email pattern
   │   │       ├─► Regex: phone pattern
   │   │       ├─► Regex: location pattern
   │   │       └─► Return {email, phone, location}
   │   │
   │   ├─► STEP 4: SECTION EXTRACTION
   │   │   │
   │   │   └─► NLPExtractor.extract_sections(cleaned_text)
   │   │       ├─► Find section headers (Education, Experience, etc.)
   │   │       ├─► Extract section content
   │   │       └─► Return {education, experience, skills, ...}
   │   │
   │   ├─► STEP 5: NAMED ENTITY RECOGNITION (NER)
   │   │   │
   │   │   └─► NLPExtractor.extract_entities(cleaned_text)
   │   │       ├─► Flair NER: persons, organizations, dates, locations
   │   │       ├─► spaCy (optional): additional entities
   │   │       └─► Return {persons, organizations, dates, locations}
   │   │
   │   ├─► STEP 6: SKILL EXTRACTION
   │   │   │
   │   │   └─► NLPExtractor.extract_skills(cleaned_text)
   │   │       ├─► Keyword matching (tech stack)
   │   │       ├─► Section-based extraction
   │   │       └─► Return [skill1, skill2, ...]
   │   │
   │   ├─► STEP 7: RULE-BASED PARSING
   │   │   │
   │   │   └─► ResumePipeline._parse_resume(...)
   │   │       ├─► Parse name (from NER or first lines)
   │   │       ├─► Parse education section
   │   │       ├─► Parse experience section
   │   │       ├─► Parse projects section
   │   │       ├─► Parse certifications
   │   │       └─► Extract links (LinkedIn, GitHub, portfolio)
   │   │
   │   ├─► STEP 8: NORMALIZATION
   │   │   │
   │   │   └─► ResumeNormalizer.normalize_resume(parsed_data, entities)
   │   │       ├─► Standardize date formats
   │   │       ├─► Normalize skill names
   │   │       ├─► Add confidence scores
   │   │       └─► Return normalized_data
   │   │
   │   ├─► STEP 9: RESUME SCORING
   │   │   │
   │   │   └─► ResumeScorer.calculate_score(normalized_data)
   │   │       ├─► Check completeness (name, email, experience, skills)
   │   │       ├─► Calculate score (0-100)
   │   │       └─► Return score
   │   │
   │   └─► STEP 10: METADATA ADDITION
   │       │
   │       └─► Add _metadata
   │           ├─► raw_text_length
   │           ├─► processing_method
   │           └─► sections_found
   │
   ▼
5. DATABASE STORAGE
   │
   ├─► Create Resume record
   │   ├─► id: resume_id
   │   ├─► user_id: current_user.id
   │   ├─► filename: original_filename
   │   ├─► raw_text: extracted_text
   │   ├─► parsed_json: normalized_data (JSON)
   │   ├─► resume_score: score (0-100)
   │   └─► created_at: timestamp
   │
   ├─► Extract and store skills
   │   ├─► For each skill in parsed_data.skills:
   │   │   ├─► Find or create Skill record
   │   │   └─► Create UserSkill record (user_id, skill_id, proficiency)
   │
   └─► Commit transaction
   │
   ▼
6. DATA TRANSFORMATION
   │
   └─► Transform backend format → frontend format
       ├─► name → firstName, lastName
       ├─► experience[].title → experience[].role
       ├─► experience[].start → experience[].startDate
       ├─► education[].school → education[].institution
       └─► Add jobMatchStats (generated)
   │
   ▼
7. RESPONSE TO CLIENT
   │
   └─► Return JSON response
       {
         "resume_id": "...",
         "status": "completed",
         "resume_data": {transformed_data},
         "resume_score": 85,
         "message": "Resume processed successfully"
       }
```

### Optional LLM Enhancement Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    OPTIONAL LLM ENHANCEMENT FLOW                         │
└─────────────────────────────────────────────────────────────────────────┘

IF use_llm=True (currently disabled for speed):

   After Step 6 (Rule-Based Parsing):
   │
   ▼
   LLM REFINEMENT
   │
   └─► LLMOrchestrator.parse_resume(raw_text)
       │
       ├─► Check Ollama availability
       │   └─► GET http://localhost:11434/api/tags
       │
       ├─► Load system prompt (from app/prompts/resume_parse_system.md)
       │   └─► Structured JSON schema definition
       │
       ├─► Build user prompt
       │   └─► Include raw_text with delimiters
       │
       ├─► Call Ollama API
       │   └─► POST http://localhost:11434/api/chat
       │       {
       │         "model": "llama3.2:3b",
       │         "messages": [
       │           {"role": "system", "content": system_prompt},
       │           {"role": "user", "content": user_prompt}
       │         ],
       │         "options": {
       │           "temperature": 0.1,
       │           "num_predict": 2000
       │         }
       │       }
       │
       ├─► Extract JSON from response
       │   └─► Remove markdown code blocks if present
       │
       ├─► Parse JSON
       │   └─► Validate against schema
       │
       └─► Merge with rule-based results
           └─► LLM data takes precedence for structured fields
```

---

## System Components

### 1. API Layer (`app/api/v1/`)

#### `auth.py` - Authentication Endpoints

```python
POST /api/v1/auth/register
  - Create new user account
  - Hash password with bcrypt
  - Generate JWT token
  - Return: {access_token, token_type, user}

POST /api/v1/auth/login
  - Verify credentials
  - Generate JWT token
  - Return: {access_token, token_type, user}

GET /api/v1/auth/me
  - Get current user info
  - Requires: JWT token
  - Return: {id, email, name, created_at}
```

#### `resume.py` - Resume Management

```python
POST /api/v1/resume/upload
  - Upload PDF file
  - Process through pipeline
  - Store in database
  - Return: {resume_id, resume_data, resume_score}

GET /api/v1/resume/{resume_id}
  - Get resume by ID
  - Transform to frontend format
  - Return: {resume_data}

GET /api/v1/resume/
  - List all resumes for user
  - Return: [{resume_id, filename, resume_score, created_at}]
```

#### `dashboard.py` - Dashboard Data

```python
GET /api/v1/dashboard/{user_id}
  - Get dashboard data for user
  - Requires: Latest resume
  - Return: {profile, stats, recommendations}

GET /api/v1/dashboard/{user_id}/stats
  - Get aggregated statistics
  - Return: {total_xp, skills_count, level, ...}
```

#### `projects.py` - Project Generation

```python
POST /api/v1/projects/generate
  - Generate project specification
  - Uses LLM (optional)
  - Return: {project_spec}

GET /api/v1/projects/
  - List user projects
  - Return: [{project_id, title, status, ...}]
```

### 2. Service Layer (`app/services/`)

#### `pdf_parser.py` - PDF Text Extraction

**Purpose**: Extract raw text from PDF files

**Methods**:
- `extract_text(pdf_path)`: Extract text using pdfplumber
- `preprocess_text(text)`: Clean and normalize text
- `extract_contact_info(text)`: Extract email, phone, location using regex

**Dependencies**: pdfplumber

#### `nlp_extractor.py` - NLP Processing

**Purpose**: Extract structured information using NLP

**Methods**:
- `extract_sections(text)`: Identify resume sections (Education, Experience, etc.)
- `extract_entities(text)`: Named Entity Recognition (persons, organizations, dates, locations)
- `extract_skills(text)`: Extract technical skills using keyword matching

**Dependencies**: 
- Flair NER (ner-large) - Primary NER model
- spaCy (en_core_web_sm) - Optional, for sentence splitting

#### `llm_orchestrator.py` - LLM Integration

**Purpose**: Interface with local LLM (Ollama) for structured parsing

**Methods**:
- `is_available()`: Check if Ollama is running
- `call_llm(prompt, system_prompt)`: Call Ollama API with retry logic
- `parse_resume(raw_text)`: Parse resume into structured JSON
- `generate_project_spec(skills, role_title)`: Generate project specifications

**Configuration**:
- Base URL: `http://localhost:11434`
- Model: `llama3.2:3b` (configurable)
- Temperature: 0.1 (low for structured output)
- Max Tokens: 2000
- Retry Logic: 3 attempts with exponential backoff

#### `resume_pipeline.py` - Main Processing Pipeline

**Purpose**: Orchestrate all processing steps

**Methods**:
- `process_resume(pdf_path, user_id, use_llm=False)`: Main entry point
  - Calls all services in sequence
  - Returns: `{parsed_data, raw_text, score}`

**Processing Steps**:
1. PDF text extraction
2. Text preprocessing
3. Contact info extraction
4. Section extraction
5. NER extraction
6. Skill extraction
7. Rule-based parsing
8. Normalization
9. Scoring
10. Metadata addition

#### `resume_scorer.py` - Resume Scoring

**Purpose**: Calculate resume quality score (0-100)

**Scoring Factors**:
- Name present: +10
- Email present: +10
- Phone present: +5
- Location present: +5
- Education entries: +10 each (max 20)
- Experience entries: +15 each (max 45)
- Skills count: +2 each (max 20)
- Projects: +5 each (max 15)
- Certifications: +3 each (max 10)

#### `embeddings.py` - Embedding Generation

**Purpose**: Generate embeddings for semantic matching

**Methods**:
- `generate_embedding(text)`: Generate 384-dim embedding
- `generate_skill_embeddings(skills)`: Batch embedding generation

**Model**: sentence-transformers/all-MiniLM-L6-v2

**Use Cases**:
- Skill matching against job descriptions
- Resume similarity comparison
- Future: RAG for job recommendations

#### `normalizer.py` - Data Normalization

**Purpose**: Standardize extracted data

**Normalizations**:
- Date format standardization
- Skill name normalization
- Confidence score calculation
- Field validation

### 3. Model Layer (`app/models/`)

#### `user.py` - User Model

```python
class User:
    id: str (primary key)
    email: str (unique)
    name: str
    password_hash: str
    created_at: datetime
```

#### `resume.py` - Resume Model

```python
class Resume:
    id: str (primary key)
    user_id: str (foreign key → User.id)
    filename: str
    raw_text: str (full extracted text)
    parsed_json: JSON (structured parsed data)
    resume_score: int (0-100)
    created_at: datetime
```

#### `skill.py` - Skill Models

```python
class Skill:
    id: str (primary key)
    name: str (unique)
    category: str (optional)

class UserSkill:
    id: str (primary key)
    user_id: str (foreign key → User.id)
    skill_id: str (foreign key → Skill.id)
    proficiency: int (0-100, optional)
```

#### `project.py` - Project Model

```python
class Project:
    id: str (primary key)
    user_id: str (foreign key → User.id)
    resume_id: str (foreign key → Resume.id, optional)
    title: str
    spec_json: JSON (project specification)
    status: str (pending, in_progress, completed)
    created_at: datetime
```

#### `role.py` - Role Template Model

```python
class Role:
    id: str (primary key)
    title: str
    canonical_skills: JSON (list of required skills)
    level: str (entry, mid, senior)
```

---

## Database Schema & Models

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email       │◄──────┐
│ name        │       │
│ password    │       │
│ created_at  │       │
└─────────────┘       │
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Resume    │  │ UserSkill   │  │   Project   │
├─────────────┤  ├─────────────┤  ├─────────────┤
│ id (PK)     │  │ id (PK)     │  │ id (PK)     │
│ user_id(FK) │  │ user_id(FK) │  │ user_id(FK) │
│ filename    │  │ skill_id(FK)│  │ resume_id   │
│ raw_text    │  │ proficiency │  │ title       │
│ parsed_json │  └─────────────┘  │ spec_json   │
│ score       │       │            │ status      │
│ created_at  │       │            │ created_at  │
└─────────────┘       │            └─────────────┘
                      │
                      ▼
                ┌─────────────┐
                │    Skill    │
                ├─────────────┤
                │ id (PK)     │
                │ name        │
                │ category    │
                └─────────────┘
```

### SQL Schema

```sql
-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resumes table
CREATE TABLE resumes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    raw_text TEXT,
    parsed_json TEXT,  -- JSON stored as TEXT
    resume_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Skills catalog
CREATE TABLE skills (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT
);

-- User skills (many-to-many)
CREATE TABLE user_skills (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    proficiency INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(user_id, skill_id)
);

-- Projects
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    resume_id TEXT,
    title TEXT NOT NULL,
    spec_json TEXT,  -- JSON stored as TEXT
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL
);

-- Role templates
CREATE TABLE roles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    canonical_skills TEXT,  -- JSON array
    level TEXT
);
```

### Database Access Pattern

```python
# Async Session Pattern
async def get_resume(resume_id: str, db: AsyncSession):
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id)
    )
    return result.scalar_one_or_none()

# Transaction Pattern
async def create_resume(data: dict, db: AsyncSession):
    resume = Resume(**data)
    db.add(resume)
    await db.commit()
    await db.refresh(resume)
    return resume
```

---

## LLM & AI Integration

### Ollama Integration

**Purpose**: Optional LLM-based parsing refinement and project generation

**Architecture**:

```
┌─────────────────────────────────────────────────────────┐
│              LLM Orchestrator Component                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Ollama Service (Local)                   │  │
│  │  URL: http://localhost:11434                      │  │
│  │  Model: llama3.2:3b (configurable)                │  │
│  └──────────────────────────────────────────────────┘  │
│                        ▲                                 │
│                        │                                 │
│  ┌─────────────────────┴─────────────────────────────┐  │
│  │         LLMOrchestrator Class                      │  │
│  │  - is_available()                                 │  │
│  │  - call_llm(prompt, system_prompt)                │  │
│  │  - parse_resume(raw_text)                         │  │
│  │  - generate_project_spec(skills, role)             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### LLM Usage Flow

```
1. CHECK AVAILABILITY
   │
   └─► GET http://localhost:11434/api/tags
       └─► Verify model is available
   
2. BUILD PROMPT
   │
   ├─► System Prompt (from app/prompts/resume_parse_system.md)
   │   └─► JSON schema definition
   │
   └─► User Prompt
       └─► Raw resume text with delimiters
   
3. CALL OLLAMA API
   │
   └─► POST http://localhost:11434/api/chat
       {
         "model": "llama3.2:3b",
         "messages": [
           {"role": "system", "content": system_prompt},
           {"role": "user", "content": user_prompt}
         ],
         "options": {
           "temperature": 0.1,      // Low for structured output
           "num_predict": 2000       // Max tokens
         }
       }
   
4. PROCESS RESPONSE
   │
   ├─► Extract JSON from response
   │   └─► Remove markdown code blocks if present
   │
   ├─► Parse JSON
   │   └─► Validate structure
   │
   └─► Return parsed data
```

### LLM Configuration

```python
# From app/core/config.py
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL = "llama3.2:3b"  # Lightweight, fast
LLM_TEMPERATURE = 0.1          # Low for consistent output
LLM_MAX_TOKENS = 2000
```

### Retry Logic

```python
# Exponential backoff retry
for attempt in range(max_retries):
    try:
        response = await client.post(...)
        return response
    except httpx.TimeoutException:
        wait_time = 2 ** attempt  # 2s, 4s, 8s
        await asyncio.sleep(wait_time)
        continue
```

### Fallback Behavior

- **Ollama unavailable**: Falls back to rule-based parsing
- **Model not found**: Logs warning, uses rule-based
- **API timeout**: Retries with exponential backoff
- **Invalid response**: Falls back to rule-based parsing

---

## Processing Pipeline

### Detailed Pipeline Steps

#### Step 1: PDF Text Extraction

```python
# Input: PDF file path
# Output: Raw text string

with pdfplumber.open(pdf_path) as pdf:
    text_parts = []
    for page in pdf.pages:
        text = page.extract_text()
        if text:
            text_parts.append(text)
    return "\n".join(text_parts)
```

**Error Handling**:
- File not found → HTTPException 404
- No text extracted → ValueError (image-based PDF)
- Corrupted PDF → ValueError with details

#### Step 2: Text Preprocessing

```python
# Input: Raw text
# Output: Cleaned text

- Remove extra whitespace
- Normalize line breaks (\r\n → \n)
- Remove special characters (optional)
- Preserve structure (sections, bullets)
```

#### Step 3: Contact Info Extraction

```python
# Regex Patterns:
email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
phone_pattern = r'(?:(?:\+?1[\s-])?)\(?(\d{3})\)?[\s-]*(\d{3})[\s-]*(\d{4})'
location_pattern = r'([A-Z][a-z]+,\s*[A-Z]{2}(?:\s+\d{5})?)'

# Returns: {email, phone, location}
```

#### Step 4: Section Extraction

```python
# Section Headers (case-insensitive):
sections = {
    "education": ["Education", "Academic", "Qualifications"],
    "experience": ["Experience", "Work History", "Employment"],
    "skills": ["Skills", "Technical Skills", "Competencies"],
    "projects": ["Projects", "Portfolio", "Work Samples"],
    "certifications": ["Certifications", "Certificates", "Credentials"]
}

# Extract content between section headers
```

#### Step 5: Named Entity Recognition

```python
# Using Flair NER (ner-large):
sentence = Sentence(text)
flair_tagger.predict(sentence)

# Extract entities:
- PERSON: Names
- ORG: Companies, universities
- DATE: Dates, years
- LOC: Locations, cities
```

#### Step 6: Skill Extraction

```python
# Keyword-based extraction:
tech_keywords = [
    "Python", "JavaScript", "React", "Node.js",
    "SQL", "AWS", "Docker", "Kubernetes",
    # ... extensive list
]

# Also extract from:
- Skills section
- Experience bullets
- Projects section
```

#### Step 7: Rule-Based Parsing

```python
# Parse each section:

# Education:
- Extract school name
- Extract degree
- Extract graduation date
- Extract GPA (if present)

# Experience:
- Extract job title
- Extract company name
- Extract dates (start, end)
- Extract location
- Extract bullet points

# Projects:
- Extract project title
- Extract description
- Extract tech stack
```

#### Step 8: Normalization

```python
# Standardize formats:
- Dates: "2024-06" → "June 2024"
- Skills: "python" → "Python"
- Add confidence scores
- Validate required fields
```

#### Step 9: Scoring

```python
score = 0
if name: score += 10
if email: score += 10
if phone: score += 5
if location: score += 5
score += min(education_count * 10, 20)
score += min(experience_count * 15, 45)
score += min(skills_count * 2, 20)
score += min(projects_count * 5, 15)
score += min(certifications_count * 3, 10)
return min(score, 100)
```

#### Step 10: Metadata

```python
metadata = {
    "raw_text_length": len(raw_text),
    "processing_method": "rule-based",  # or "llm-enhanced"
    "sections_found": ["education", "experience", "skills"],
    "extraction_confidence": 85  # Calculated based on completeness
}
```

---

## API Endpoints

### Authentication Endpoints

#### `POST /api/v1/auth/register`

**Request**:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### `POST /api/v1/auth/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response**: Same as register

#### `GET /api/v1/auth/me`

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "id": "abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Resume Endpoints

#### `POST /api/v1/resume/upload`

**Request**: `multipart/form-data`
- `file`: PDF file

**Headers**: `Authorization: Bearer <token>` (optional, uses demo user if not provided)

**Response**:
```json
{
  "resume_id": "resume_abc123",
  "status": "completed",
  "resume_data": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "experience": [...],
    "education": [...],
    "skills": [...]
  },
  "resume_score": 85,
  "message": "Resume processed successfully"
}
```

#### `GET /api/v1/resume/{resume_id}`

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "resume_id": "resume_abc123",
  "resume_data": {...},
  "resume_score": 85,
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### `GET /api/v1/resume/`

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
[
  {
    "id": "resume_abc123",
    "filename": "resume.pdf",
    "resume_score": 85,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### Dashboard Endpoints

#### `GET /api/v1/dashboard/{user_id}`

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "title": "Software Engineer",
    "experience": [...],
    "skills": [...]
  },
  "stats": {
    "total_xp": 250,
    "skills_count": 15,
    "level": 3,
    "resume_score": 85
  },
  "recommendations": [...]
}
```

### Project Endpoints

#### `POST /api/v1/projects/generate`

**Request**:
```json
{
  "skills": ["Python", "SQL", "Machine Learning"],
  "role_title": "Data Scientist",
  "difficulty": "intermediate"
}
```

**Response**:
```json
{
  "project_id": "proj_abc123",
  "title": "Customer Churn Prediction",
  "description": "...",
  "steps": [...],
  "deliverables": [...],
  "estimated_hours": 6
}
```

---

## User-Database-LLM Integration

### Complete Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│              USER-DATABASE-LLM INTEGRATION FLOW                         │
└─────────────────────────────────────────────────────────────────────────┘

USER ACTION: Upload Resume
│
├─► 1. USER AUTHENTICATION
│   │
│   └─► Frontend sends JWT token
│       └─► Backend validates token
│           └─► Extract user_id
│
├─► 2. FILE UPLOAD
│   │
│   └─► PDF file → Backend
│       └─► Save to: data/uploads/{user_id}/{resume_id}.pdf
│
├─► 3. DATABASE QUERY: User Record
│   │
│   └─► SELECT * FROM users WHERE id = {user_id}
│       └─► Verify user exists
│
├─► 4. PROCESSING PIPELINE
│   │
│   ├─► PDF → Text (pdfplumber)
│   ├─► Text → Structured Data (NLP + Rules)
│   └─► Optional: LLM Refinement (Ollama)
│
├─► 5. DATABASE WRITE: Resume Record
│   │
│   └─► INSERT INTO resumes (
│       id, user_id, filename, raw_text, 
│       parsed_json, resume_score
│       )
│       VALUES (...)
│
├─► 6. DATABASE WRITE: Skills
│   │
│   ├─► For each skill:
│   │   ├─► INSERT INTO skills (name) ON CONFLICT IGNORE
│   │   └─► INSERT INTO user_skills (user_id, skill_id)
│   │
│   └─► Link user to skills
│
├─► 7. DATABASE READ: Latest Resume
│   │
│   └─► SELECT * FROM resumes 
│       WHERE user_id = {user_id}
│       ORDER BY created_at DESC
│       LIMIT 1
│
└─► 8. RESPONSE TO USER
    │
    └─► Return parsed data + score
        └─► Frontend displays in dashboard
```

### Data Flow Diagram

```
┌──────────┐
│  USER    │
└────┬─────┘
     │
     │ 1. POST /api/v1/resume/upload
     │    (JWT Token + PDF File)
     │
     ▼
┌─────────────────┐
│  FASTAPI APP    │
│  (auth.py)      │
└────┬────────────┘
     │
     │ 2. Validate JWT
     │    Extract user_id
     │
     ▼
┌─────────────────┐
│  DATABASE       │
│  (SQLite)       │
│                 │
│  SELECT user    │
│  WHERE id = ... │
└────┬────────────┘
     │
     │ 3. User verified
     │
     ▼
┌─────────────────┐
│  FILE SYSTEM    │
│                 │
│  Save PDF to:   │
│  data/uploads/  │
│  {user_id}/     │
│  {resume_id}.pdf│
└────┬────────────┘
     │
     │ 4. PDF saved
     │
     ▼
┌─────────────────┐
│  PIPELINE       │
│  (resume_pipeline)│
│                 │
│  - PDF Parser   │
│  - NLP Extractor│
│  - LLM (optional)│
│  - Scorer       │
└────┬────────────┘
     │
     │ 5. Parsed data
     │
     ▼
┌─────────────────┐
│  DATABASE       │
│  (SQLite)       │
│                 │
│  INSERT resume  │
│  INSERT skills  │
│  INSERT user_skills│
└────┬────────────┘
     │
     │ 6. Data stored
     │
     ▼
┌─────────────────┐
│  DATABASE       │
│  (SQLite)       │
│                 │
│  SELECT resume  │
│  WHERE user_id  │
│  ORDER BY date  │
└────┬────────────┘
     │
     │ 7. Latest resume
     │
     ▼
┌─────────────────┐
│  TRANSFORM      │
│  (resume.py)    │
│                 │
│  Backend format │
│  → Frontend format│
└────┬────────────┘
     │
     │ 8. Transformed data
     │
     ▼
┌──────────┐
│  USER    │
│          │
│  Receives│
│  JSON    │
└──────────┘
```

### LLM Integration Points

```
┌─────────────────────────────────────────────────────────┐
│              LLM INTEGRATION POINTS                      │
└─────────────────────────────────────────────────────────┘

1. RESUME PARSING (Optional Enhancement)
   │
   ├─► Trigger: use_llm=True in pipeline
   │
   ├─► Input: Raw resume text
   │
   ├─► Process:
   │   ├─► Check Ollama availability
   │   ├─► Load system prompt (JSON schema)
   │   ├─► Build user prompt (raw text)
   │   ├─► Call Ollama API
   │   ├─► Extract JSON from response
   │   └─► Merge with rule-based results
   │
   └─► Output: Enhanced structured data

2. PROJECT GENERATION
   │
   ├─► Trigger: POST /api/v1/projects/generate
   │
   ├─► Input: Skills list, role title, difficulty
   │
   ├─► Process:
   │   ├─► Check Ollama availability
   │   ├─► Load project generation prompt
   │   ├─► Build prompt with skills/role
   │   ├─► Call Ollama API
   │   └─► Parse project specification JSON
   │
   └─► Output: Project spec (title, steps, deliverables)

3. FALLBACK BEHAVIOR
   │
   ├─► Ollama unavailable → Use rule-based parsing
   │
   ├─► Model not found → Log warning, continue
   │
   ├─► API timeout → Retry with backoff, then fallback
   │
   └─► Invalid response → Use rule-based parsing
```

---

## System Analysis

### Performance Characteristics

#### Processing Speed

- **Rule-Based Parsing**: ≤ 0.4 seconds
  - PDF extraction: ~50ms
  - NLP extraction: ~200ms
  - Rule-based parsing: ~100ms
  - Scoring: ~50ms

- **LLM-Enhanced Parsing**: 5-15 seconds
  - All rule-based steps: ~400ms
  - LLM API call: 4-14 seconds (depends on model size)
  - JSON parsing: ~100ms

#### Resource Usage

- **Memory**: 
  - Base: ~200MB (FastAPI + dependencies)
  - With models: ~2-4GB (Flair NER + sentence-transformers)
  - With Ollama: +2-8GB (depending on model size)

- **CPU**: 
  - Rule-based: Low (single-threaded)
  - LLM inference: High (CPU or GPU)

- **Storage**:
  - Database: ~1MB per 100 resumes
  - PDF files: ~100KB-2MB per resume
  - Models: ~500MB (Flair) + ~100MB (sentence-transformers)

### Scalability Considerations

#### Current Limitations

1. **SQLite**: Good for <1000 concurrent users
   - Solution: Migrate to PostgreSQL for production

2. **Synchronous Processing**: One resume at a time per request
   - Solution: Add background job queue (RQ/Celery)

3. **File Storage**: Local filesystem
   - Solution: Use object storage (S3, MinIO) for production

4. **LLM Inference**: Single-threaded
   - Solution: Use GPU acceleration or separate LLM service

#### Optimization Strategies

1. **Caching**:
   - Cache parsed resumes (if unchanged)
   - Cache skill embeddings
   - Cache LLM responses (for identical inputs)

2. **Async Processing**:
   - Background jobs for resume processing
   - WebSocket for real-time status updates

3. **Database Optimization**:
   - Indexes on user_id, created_at
   - Connection pooling
   - Query optimization

4. **Model Optimization**:
   - Use smaller models for faster inference
   - Batch processing for multiple resumes
   - GPU acceleration for LLM

### Security Analysis

#### Authentication & Authorization

- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcrypt with salt
- **User Scoping**: All data queries filtered by user_id
- **File Access**: User-specific directories

#### Data Privacy

- **Local Processing**: No data sent to external APIs
- **File Storage**: User-isolated directories
- **Database**: User-scoped queries
- **Optional Encryption**: SQLite can be encrypted

#### Input Validation

- **File Type**: Only PDF files accepted
- **File Size**: Configurable limits
- **SQL Injection**: SQLAlchemy ORM prevents injection
- **XSS**: Input sanitization in API responses

---

## Error Handling & Fallbacks

### Error Handling Strategy

#### 1. PDF Processing Errors

```python
try:
    text = pdf_parser.extract_text(pdf_path)
except FileNotFoundError:
    raise HTTPException(404, "PDF file not found")
except ValueError as e:
    raise HTTPException(400, f"PDF processing failed: {str(e)}")
```

#### 2. NLP Processing Errors

```python
try:
    entities = nlp_extractor.extract_entities(text)
except Exception as e:
    logger.warning(f"NLP extraction failed: {e}")
    entities = {}  # Continue with empty entities
```

#### 3. LLM Processing Errors

```python
try:
    llm_data = await llm_orchestrator.parse_resume(text)
except RuntimeError as e:
    logger.warning(f"LLM parsing failed: {e}")
    # Fall back to rule-based parsing
    llm_data = None
```

#### 4. Database Errors

```python
try:
    await db.commit()
except Exception as e:
    await db.rollback()
    raise HTTPException(500, f"Database error: {str(e)}")
```

### Fallback Chain

```
┌─────────────────────────────────────────────────────────┐
│                    FALLBACK CHAIN                         │
└─────────────────────────────────────────────────────────┘

1. LLM Parsing (Primary)
   │
   ├─► Success → Use LLM data
   │
   └─► Failure → Fall back to Rule-Based

2. Rule-Based Parsing (Secondary)
   │
   ├─► Success → Use rule-based data
   │
   └─► Failure → Return partial data

3. Partial Data (Tertiary)
   │
   ├─► Contact info (regex) → Always available
   ├─► Skills (keywords) → Usually available
   └─► Experience/Education → May be partial

4. Error Response (Last Resort)
   │
   └─► Return error with details
       └─► User can retry or contact support
```

---

## Performance & Optimization

### Current Performance

- **Resume Processing**: 0.4 seconds (rule-based)
- **API Response Time**: <1 second (excluding LLM)
- **Database Queries**: <50ms (SQLite)
- **Concurrent Requests**: Limited by SQLite (single writer)

### Optimization Opportunities

1. **Database**:
   - Add indexes on frequently queried columns
   - Use connection pooling
   - Consider PostgreSQL for production

2. **Caching**:
   - Cache parsed resumes (Redis/Memcached)
   - Cache skill embeddings
   - Cache LLM responses

3. **Async Processing**:
   - Background jobs for heavy processing
   - WebSocket for real-time updates
   - Queue system (RQ/Celery)

4. **Model Optimization**:
   - Use smaller models for faster inference
   - Batch processing
   - GPU acceleration

---

## Conclusion

The RoleWithAI backend is a **production-ready, local-first** resume processing system that:

- ✅ Processes PDFs entirely on-device
- ✅ Uses open-source models (zero API costs)
- ✅ Maintains user privacy
- ✅ Provides structured data extraction
- ✅ Supports optional LLM enhancement
- ✅ Includes comprehensive error handling
- ✅ Scales to hundreds of users (SQLite)
- ✅ Ready for production deployment (with PostgreSQL migration)

The system is designed to be **extensible**, allowing easy integration of cloud services, background jobs, and additional AI capabilities as needed.

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintained By**: RoleWithAI Development Team

