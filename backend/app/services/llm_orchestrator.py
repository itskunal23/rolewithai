"""
Local LLM orchestrator using Ollama
"""
import json
import httpx
import asyncio
from typing import Dict, Optional, Any, List
from app.core.config import settings
import re
import logging

logger = logging.getLogger(__name__)

class LLMOrchestrator:
    """Orchestrate calls to local LLM (Ollama)"""
    
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.model = settings.OLLAMA_MODEL
        self.max_tokens = settings.LLM_MAX_TOKENS
        self.temperature = settings.LLM_TEMPERATURE
    
    async def is_available(self) -> bool:
        """Check if Ollama is available"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                if response.status_code == 200:
                    # Also check if the model is available
                    models = response.json().get("models", [])
                    model_names = [m.get("name", "") for m in models]
                    if self.model not in model_names:
                        print(f"⚠ Warning: Model '{self.model}' not found. Available models: {', '.join(model_names[:5])}")
                        print(f"   Install with: ollama pull {self.model}")
                    return True
                return False
        except Exception as e:
            print(f"⚠ Ollama not available at {self.base_url}: {str(e)}")
            print(f"   Install from: https://ollama.com/download")
            return False
    
    async def call_llm(self, prompt: str, system_prompt: Optional[str] = None, max_retries: int = 3) -> str:
        """
        Call local LLM via Ollama API with retry logic
        
        Args:
            prompt: User prompt
            system_prompt: Optional system prompt
            max_retries: Maximum number of retry attempts (default: 3)
            
        Returns:
            LLM response text
        """
        if not await self.is_available():
            raise RuntimeError(
                f"Ollama is not available at {self.base_url}. "
                f"Please install Ollama from https://ollama.com/download and start the service. "
                f"Then pull the model with: ollama pull {self.model}"
            )
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        # Check payload size (approximate)
        total_chars = len(prompt) + (len(system_prompt) if system_prompt else 0)
        if total_chars > 100000:  # ~100k characters might be too large
            logger.warning(f"Large prompt detected: {total_chars} characters. This may cause timeout issues.")
        
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": self.temperature,
                "num_predict": self.max_tokens,
            }
        }
        
        last_error = None
        for attempt in range(max_retries):
            try:
                # Exponential backoff: 2s, 4s, 8s
                if attempt > 0:
                    wait_time = 2 ** attempt
                    logger.info(f"Retrying LLM call (attempt {attempt + 1}/{max_retries}) after {wait_time}s...")
                    await asyncio.sleep(wait_time)
                
                # Increase timeout for large prompts
                timeout = min(180.0, 60.0 + (total_chars / 1000))  # Base 60s + 1s per 1k chars, max 180s
                
                async with httpx.AsyncClient(timeout=timeout) as client:
                    response = await client.post(
                        f"{self.base_url}/api/chat",
                        json=payload
                    )
                    
                    # Log response status for debugging
                    if response.status_code != 200:
                        logger.error(
                            f"LLM API returned status {response.status_code}. "
                            f"Response: {response.text[:500]}"
                        )
                    
                    response.raise_for_status()
                    result = response.json()
                    content = result.get("message", {}).get("content", "")
                    
                    if not content:
                        raise ValueError("Empty response from LLM")
                    
                    return content
                    
            except httpx.TimeoutException as e:
                last_error = e
                logger.warning(
                    f"LLM API timeout (attempt {attempt + 1}/{max_retries}): {str(e)}. "
                    f"Prompt size: {total_chars} chars. Timeout: {timeout}s"
                )
                if attempt == max_retries - 1:
                    raise RuntimeError(
                        f"LLM API timeout after {max_retries} attempts. "
                        f"Prompt may be too large ({total_chars} chars) or Ollama is slow. "
                        f"Try reducing resume text size or increasing timeout."
                    ) from e
                    
            except httpx.HTTPStatusError as e:
                last_error = e
                status_code = e.response.status_code if e.response else "unknown"
                error_text = e.response.text[:500] if e.response else str(e)
                logger.error(
                    f"LLM API HTTP error (attempt {attempt + 1}/{max_retries}): "
                    f"Status {status_code}, Response: {error_text}"
                )
                # Don't retry on 4xx errors (client errors)
                if 400 <= status_code < 500:
                    raise RuntimeError(
                        f"LLM API client error (status {status_code}): {error_text}. "
                        f"Check model name '{self.model}' and API endpoint '{self.base_url}'."
                    ) from e
                # Retry on 5xx errors (server errors)
                if attempt == max_retries - 1:
                    raise RuntimeError(
                        f"LLM API server error after {max_retries} attempts: "
                        f"Status {status_code}, Response: {error_text}"
                    ) from e
                    
            except httpx.RequestError as e:
                last_error = e
                logger.error(
                    f"LLM API request error (attempt {attempt + 1}/{max_retries}): {str(e)}. "
                    f"Check if Ollama is running at {self.base_url}"
                )
                if attempt == max_retries - 1:
                    raise RuntimeError(
                        f"LLM API connection error after {max_retries} attempts: {str(e)}. "
                        f"Ensure Ollama is running: ollama serve"
                    ) from e
                    
            except Exception as e:
                last_error = e
                logger.error(f"Unexpected LLM API error (attempt {attempt + 1}/{max_retries}): {str(e)}")
                if attempt == max_retries - 1:
                    raise RuntimeError(f"LLM API error after {max_retries} attempts: {str(e)}") from e
        
        # Should not reach here, but just in case
        raise RuntimeError(f"LLM API failed after {max_retries} attempts: {str(last_error)}")
    
    async def parse_resume(self, raw_text: str) -> Dict[str, Any]:
        """
        Parse resume text into structured JSON using LLM
        
        Args:
            raw_text: Raw resume text
            
        Returns:
            Parsed resume data as dict
        """
        system_prompt = """You are a strict resume parser. Your task is to extract structured information from raw resume text and output ONLY valid JSON.

