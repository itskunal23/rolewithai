@echo off
echo Checking Ollama setup...
echo.

echo Testing Ollama connection...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Ollama is running on http://localhost:11434
    echo.
    echo Available models:
    curl -s http://localhost:11434/api/tags | python -m json.tool
) else (
    echo [ERROR] Ollama is not running or not accessible
    echo.
    echo Please:
    echo 1. Install Ollama from https://ollama.com/download
    echo 2. Start Ollama service
    echo 3. Pull a model: ollama pull llama3.2:3b
    echo.
)

echo.
echo Testing model availability...
ollama list 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Could not run 'ollama list'
    echo Make sure Ollama is installed and in your PATH
)

pause

