"""
PDF text extraction using pdfplumber (fast, reliable, lightweight)
"""
import re
from pathlib import Path
from typing import Optional, Dict, List

try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False
    pdfplumber = None

class PDFParser:
    """Extract text from PDF files using pdfplumber"""
    
    def __init__(self):
        pass
    
    def extract_text(self, pdf_path: str) -> str:
        """
        Extract raw text from PDF file using pdfplumber (fast & reliable)
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            Extracted text as string
        """
        if not PDFPLUMBER_AVAILABLE:
            raise ImportError("pdfplumber is not installed. Install with: pip install pdfplumber")
        
        try:
            pdf_file = Path(pdf_path)
            if not pdf_file.exists():
                raise FileNotFoundError(f"PDF file not found: {pdf_path}")
            
            text_parts = []
            
            with pdfplumber.open(str(pdf_file)) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        text_parts.append(text)
            
            if not text_parts:
                raise ValueError("No text could be extracted from PDF. The file might be image-based or corrupted.")
            
            extracted_text = "\n".join(text_parts)
            return extracted_text
        except FileNotFoundError:
            raise
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    
    def extract_contact_info(self, text: str) -> Dict[str, Optional[str]]:
        """
        Extract contact information using regex patterns
        
        Args:
            text: Raw resume text
            
        Returns:
            Dict with email, phone, and location
        """
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        email = email_match.group(0) if email_match else None
        
        # Phone pattern (improved - handles ZIP separation)
        # Pattern: (+1 optional) (area code) (exchange) (number)
        # First, try to find phone patterns that might be concatenated with ZIP
        phone_pattern = r'(?:(?:\+?1[\s-])?)\(?(\d{3})\)?[\s-]*(\d{3})[\s-]*(\d{4})'
        
        # Look for patterns like "22554 540-424-1253" (ZIP followed by phone)
        zip_phone_pattern = r'\b(\d{5})\s+(\d{3})[-.\s]*(\d{3})[-.\s]*(\d{4})\b'
        zip_phone_match = re.search(zip_phone_pattern, text)
        
        phone = None
        if zip_phone_match:
            # Found ZIP + phone pattern - extract phone only
            area_code = zip_phone_match.group(2)
            exchange = zip_phone_match.group(3)
            number = zip_phone_match.group(4)
            phone = f"+1 ({area_code}) {exchange}-{number}"
        else:
            # Standard phone pattern
            phone_match = re.search(phone_pattern, text)
            if phone_match:
                # Format as +1 (XXX) XXX-XXXX
                area_code = phone_match.group(1)
                exchange = phone_match.group(2)
                number = phone_match.group(3)
                phone = f"+1 ({area_code}) {exchange}-{number}"
                
                # Verify phone doesn't start with a ZIP code (5 digits before area code)
                phone_start_pos = phone_match.start()
                if phone_start_pos >= 6:
                    context_before = text[max(0, phone_start_pos - 6):phone_start_pos]
                    zip_before = re.search(r'\b\d{5}\b', context_before)
                    if zip_before:
                        # ZIP code found immediately before phone - this is the concatenated case
                        # The phone extraction is still correct, but we've identified the issue
                        pass
        
        # Location (heuristic: look for common location patterns)
        # Extract location with ZIP code
        location_patterns = [
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})\s+(\d{5})',  # City, ST ZIP
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})',  # City, ST
            r'([A-Z][a-z]+\s+[A-Z]{2})',  # City ST
        ]
        location = None
        for pattern in location_patterns:
            loc_match = re.search(pattern, text)
            if loc_match:
                if len(loc_match.groups()) == 3:
                    # City, ST ZIP format
                    city = loc_match.group(1)
                    state = loc_match.group(2)
                    zip_code = loc_match.group(3)
                    location = f"{city}, {state} {zip_code}"
                elif len(loc_match.groups()) == 2:
                    # City, ST format
                    location = f"{loc_match.group(1)}, {loc_match.group(2)}"
                else:
                    location = loc_match.group(0)
                break
        
        return {
            "email": email,
            "phone": phone,
            "location": location
        }
    
    def preprocess_text(self, text: str) -> str:
        """
        Clean and normalize extracted text
        
        Args:
            text: Raw extracted text
            
        Returns:
            Cleaned text
        """
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove excessive newlines
        text = re.sub(r'\n{3,}', '\n\n', text)
        # Remove headers/footers (basic heuristic - page numbers)
        lines = text.split('\n')
        filtered_lines = []
        for line in lines:
            # Skip lines that are just page numbers
            if re.match(r'^\s*\d+\s*$', line):
                continue
            filtered_lines.append(line)
        
        return '\n'.join(filtered_lines)
