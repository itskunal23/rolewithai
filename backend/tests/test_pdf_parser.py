"""
Tests for PDF parser
"""
import pytest
from app.services.pdf_parser import PDFParser
from pathlib import Path

@pytest.fixture
def parser():
    return PDFParser()

def test_extract_contact_info(parser):
    """Test contact info extraction"""
    text = """
    John Doe
    john.doe@example.com
    Phone: 555-123-4567
    Location: San Francisco, CA 94102
    """
    
    contact = parser.extract_contact_info(text)
    
    assert contact["email"] == "john.doe@example.com"
    assert contact["phone"] is not None
    assert contact["location"] is not None

def test_preprocess_text(parser):
    """Test text preprocessing"""
    text = "Line 1\n\n\n\nLine 2\n\nLine 3"
    cleaned = parser.preprocess_text(text)
    
    # Should normalize excessive newlines
    assert "\n\n\n\n" not in cleaned

