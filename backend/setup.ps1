# Setup script for RoleWithAI Backend (Windows PowerShell)

Write-Host "🚀 Setting up RoleWithAI Backend..." -ForegroundColor Green

# Create virtual environment
if (-not (Test-Path ".venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activate virtual environment
Write-Host "🔌 Activating virtual environment..." -ForegroundColor Yellow
& .\.venv\Scripts\Activate.ps1

# Install Python dependencies
Write-Host "📥 Installing Python dependencies..." -ForegroundColor Yellow
python -m pip install --upgrade pip
pip install -r requirements.txt

# Download spaCy models
Write-Host "📚 Downloading spaCy models..." -ForegroundColor Yellow
python -m spacy download en_core_web_sm

# Install Resume-NER model (optional - may require HuggingFace auth)
Write-Host "📚 Installing Resume-NER model (optional)..." -ForegroundColor Yellow
Write-Host "  Note: This may require HuggingFace authentication" -ForegroundColor Cyan
Write-Host "  The system works excellently with Flair NER + standard spaCy (no auth needed!)" -ForegroundColor Cyan
$installResumeNer = Read-Host "  Install Resume-NER? (y/N)"
if ($installResumeNer -eq "y" -or $installResumeNer -eq "Y") {
    try {
        pip install https://huggingface.co/jceason/resume-ner/resolve/main/en_resume_ner-0.0.1-py3-none-any.whl
        Write-Host "  ✅ Resume-NER model installed" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  Resume-NER installation failed (may require HuggingFace login)" -ForegroundColor Yellow
        Write-Host "  See RESUME_NER_INSTALL.md for authentication instructions" -ForegroundColor Cyan
        Write-Host "  System will use Flair NER + spaCy (works great!)" -ForegroundColor Green
    }
} else {
    Write-Host "  → Skipping Resume-NER. Using Flair NER + spaCy (recommended, no auth needed)" -ForegroundColor Green
}

# Create data directories
Write-Host "📁 Creating data directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "data\uploads" | Out-Null
New-Item -ItemType Directory -Force -Path "data\db" | Out-Null

# Check Ollama
Write-Host "🤖 Checking Ollama..." -ForegroundColor Yellow
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Write-Host "✅ Ollama is installed" -ForegroundColor Green
    Write-Host "💡 To pull a model, run: ollama pull llama3.2:3b" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Ollama not found. Install from https://ollama.com" -ForegroundColor Yellow
    Write-Host "   LLM features will not work without Ollama" -ForegroundColor Yellow
}

# Create .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ Created .env file. Please update SECRET_KEY!" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the server:" -ForegroundColor Cyan
Write-Host "  .\.venv\Scripts\Activate.ps1"
Write-Host "  uvicorn app.main:app --reload"
Write-Host ""
Write-Host "Or use Docker:" -ForegroundColor Cyan
Write-Host "  docker-compose up --build"

