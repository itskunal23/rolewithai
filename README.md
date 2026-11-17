# rolewithai

AI-powered career companion: explores roles, maps skills, generates personalized learning paths. LLM + RAG for tech career guidance.

## Problem
Tech professionals face overwhelming career choices: hundreds of roles, rapidly evolving skill requirements, unclear progression paths. Generic advice ("learn Python") doesn't account for background, goals, or market reality. Existing tools are either too broad (LinkedIn) or too narrow (single-course platforms).

## Solution
rolewithai uses LLMs with RAG over curated career data (role definitions, skill graphs, market trends, learning resources) to provide personalized career guidance. Users input background + goals → system returns role matches, skill gaps, learning paths, and market validation.

## Tech Stack
- **Language**: JavaScript/TypeScript
- **LLM**: OpenAI GPT-4 / Anthropic Claude (pluggable providers)
- **RAG**: LangChain + Pinecone/Weaviate (vector search over career corpus)
- **Frontend**: React + Vite (or Next.js for SSR)
- **Backend**: Node.js + Fastify (or serverless functions)
- **Database**: PostgreSQL (user data, conversations) + Redis (caching)
- **Auth**: Clerk / Auth.js (magic links, OAuth)
- **Deployment**: Vercel (frontend) + Railway/Render (backend)
- **Observability**: LangSmith (LLM traces), Sentry (errors)

## Demo
*Live demo requires API keys. Contact for access.*

## Installation
```bash
git clone https://github.com/itskunal23/rolewithai.git
cd rolewithai

# Install dependencies
npm install
# or
pnpm install
```

## Usage
```bash
# Development
npm run dev

# Build for production
npm run build

# Run tests
npm run test
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Architecture
```
├── apps/
│   ├── web/              # React frontend (Vite/Next.js)
│   │   ├── src/
│   │   │   ├── components/   # UI components
│   │   │   ├── pages/        # Route pages
│   │   │   ├── hooks/        # Custom React hooks
│   │   │   ├── services/     # API clients
│   │   │   └── utils/        # Helpers
│   │   └── ...
│   └── api/              # Backend (Fastify/Express)
│       ├── src/
│       │   ├── routes/       # API endpoints
│       │   ├── services/     # Business logic
│       │   ├── rag/          # RAG pipeline
│       │   │   ├── indexer.ts    # Document ingestion
│       │   │   ├── retriever.ts  # Vector search
│       │   │   └── generator.ts  # LLM response generation
│       │   ├── db/           # Database layer (Prisma/Drizzle)
│       │   └── config/       # Environment config
│       └── ...
├── packages/
│   ├── shared/           # Shared types, utilities
│   ├── career-data/      # Curated career corpus (JSON/Markdown)
│   └── ui/               # Shared UI component library
└── turbo.json            # Turborepo config (if monorepo)
```

## Core Features

### 1. Role Exploration
- **Role Catalog** — 200+ tech roles with definitions, responsibilities, seniority levels
- **Role Comparison** — Side-by-side: skills, salary, growth, day-to-day
- **Market Demand** — Real-time hiring velocity per role

### 2. Skill Mapping
- **Skill Graph** — Prerequisites, adjacencies, transferable skills
- **Gap Analysis** — Current skills → target role requirements
- **Proficiency Levels** — Beginner → Expert with milestones

### 3. Personalized Learning Paths
- **Curriculum Generation** — LLM creates structured learning plan
- **Resource Curation** — Courses, books, projects, papers (ranked by quality)
- **Timeline Estimation** — Hours/weeks based on background + availability
- **Progress Tracking** — Checkpoints, assessments, portfolio projects

### 4. Market Intelligence
- **Salary Benchmarks** — P25/P50/P75 by role, location, experience
- **Hiring Trends** — Which roles growing, which saturating
- **Company Profiles** — Who's hiring, tech stack, culture signals

## RAG Pipeline
```
User Query + Profile
       │
       ▼
Query Expansion (LLM) → "What skills for Staff ML Engineer at BigTech?"
       │
       ▼
Hybrid Search
  ├── Vector Search (Pinecone) — Semantic similarity
  └── Keyword Search (PostgreSQL) — Exact skill/role matches
       │
       ▼
Re-ranking (Cross-encoder) → Top-K relevant chunks
       │
       ▼
Context Assembly → Role defs + Skill graph + Market data + Resources
       │
       ▼
LLM Generation (Structured Output) → JSON: {roles, gaps, path, resources}
```

## Data Sources (Curated Corpus)
| Source | Content | Update Frequency |
|--------|---------|------------------|
| O*NET | Role definitions, tasks, skills | Quarterly |
| BLS OES | Salary percentiles, employment | Annual |
| LinkedIn/Indeed | Skill co-occurrence, demand | Monthly (via Job-Market) |
| Levels.fyi | Compensation bands | Monthly |
| Course platforms | Curriculum, ratings | Quarterly |
| Company blogs | Tech stack, culture | Continuous |

## Configuration
```typescript
// config.ts
export const config = {
  llm: {
    provider: "openai", // or "anthropic"
    model: "gpt-4-turbo",
    temperature: 0.3,
  },
  rag: {
    vectorStore: "pinecone",
    indexName: "career-corpus",
    topK: 10,
    rerank: true,
  },
  career: {
    minRoleMatchScore: 0.7,
    maxLearningPathWeeks: 52,
    resourceQualityThreshold: 4.0,
  },
};
```

## Contributing
PRs welcome for new roles, skill mappings, learning resources, or RAG improvements. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License
MIT © Kunal Goenka