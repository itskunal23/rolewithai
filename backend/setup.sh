#!/bin/bash
# Setup script for RoleWithAI Backend

set -e

echo "🚀 Setting up RoleWithAI Backend..."

# Create virtual environment
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source .venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Download spaCy models
echo "📚 Downloading spaCy models..."
python -m spacy download en_core_web_sm

# Install Resume-NER model (optional - may require HuggingFace auth)
echo "📚 Installing Resume-NER model (optional)..."
echo "  Note: This may require HuggingFace authentication"
echo "  The system works excellently with Flair NER + standard spaCy (no auth needed!)"
read -p "  Install Resume-NER? (y/N): " install_resume_ner
if [[ "$install_resume_ner" =~ ^[Yy]$ ]]; then
    if pip install https://huggingface.co/jceason/resume-ner/resolve/main/en_resume_ner-0.0.1-py3-none-any.whl; then
        echo "  ✅ Resume-NER model installed"
    else
        echo "  ⚠️  Resume-NER installation failed (may require HuggingFace login)"
        echo "  See RESUME_NER_INSTALL.md for authentication instructions"
        echo "  System will use Flair NER + spaCy (works great!)"
    fi
else
    echo "  → Skipping Resume-NER. Using Flair NER + spaCy (recommended, no auth needed)"
fi

# Create data directories
echo "📁 Creating data directories..."
mkdir -p data/uploads
mkdir -p data/db

# Check Ollama
echo "🤖 Checking Ollama..."
if command -v ollama &> /dev/null; then
    echo "✅ Ollama is installed"
    echo "💡 To pull a model, run: ollama pull llama3.2:3b"
else
    echo "⚠️  Ollama not found. Install from https://ollama.com"
    echo "   LLM features will not work without Ollama"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env file. Please update SECRET_KEY!"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  source .venv/bin/activate"
echo "  uvicorn app.main:app --reload"
echo ""
echo "Or use Docker:"
echo "  docker-compose up --build"