The output MUST follow this exact schema:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "education": [
    {
      "school": "string",
      "degree": "string",
      "grad_date": "string",
      "gpa": "string or null"
    }
  ],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string or null",
      "start": "string or null",
      "end": "string or null",
      "bullets": ["string"]
    }
  ],
  "skills": ["string"],
  "projects": [
    {
      "title": "string",
      "tech": ["string"],
      "desc": "string"
    }
  ],
  "certifications": ["string"],
  "links": {
    "linkedin": "string or null",
    "github": "string or null",
    "portfolio": "string or null"
  }
}

Output ONLY the JSON object, no markdown, no code blocks, no explanations."""

        user_prompt = f"""Parse the following resume text into the JSON schema above:

===RAW_RESUME===
{raw_text}
===END===

Output ONLY valid JSON."""

        response = await self.call_llm(user_prompt, system_prompt)
        
        # Extract JSON from response (handle markdown code blocks if present)
        json_text = self._extract_json(response)
        
        try:
            parsed_data = json.loads(json_text)
            return parsed_data
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse LLM response as JSON: {str(e)}\nResponse: {json_text[:500]}")
    
    def _extract_json(self, text: str) -> str:
        """Extract JSON from LLM response, handling code blocks"""
        # Remove markdown code blocks if present
        text = re.sub(r'```json\s*', '', text)
        text = re.sub(r'```\s*', '', text)
        text = text.strip()
        
        # Try to find JSON object
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json_match.group(0)
        
        return text
    
    async def generate_project_spec(
        self,
        skills: List[str],
        role_title: Optional[str] = None,
        difficulty: str = "beginner"
    ) -> Dict[str, Any]:
        """
        Generate project specification using LLM
        
        Args:
            skills: List of user skills
            role_title: Target role title
            difficulty: Project difficulty (beginner, intermediate, advanced)
            
        Returns:
            Project specification dict
        """
        system_prompt = """You are an instructional designer. Create a project specification that helps users practice and demonstrate specific skills.

Output ONLY valid JSON following this schema:
{
  "title": "string",
  "description": "string",
  "dataset_source": "string (URL or 'local' or 'user-provided')",
  "steps": [
    {
      "title": "string",
      "desc": "string",
      "est_hours": number
    }
  ],
  "deliverables": ["string"],
  "rubric": [
    {
      "criterion": "string",
      "points": number
    }
  ],
  "estimated_hours": number
}

Use only public datasets (UCI ML, Kaggle free datasets) or instruct users to provide their own data. No paid API datasets."""

        user_prompt = f"""Create a {difficulty} level project specification for someone with these skills: {', '.join(skills[:10])}

Target role: {role_title or 'General Data/ML Role'}

The project should:
- Take approximately 4-8 hours to complete
- Use only free/public datasets or allow user-provided data
- Include clear steps and deliverables
- Have a rubric for evaluation

Output ONLY the JSON object."""

        response = await self.call_llm(user_prompt, system_prompt)
        json_text = self._extract_json(response)
        
        try:
            return json.loads(json_text)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse project spec JSON: {str(e)}")

