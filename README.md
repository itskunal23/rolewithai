# RoleWithAI 🚀

[![CI Status](https://img.shields.io/badge/CI-Passing-brightgreen)](https://github.com/yourusername/RoleWithAI/actions)
[![npm version](https://img.shields.io/badge/npm-rolewithai-blue)](https://www.npmjs.com/package/rolewithai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Transform Your Career with AI** - An intelligent career development platform that combines AI-powered resume analysis, personalized skill tracking, and interactive learning experiences to help professionals unlock their career potential.

## 📸 Visual Showcase

git config --global user.email "k.goenka23@gmail.com"
git config --global user.name "Kunal Goenka"

### Landing Page
![Landing Page](./docs/images/landing-page.png)

The landing page features a clean, modern design with:
- **Hero Section**: "Transform Your Career with AI" with personalized messaging
- **AI Career Coach**: Meet Alex, your AI career coach with drag-and-drop resume upload
- **Resume Upload**: Supports PDF and Word documents with instant analysis
- **Navigation**: Easy access to Dashboard, Features, Personas, How It Works, and Pricing

### AI Career Dashboard
![Dashboard](./docs/images/dashboard.png)

The comprehensive dashboard provides:

**Top Metrics Row:**
- 📊 **Weekly XP**: Track your progress with gamified experience points
- 🎯 **Skills Progressed**: Monitor skill development milestones
- 🔥 **Streak**: Maintain your learning streak
- 🏆 **Badges Unlocked**: Celebrate achievements
- 👥 **Mentor Sessions**: Track mentorship interactions
- 👀 **Job Views**: Monitor profile visibility

**Career Insights:**
- 🗺️ **Career Roadmap**: Visual progression from Data Analyst → ML Engineer → AI Researcher
- 📈 **Learning Path Progress**: Track your journey through Intro to AI, Python Basics, ML Foundations, and Deep Learning
- 💼 **Job Matches**: Discover relevant opportunities with one-click application

**Progress Tracking:**
- 📊 **Skill Progress**: Visual progress bars for Python, Machine Learning, Data Visualization
- 💬 **Mentor Chat**: Quick access to mentor conversations
- 🏅 **Recent Achievements**: Showcase your accomplishments

## 📚 Documentation

- [System Architecture](./docs/ARCHITECTURE.md)
- [Testing Strategy](./docs/TESTING.md)
- [Product Management](./docs/PRODUCT.md)
- [Component Library](./docs/COMPONENTS.md)

## 🎯 Why RoleWithAI?

RoleWithAI is an AI-powered career development platform that helps professionals navigate their career journey through personalized guidance, skill tracking, and interactive learning experiences.

### Key Differentiators

- 🤖 **AI-Powered Resume Analysis**: Local-first resume parsing with Flair NER and spaCy for privacy
- 🎮 **Gamified Learning**: XP system, achievements, streaks, and progress tracking
- 📊 **Comprehensive Dashboard**: Real-time metrics, career roadmap, and skill visualization
- 🎯 **Career Roadmapping**: Visual career progression paths with milestone tracking
- 🤝 **Human-AI Hybrid**: Combines AI guidance with human mentorship opportunities
- 🔒 **Privacy-First**: All processing happens locally - your data never leaves your device

## 🚀 Quick Start

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend

The backend is a FastAPI application that processes resumes locally using Ollama and spaCy.

```bash
cd backend

# Quick setup (Linux/Mac)
chmod +x setup.sh && ./setup.sh

# Or Windows
.\setup.ps1

# Start server
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uvicorn app.main:app --reload
```

See [backend/QUICKSTART.md](./backend/QUICKSTART.md) for detailed setup instructions.

**Prerequisites:**
- Python 3.11+
- Ollama installed (for LLM features)
- spaCy model: `python -m spacy download en_core_web_sm`

## 🎨 Theming

RoleWithAI uses a modern dark theme with carefully selected colors for optimal readability and visual hierarchy.

### Color Palette

- Background: `#121212`
- Surface/Card: `#1C1C1E`
- Border: `#2C2C2E`
- Primary: `#0077B5` (LinkedIn blue)
- Success: `#16B364`
- Warning: `#F59E0B`
- Text Primary: `#FFFFFF`
- Text Secondary: `#A1A1AA`

## 📱 Pages & Features

### 🏠 Landing Page (`/`)
- **Hero Section**: Transform Your Career with AI messaging
- **AI Career Coach**: Interactive resume upload with Alex
- **Drag & Drop Upload**: Seamless PDF/Word document processing
- **Feature Highlights**: Showcase of platform capabilities

### 📊 Dashboard (`/dashboard`)
The heart of RoleWithAI - a comprehensive career analytics hub:

**Profile & Stats:**
- Personalized greeting with user name
- Profile summary card with contact information
- Resume quality score (0-100)
- Experience years calculation
- Skills count and categorization
- Education level detection

**Resume Analysis:**
- **Experience Timeline**: Chronological work history with company, role, dates, and achievements
- **Education Section**: Degree, institution, GPA, and honors
- **Skills Cloud**: Categorized skills (Programming, Tools, Analytical)
- **Projects Portfolio**: Technical projects with descriptions and technologies
- **Certifications**: Professional credentials and achievements

**AI Insights:**
- **Recommendations Panel**: 
  - Skill gaps with progress indicators
  - Project suggestions based on identified gaps
  - Job match statistics and ATS readiness score
- **Resume Integrity Check**: Section verification (Contact, Skills, Experience, etc.)
- **Processing Metadata**: Transparency into parsing method and confidence scores

**Action Zone:**
- Upload new resume
- View previous resumes
- Generate AI project suggestions
- Refresh dashboard data

### 💬 Mentor (`/mentor`)
- AI chat interface for career advice
- Human mentor connections
- Suggested topics based on profile
- Conversation history

### 🎯 Skills (`/skills`)
- Skill assessment and proficiency levels
- Progress tracking with visual indicators
- Learning recommendations
- Achievement badges and XP rewards

### 🗺️ Roadmap (`/roadmap`)
- Career progression visualization
- Milestone tracking
- Learning path suggestions
- Industry insights and role requirements

## 🛠️ Installation

### Prerequisites
- **Node.js** 18+ and npm/pnpm
- **Python** 3.11+ (for backend)
- **Ollama** (for LLM features - optional)
- **Git**

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   # or
   pnpm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   pnpm run dev
   ```
   Frontend will be available at `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Quick Setup Script**
   ```bash
   # Linux/Mac
   chmod +x setup.sh && ./setup.sh
   
   # Windows
   .\setup.ps1
   ```

3. **Manual Setup** (if scripts don't work)
   ```bash
   # Create virtual environment
   python -m venv .venv
   
   # Activate virtual environment
   # Linux/Mac:
   source .venv/bin/activate
   # Windows:
   .venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Download NLP models
   python -m spacy download en_core_web_sm
   python -c "from flair.models import SequenceTagger; SequenceTagger.load('ner-large')"
   ```

4. **Start Backend Server**
   ```bash
   # Using uvicorn directly
   uvicorn app.main:app --reload
   
   # Or using the app.py script (starts both frontend and backend)
   python app.py
   ```
   Backend API will be available at `http://localhost:8000`
   API documentation at `http://localhost:8000/docs`

### Full Stack Development

To run both frontend and backend together:

```bash
# From backend directory
python app.py
```

This will:
- Start the FastAPI backend on port 8000
- Wait for backend to be ready
- Automatically start the Next.js frontend on port 3000
- Provide colored terminal output for easy monitoring

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- **Next.js 15** with App Router and Turbopack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** + **Radix UI** for accessible components
- **Framer Motion** for animations

**Backend:**
- **FastAPI** for REST API
- **SQLAlchemy** with async support
- **SQLite** (development) / **PostgreSQL** (production)
- **Flair NER** + **spaCy** for NLP
- **Ollama** for local LLM (optional)
- **PyMuPDF** + **pdfminer.six** for PDF parsing

### Key Features

#### Resume Parsing & Analysis
- **Local-First Processing**: All NLP happens on your device
- **Multi-Format Support**: PDF and Word documents
- **Intelligent Extraction**: 
  - Job titles, companies, dates
  - Skills with automatic categorization
  - Education with GPA and honors
  - Projects and certifications
- **Confidence Scoring**: Resume quality metrics (0-100)
- **ATS Readiness**: Automated applicant tracking system compatibility check

#### Dashboard Analytics
- **Real-Time Metrics**: Weekly XP, skills progressed, streaks, badges
- **Career Roadmap**: Visual progression tracking
- **Skill Gap Analysis**: Identifies missing skills with actionable recommendations
- **Job Matching**: Match percentage and application tracking
- **Learning Path Progress**: Track completion through courses and modules

#### AI-Powered Insights
- **Strengths Analysis**: Highlights your career strengths
- **Weaknesses Identification**: Actionable improvement areas
- **Skill Gap Detection**: Missing skills with learning recommendations
- **Project Suggestions**: AI-generated project ideas based on skill gaps
- **ATS Readiness Score**: Grade-based assessment (A-F)

## 🎨 Design System

### Visual Design
- **Modern Dark Theme**: Optimized for extended use
- **Glassmorphism Effects**: Frosted glass cards with subtle transparency
- **Gradient Accents**: Strategic use of gradients for visual interest
- **Responsive Layout**: Mobile-first design that adapts to all screen sizes
- **Micro-Interactions**: Smooth animations for XP gains, notifications, and state changes

### Color Palette
- **Background**: `#121212` - Deep dark base
- **Surface/Card**: `#1C1C1E` - Elevated surfaces
- **Border**: `#2C2C2E` - Subtle separators
- **Primary**: `#0077B5` - LinkedIn blue for CTAs
- **Success**: `#16B364` - Positive actions
- **Warning**: `#F59E0B` - Attention items
- **Text Primary**: `#FFFFFF` - High contrast text
- **Text Secondary**: `#A1A1AA` - Supporting text

## 📊 Dashboard Components

The dashboard is built with modular, reusable components:

- **Greeting**: Personalized welcome message
- **ProfileSummaryCard**: User profile overview
- **StatsKPICards**: Key performance indicators
- **SectionsFoundChips**: Resume section verification
- **ExperienceTimeline**: Chronological work history
- **EducationSection**: Academic credentials
- **SkillsCloud**: Categorized skill visualization
- **ProjectsSection**: Portfolio showcase
- **CertificationsSection**: Professional credentials
- **RecommendationsPanel**: AI-powered insights
- **ResumeMetadataView**: Processing transparency
- **ActionZone**: Quick actions and API routes

## 🚀 Performance

- **Resume Parsing**: ≤ 0.4 seconds average
- **Zero External API Costs**: Fully local processing
- **Fast Initial Load**: Optimized bundle sizes
- **Real-Time Updates**: Instant dashboard refresh

## 🔒 Privacy & Security

- **Local Processing**: All NLP and analysis happens on your device
- **No Data Sharing**: Your resume data never leaves your machine
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configured for frontend access only

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Flair](https://github.com/flairNLP/flair) for state-of-the-art NLP
- [Ollama](https://ollama.ai/) for local LLM capabilities

---

**Built with ❤️ for career-driven professionals**
