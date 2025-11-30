"""
Tests for resume processing pipeline
"""
import pytest
from app.services.resume_pipeline import ResumePipeline
from pathlib import Path
import tempfile
import json

@pytest.mark.asyncio
async def test_fallback_parse(db_session, sample_resume_text):
    """Test fallback parsing without LLM"""
    pipeline = ResumePipeline()
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write(sample_resume_text)
        temp_path = f.name
    
    try:
        # Test fallback parsing
        result = pipeline._fallback_parse(
            sample_resume_text,
            {"email": "test@example.com", "phone": "123-456-7890", "location": "VA"},
            {"education": "Virginia Tech", "skills": "Python, SQL"},
            {"persons": ["Kunal Goenka"], "organizations": ["Boeing"]}
        )
        
        assert "name" in result
        assert "email" in result
        assert "skills" in result
        assert isinstance(result["skills"], list)
    finally:
        Path(temp_path).unlink()

@pytest.mark.asyncio
async def test_resume_scoring(sample_resume_text):
    """Test resume scoring"""
    from app.services.resume_scorer import ResumeScorer
    
    scorer = ResumeScorer()
    
    # Sample parsed data
    parsed_data = {
        "name": "Kunal Goenka",
        "email": "k.goenka23@gmail.com",
        "phone": "540-424-1253",
        "location": "Stafford VA",
        "education": [{"school": "Virginia Tech", "degree": "B.Sc.", "grad_date": "May 2025"}],
        "experience": [
            {
                "title": "Supplier Quality Intern",
                "company": "Boeing",
                "start": "June 2024",
                "end": "August 2024",
                "bullets": ["Developed dashboards", "Cleaned data", "Analyzed KPIs"]
            }
        ],
        "skills": ["Python", "SQL", "Tableau", "Excel"],
        "projects": [{"title": "DineSmart", "tech": ["Flask", "Python"], "desc": "ML project"}],
        "certifications": ["AI & ML Fundamentals"]
    }
    
    score = scorer.calculate_score(parsed_data)
    
    assert 0 <= score <= 100
    assert score > 50  # Should have decent score with this data

