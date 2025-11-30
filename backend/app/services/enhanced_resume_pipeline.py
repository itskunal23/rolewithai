"""
Production-grade resume parsing pipeline with layout awareness, confidence scoring, and provenance tracking
Based on the comprehensive spec for text-analytics & parsing design
"""
import re
import unicodedata
from pathlib import Path
from typing import Dict, Any, Optional, List, Tuple
from dataclasses import dataclass, field
from datetime import datetime
from app.services.pdf_parser import PDFParser
from app.services.nlp_extractor import NLPExtractor
from app.services.resume_scorer import ResumeScorer
from app.services.normalizer import ResumeNormalizer

try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False
    pdfplumber = None


@dataclass
class Provenance:
    """Track where extracted data came from"""
    text_span: str
    line_numbers: List[int] = field(default_factory=list)
    page: int = 0
    coordinates: Optional[Dict[str, float]] = None
    confidence: float = 0.0


@dataclass
class FieldWithConfidence:
    """Field value with confidence score and provenance"""
    value: Any
    confidence: float
    provenance: Optional[Provenance] = None


class EnhancedResumePipeline:
    """
    Production-grade resume parser with:
    - Layout-aware extraction
    - Confidence scoring
    - Provenance tracking
    - Enhanced regex patterns
    - Entity normalization
    """
    
    def __init__(self):
        self.pdf_parser = PDFParser()
        self.nlp_extractor = NLPExtractor()
        self.scorer = ResumeScorer()
        self.normalizer = ResumeNormalizer()
        
        # Enhanced regex patterns from spec
        self.email_pattern = re.compile(r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)')
        self.phone_pattern = re.compile(r'(\+?1[\s\-\.\)]*)?(\(?\d{3}\)?[\s\-\.\)]*\d{3}[\s\-\.\)]*\d{4})')
        self.gpa_pattern = re.compile(r'GPA[:\s]*([0-4]\.\d{1,2})', re.IGNORECASE)
        self.date_month_year = re.compile(r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})', re.IGNORECASE)
        self.date_range_pattern = re.compile(
            r'(?P<start>(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})\s*(?:–|-|to)\s*(?P<end>Present|Now|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})',
            re.IGNORECASE
        )
        self.bullet_pattern = re.compile(r'^[•\-\*]\s*(.+)', re.MULTILINE)
        self.location_pattern = re.compile(r'([A-Za-z ]+,\s*[A-Z]{2}\s*\d{5})|([A-Za-z ]+,\s*\d{5})')
        
        # Section header patterns
        self.section_header_patterns = {
            "education": re.compile(r'^(education|academic|university|school|college|degree|bachelor|master|phd|graduation)', re.IGNORECASE),
            "experience": re.compile(r'^(experience|work|employment|professional|career|work history|employment history|professional experience)', re.IGNORECASE),
            "skills": re.compile(r'^(skills|technical skills|competencies|expertise|technical expertise|proficiencies|technologies|tools)', re.IGNORECASE),
            "projects": re.compile(r'^(projects|portfolio|work samples|technical projects|personal projects|technical projects & data analytics|data analytics)', re.IGNORECASE),
            "certifications": re.compile(r'^(certifications|certificates|credentials|licenses)', re.IGNORECASE),
        }
        
        # All-caps header pattern
        self.all_caps_header = re.compile(r'^[A-Z][A-Z &\'\/]{2,}$')
    
    def normalize_text(self, text: str) -> str:
        """Normalize text according to spec"""
        # Unicode normalization
        text = unicodedata.normalize("NFKC", text)
        # Normalize dashes
        text = re.sub(r'\u2013|\u2014', '-', text)
        # Trim trailing whitespace before newlines
        text = re.sub(r'\s+\n', '\n', text)
        return text
    
    def extract_text_with_layout(self, pdf_path: str) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Extract text with layout information (coordinates, font sizes)
        Returns: (text, layout_blocks)
        """
        if not PDFPLUMBER_AVAILABLE:
            # Fallback to simple extraction
            text = self.pdf_parser.extract_text(pdf_path)
            return text, []
        
        text_parts = []
        layout_blocks = []
        
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page_num, page in enumerate(pdf.pages):
                    # Extract text
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
                    
                    # Extract words with layout
                    words = page.extract_words()
                    if words:
                        for word in words:
                            layout_blocks.append({
                                "text": word.get('text', ''),
                                "x0": word.get('x0', 0),
                                "y0": word.get('top', 0),
                                "x1": word.get('x1', 0),
                                "y1": word.get('bottom', 0),
                                "font_size": word.get('size', 0),
                                "is_bold": 'bold' in word.get('fontname', '').lower(),
                                "page": page_num
                            })
        except Exception as e:
            # Fallback to simple extraction
            text = self.pdf_parser.extract_text(pdf_path)
            return text, []
        
        return "\n".join(text_parts), layout_blocks
    
    def segment_sections(self, text: str, layout_blocks: List[Dict] = None) -> Dict[str, Dict[str, Any]]:
        """
        Enhanced section segmentation with layout awareness
        Returns: {section_name: {content: str, start_line: int, end_line: int, confidence: float}}
        """
        sections = {}
        lines = text.split('\n')
        
        current_section = None
        current_content = []
        current_start_line = 0
        
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            if not line_stripped:
                if current_section:
                    current_content.append(line)
                continue
            
            line_lower = line_stripped.lower()
            matched_section = None
            
            # Check if line is a section header
            is_all_caps = self.all_caps_header.match(line_stripped)
            is_likely_header = (
                is_all_caps and len(line_stripped) < 80
            ) or (
                line_stripped[0].isupper() and 
                line_stripped.count(' ') < 8 and 
                len(line_stripped) < 80
            )
            
            # Check section patterns
            for section_name, pattern in self.section_header_patterns.items():
                if pattern.search(line_lower):
                    if is_likely_header or len(line_stripped.split()) <= 8:
                        # Save previous section
                        if current_section:
                            sections[current_section] = {
                                "content": '\n'.join(current_content).strip(),
                                "start_line": current_start_line,
                                "end_line": i - 1,
                                "confidence": 0.9
                            }
                        
                        # Start new section
                        current_section = section_name
                        current_content = []
                        current_start_line = i
                        matched_section = section_name
                        break
            
            if not matched_section:
                if current_section:
                    current_content.append(line)
        
        # Save last section
        if current_section:
            sections[current_section] = {
                "content": '\n'.join(current_content).strip(),
                "start_line": current_start_line,
                "end_line": len(lines) - 1,
                "confidence": 0.9
            }
        
        return sections
    
    def parse_contact_block(self, text: str, first_lines: List[str] = None) -> Dict[str, FieldWithConfidence]:
        """
        Enhanced contact extraction with confidence scoring
        """
        contact = {}
        
        # Use first 10 lines for contact block
        if first_lines is None:
            first_lines = text.split('\n')[:10]
        contact_text = '\n'.join(first_lines)
        
        # Extract email
        email_match = self.email_pattern.search(contact_text)
        if email_match:
            contact["email"] = FieldWithConfidence(
                value=email_match.group(1),
                confidence=0.98,
                provenance=Provenance(
                    text_span=email_match.group(0),
                    line_numbers=[i for i, line in enumerate(first_lines) if email_match.group(1) in line]
                )
            )
        
        # Extract phone
        phone_match = self.phone_pattern.search(contact_text)
        if phone_match:
            # Format phone
            area_code = phone_match.group(2) if phone_match.group(2) else ""
            if area_code:
                # Extract digits
                digits = re.findall(r'\d', area_code)
                if len(digits) >= 10:
                    phone = f"+1 ({''.join(digits[0:3])}) {''.join(digits[3:6])}-{''.join(digits[6:10])}"
                    contact["phone"] = FieldWithConfidence(
                        value=phone,
                        confidence=0.95,
                        provenance=Provenance(
                            text_span=phone_match.group(0),
                            line_numbers=[i for i, line in enumerate(first_lines) if phone_match.group(0) in line]
                        )
                    )
        
        # Extract location
        location_match = self.location_pattern.search(contact_text)
        if location_match:
            location = location_match.group(0)
            contact["location"] = FieldWithConfidence(
                value=location,
                confidence=0.90,
                provenance=Provenance(
                    text_span=location,
                    line_numbers=[i for i, line in enumerate(first_lines) if location in line]
                )
            )
        
        # Extract name (heuristic: first capitalized line without email/phone)
        for line in first_lines[:5]:
            line_stripped = line.strip()
            if not line_stripped:
                continue
            # Skip if contains email or phone
            if self.email_pattern.search(line_stripped) or self.phone_pattern.search(line_stripped):
                continue
            # Check if looks like a name (2-4 capitalized words)
            words = line_stripped.split()
            if 2 <= len(words) <= 4 and all(w[0].isupper() for w in words if w):
                contact["name"] = FieldWithConfidence(
                    value=line_stripped,
                    confidence=0.85,
                    provenance=Provenance(
                        text_span=line_stripped,
                        line_numbers=[first_lines.index(line)]
                    )
                )
                break
        
        return contact
    
    def parse_education(self, section_text: str) -> List[Dict[str, Any]]:
        """Enhanced education extraction with confidence scoring"""
        if not section_text:
            return []
        
        education_list = []
        lines = [l.strip() for l in section_text.split('\n') if l.strip()]
        
        current_edu = None
        i = 0
        
        while i < len(lines):
            line = lines[i]
            line_lower = line.lower()
            
            # Check for school/university keywords
            has_edu_keywords = any(word in line_lower for word in [
                'bachelor', 'master', 'phd', 'degree', 'university', 'college', 
                'institute', 'school', 'bs', 'ba', 'ms', 'ma', 'mba'
            ])
            
            is_school_line = any(word in line_lower for word in ['university', 'college', 'institute', 'school'])
            
            if has_edu_keywords or (is_school_line and not current_edu):
                # Save previous
                if current_edu:
                    education_list.append(current_edu)
                
                # Extract school and unit
                school = ""
                unit = ""
                if ':' in line:
                    parts = line.split(':', 1)
                    school = parts[0].strip()
                    unit = parts[1].strip() if len(parts) > 1 else ""
                else:
                    school = line
                
                # Extract location
                location_match = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})(?:\s+(\d{5}))?', line)
                location = None
                if location_match:
                    location = f"{location_match.group(1)}, {location_match.group(2)}"
                
                current_edu = {
                    "school": school,
                    "unit": unit if unit else None,
                    "degree": "",
                    "major_concentration": "",
                    "gpa": None,
                    "honors": [],
                    "graduation_date": "",
                    "location": location,
                    "confidence": 0.92,
                    "provenance": {
                        "text_span": line,
                        "line_numbers": [i]
                    }
                }
            elif current_edu:
                # Continuation line
                # Check for GPA
                gpa_match = self.gpa_pattern.search(line)
                if gpa_match:
                    try:
                        current_edu["gpa"] = float(gpa_match.group(1))
                    except:
                        pass
                
                # Check for degree
                if any(word in line_lower for word in ['bachelor', 'master', 'degree', 'bs', 'ba', 'ms', 'ma']):
                    if not current_edu["degree"]:
                        current_edu["degree"] = line
                    else:
                        current_edu["degree"] += " " + line
                
                # Check for major/concentration
                if 'in ' in line_lower or 'concentration' in line_lower or 'major' in line_lower:
                    current_edu["major_concentration"] = line
                
                # Check for graduation date
                grad_match = re.search(r'graduation\s+date[:\s]*(?P<month>[A-Za-z]+)\s*(?P<year>\d{4})', line, re.IGNORECASE)
                if grad_match:
                    month = grad_match.group("month")
                    year = grad_match.group("year")
                    # Normalize to YYYY-MM
                    month_map = {
                        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
                        'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
                        'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
                    }
                    month_num = month_map.get(month.lower()[:3], '01')
                    current_edu["graduation_date"] = f"{year}-{month_num}"
                
                # Check for honors
                if any(keyword in line_lower for keyword in ["dean's list", "honor roll", "cum laude", "honors"]):
                    current_edu["honors"].append(line)
            
            i += 1
        
        # Save last
        if current_edu:
            education_list.append(current_edu)
        
        return education_list
    
    def parse_experience(self, section_text: str) -> List[Dict[str, Any]]:
        """Enhanced experience extraction with metrics and tags"""
        if not section_text:
            return []
        
        experience_list = []
        lines = section_text.split('\n')
        
        current_exp = None
        i = 0
        
        while i < len(lines):
            line = lines[i].strip()
            if not line:
                i += 1
                continue
            
            # Check if line looks like company/job header
            has_date = self.date_month_year.search(line) or self.date_range_pattern.search(line)
            has_location = re.search(r'[A-Z][a-z]+,\s*[A-Z]{2}', line)
            job_keywords = ['engineer', 'developer', 'analyst', 'manager', 'intern', 'assistant', 
                          'specialist', 'coordinator', 'consultant', 'director', 'lead', 'senior']
            has_job_keyword = any(word in line.lower() for word in job_keywords)
            
            is_company_line = (
                not line.startswith('-') and 
                not line.startswith('•') and
                len(line) > 3 and
                (line[0].isupper() or has_location)
            )
            
            # Check if next line has location
            is_job_line = False
            if is_company_line:
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    if re.search(r'[A-Z][a-z]+,\s*[A-Z]{2}', next_line):
                        is_job_line = True
                if has_location and not has_job_keyword:
                    is_job_line = True
                if has_date and has_job_keyword:
                    is_job_line = True
            
            if is_job_line:
                # Save previous
                if current_exp and (current_exp.get("title") or current_exp.get("company")):
                    experience_list.append(current_exp)
                
                # Extract company, title, location, dates
                company = line
                title = ""
                location = None
                start_date = None
                end_date = None
                
                # Check next line for location
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    loc_match = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+\d{5})?)', next_line)
                    if loc_match:
                        location = loc_match.group(1)
                        # Check line after location for title and dates
                        if i + 2 < len(lines):
                            role_line = lines[i + 2].strip()
                            # Extract title
                            if any(word in role_line.lower() for word in job_keywords):
                                title = re.sub(self.date_month_year.pattern + r'|' + self.date_range_pattern.pattern, '', role_line).strip()
                            # Extract dates
                            date_range_match = self.date_range_pattern.search(role_line)
                            if date_range_match:
                                start_str = date_range_match.group("start")
                                end_str = date_range_match.group("end")
                                # Normalize dates
                                start_date = self._normalize_date(start_str)
                                if end_str.lower() not in ["present", "now"]:
                                    end_date = self._normalize_date(end_str)
                                else:
                                    end_date = "Present"
                            i += 2
                        else:
                            i += 1
                    else:
                        i += 1
                else:
                    i += 1
                
                current_exp = {
                    "company": company,
                    "title": title,
                    "location": location,
                    "start_date": start_date,
                    "end_date": end_date,
                    "bullets": [],
                    "confidence": 0.94,
                    "provenance": {
                        "text_span": line,
                        "line_numbers": [i]
                    }
                }
            elif current_exp:
                # Bullet point or description
                if line.startswith('-') or line.startswith('•') or line.startswith('*'):
                    bullet_text = line.lstrip('- •*').strip()
                    if bullet_text:
                        # Extract metrics
                        metrics = self._extract_metrics(bullet_text)
                        # Extract tags/technologies
                        tags = self._extract_tags(bullet_text)
                        
                        current_exp["bullets"].append({
                            "text": bullet_text,
                            "tags": tags,
                            "metrics": metrics,
                            "confidence": 0.90
                        })
                elif len(line) > 10:
                    # Continuation
                    if current_exp["bullets"]:
                        current_exp["bullets"][-1]["text"] += " " + line
                    else:
                        current_exp["bullets"].append({
                            "text": line,
                            "tags": [],
                            "metrics": [],
                            "confidence": 0.85
                        })
            
            i += 1
        
        # Save last
        if current_exp and (current_exp.get("title") or current_exp.get("company")):
            experience_list.append(current_exp)
        
        return experience_list
    
    def parse_skills(self, section_text: str) -> Dict[str, Any]:
        """Enhanced skills extraction with categorization"""
        if not section_text:
            return {"programming_languages": [], "tools": [], "analytical_skills": [], "confidence": 0.0}
        
        skills = {
            "programming_languages": [],
            "tools": [],
            "analytical_skills": [],
            "confidence": 0.99
        }
        
        lines = section_text.split('\n')
        
        for line in lines:
            line_lower = line.lower()
            
            # Check for category headers
            if 'programming' in line_lower or 'languages' in line_lower:
                # Extract skills after colon
                if ':' in line:
                    skills_str = line.split(':', 1)[1]
                    skills_list = [s.strip() for s in re.split(r'[,&]', skills_str) if s.strip()]
                    skills["programming_languages"].extend(skills_list)
            elif 'tools' in line_lower:
                if ':' in line:
                    skills_str = line.split(':', 1)[1]
                    skills_list = [s.strip() for s in re.split(r'[,&]', skills_str) if s.strip()]
                    skills["tools"].extend(skills_list)
            elif 'analytical' in line_lower or 'data' in line_lower:
                if ':' in line:
                    skills_str = line.split(':', 1)[1]
                    skills_list = [s.strip() for s in re.split(r'[,&]', skills_str) if s.strip()]
                    skills["analytical_skills"].extend(skills_list)
            else:
                # Try to extract all skills from line
                skills_list = [s.strip() for s in re.split(r'[,&]', line) if s.strip() and len(s.strip()) > 2]
                # Categorize
                for skill in skills_list:
                    skill_lower = skill.lower()
                    if any(tech in skill_lower for tech in ['python', 'java', 'sql', 'javascript', 'html', 'css', 'c#', 'vba']):
                        if skill not in skills["programming_languages"]:
                            skills["programming_languages"].append(skill)
                    elif any(tech in skill_lower for tech in ['tableau', 'excel', 'mysql', 'git', 'salesforce', 'powerpoint']):
                        if skill not in skills["tools"]:
                            skills["tools"].append(skill)
                    elif any(tech in skill_lower for tech in ['data', 'modeling', 'visualization', 'analytics', 'cleaning']):
                        if skill not in skills["analytical_skills"]:
                            skills["analytical_skills"].append(skill)
        
        return skills
    
    def parse_projects(self, section_text: str) -> List[Dict[str, Any]]:
        """Enhanced projects extraction"""
        if not section_text:
            return []
        
        projects = []
        lines = section_text.split('\n')
        
        current_project = None
        
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            if not line_stripped:
                continue
            
            # Check if project header
            is_project_header = (
                not line_stripped.startswith('-') and
                not line_stripped.startswith('•') and
                len(line_stripped) > 3 and
                len(line_stripped) < 100
            )
            
            has_location = re.search(r'[A-Z][a-z]+,\s*[A-Z]{2}', line_stripped)
            has_date = self.date_month_year.search(line_stripped)
            
            if is_project_header and (has_location or has_date or i == 0 or not current_project):
                # Save previous
                if current_project:
                    projects.append(current_project)
                
                # Extract project details
                title = line_stripped
                location = None
                date = None
                role = None
                
                # Extract location
                loc_match = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*[A-Z]{2}', line_stripped)
                if loc_match:
                    location = loc_match.group(0)
                    title = title.replace(location, '').strip()
                
                # Extract date
                date_match = self.date_month_year.search(line_stripped)
                if date_match:
                    date = self._normalize_date(date_match.group(1))
                    title = self.date_month_year.sub('', title).strip()
                
                # Extract role
                role_keywords = ['developer', 'manager', 'analyst', 'designer', 'engineer', 'lead']
                if any(keyword in line_stripped.lower() for keyword in role_keywords):
                    role_match = re.search(r'([A-Z][a-zA-Z\s&|]+(?:Developer|Manager|Analyst|Designer|Engineer|Lead))', line_stripped, re.IGNORECASE)
                    if role_match:
                        role = role_match.group(1).strip()
                        title = title.replace(role, '').strip()
                
                current_project = {
                    "title": title,
                    "role": role,
                    "location": location,
                    "date": date,
                    "technologies": [],
                    "description": "",
                    "confidence": 0.92
                }
            elif current_project:
                # Description or tech
                if line_stripped.startswith('-') or line_stripped.startswith('•'):
                    bullet = line_stripped.lstrip('- •*').strip()
                    # Extract technologies
                    tech_keywords = ['Python', 'JavaScript', 'React', 'Flask', 'MySQL', 'Tableau', 'Excel']
                    found_tech = [kw for kw in tech_keywords if kw.lower() in bullet.lower()]
                    current_project["technologies"].extend(found_tech)
                    current_project["description"] += bullet + " "
                else:
                    current_project["description"] += line_stripped + " "
        
        if current_project:
            projects.append(current_project)
        
        # Clean up
        for proj in projects:
            proj["description"] = proj["description"].strip()
            proj["technologies"] = list(set(proj["technologies"]))
        
        return projects
    
    def parse_certifications(self, section_text: str) -> List[Dict[str, Any]]:
        """Enhanced certifications extraction"""
        if not section_text:
            return []
        
        certifications = []
        lines = section_text.split('\n')
        
        for line in lines:
            line_stripped = line.strip()
            if not line_stripped:
                continue
            
            # Remove bullets
            line_stripped = line_stripped.lstrip('- •*').strip()
            
            # Pattern: "Cert Name (Issuer, Year), Cert Name (Issuer, Year)"
            # Split by comma but preserve parentheses
            cert_pattern = r'([^,\(]+(?:\([^)]+\))?)'
            matches = re.findall(cert_pattern, line_stripped)
            
            for match in matches:
                match = match.strip()
                if len(match) < 3:
                    continue
                
                # Extract issuer and year from parentheses
                issuer_year_match = re.search(r'\(([^,]+),\s*(\d{4})\)', match)
                if issuer_year_match:
                    cert_name = match[:issuer_year_match.start()].strip()
                    issuer = issuer_year_match.group(1).strip()
                    year = int(issuer_year_match.group(2))
                    
                    certifications.append({
                        "name": cert_name,
                        "issuer": issuer,
                        "year": year,
                        "confidence": 0.9
                    })
                else:
                    # No parentheses, just name
                    certifications.append({
                        "name": match,
                        "issuer": None,
                        "year": None,
                        "confidence": 0.7
                    })
        
        return certifications
    
    def _normalize_date(self, date_str: str) -> str:
        """Normalize date to YYYY-MM format"""
        # Try month year format
        month_year_match = re.search(r'([A-Za-z]+)\s+(\d{4})', date_str, re.IGNORECASE)
        if month_year_match:
            month = month_year_match.group(1)
            year = month_year_match.group(2)
            month_map = {
                'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
                'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
                'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
            }
            month_num = month_map.get(month.lower()[:3], '01')
            return f"{year}-{month_num}"
        return date_str
    
    def _extract_metrics(self, text: str) -> List[str]:
        """Extract metrics from text (numbers with units)"""
        metrics = []
        # Pattern: number + unit
        metric_pattern = r'(\d{1,3}(?:,\d{3})*)(?:\+|\s*(?:percent|%|hours|hrs|days|customers|members|inquiries|payments))'
        matches = re.findall(metric_pattern, text, re.IGNORECASE)
        for match in matches:
            if isinstance(match, tuple):
                metrics.append(match[0])
            else:
                metrics.append(match)
        return metrics
    
    def _extract_tags(self, text: str) -> List[str]:
        """Extract technology/tool tags from text"""
        tags = []
        tech_keywords = ['tableau', 'mysql', 'python', 'react', 'flask', 'salesforce', 'excel', 'sap', 'ai', 'data']
        for keyword in tech_keywords:
            if keyword.lower() in text.lower():
                tags.append(keyword)
        return tags
    
    async def process_resume(self, pdf_path: str, user_id: str, use_llm: bool = False) -> Dict[str, Any]:
        """
        Main processing pipeline
        Returns enhanced resume data with confidence scores and provenance
        """
        # Step 1: Extract text with layout
        raw_text, layout_blocks = self.extract_text_with_layout(pdf_path)
        
        # Step 2: Normalize text
        normalized_text = self.normalize_text(raw_text)
        lines = normalized_text.split('\n')
        
        # Step 3: Segment sections
        sections = self.segment_sections(normalized_text, layout_blocks)
        
        # Step 4: Parse contact block
        contact_data = self.parse_contact_block(normalized_text, lines[:10])
        
        # Step 5: Parse each section
        resume_data = {
            "contact": {k: v.value if isinstance(v, FieldWithConfidence) else v for k, v in contact_data.items()},
            "education": [],
            "experience": [],
            "skills": {},
            "projects": [],
            "certifications": [],
            "meta": {
                "source": "enhanced_parser",
                "parser_version": "v2.0",
                "extraction_time": datetime.now().isoformat()
            }
        }
        
        # Parse education
        if "education" in sections:
            resume_data["education"] = self.parse_education(sections["education"]["content"])
        
        # Parse experience
        if "experience" in sections:
            resume_data["experience"] = self.parse_experience(sections["experience"]["content"])
        
        # Parse skills
        if "skills" in sections:
            resume_data["skills"] = self.parse_skills(sections["skills"]["content"])
        
        # Parse projects
        if "projects" in sections:
            resume_data["projects"] = self.parse_projects(sections["projects"]["content"])
        
        # Parse certifications
        if "certifications" in sections:
            resume_data["certifications"] = self.parse_certifications(sections["certifications"]["content"])
        
        # Step 6: Normalize and score
        # Convert to format compatible with existing normalizer
        normalized_data = self._convert_to_standard_format(resume_data)
        normalized_data = self.normalizer.normalize_resume(normalized_data, {})
        
        # Calculate score
        score = self.scorer.calculate_score(normalized_data)
        
        # Add metadata
        normalized_data["_metadata"] = {
            "raw_text_length": len(raw_text),
            "processing_method": "enhanced-rule-based",
            "sections_found": list(sections.keys()),
            "parser_version": "v2.0"
        }
        
        return {
            "parsed_data": normalized_data,
            "raw_text": raw_text,
            "score": score
        }
    
    def _convert_to_standard_format(self, resume_data: Dict) -> Dict:
        """Convert enhanced format to standard format for compatibility"""
        standard = {
            "name": resume_data["contact"].get("name", ""),
            "email": resume_data["contact"].get("email", ""),
            "phone": resume_data["contact"].get("phone", ""),
            "location": resume_data["contact"].get("location", ""),
            "education": [],
            "experience": [],
            "skills": [],
            "projects": [],
            "certifications": []
        }
        
        # Convert education
        for edu in resume_data["education"]:
            standard["education"].append({
                "school": edu.get("school", ""),
                "degree": edu.get("degree", ""),
                "grad_date": edu.get("graduation_date", ""),
                "gpa": edu.get("gpa"),
                "school_location": edu.get("location")
            })
        
        # Convert experience
        for exp in resume_data["experience"]:
            bullets = [b["text"] if isinstance(b, dict) else b for b in exp.get("bullets", [])]
            standard["experience"].append({
                "company": exp.get("company", ""),
                "title": exp.get("title", ""),
                "location": exp.get("location"),
                "start": exp.get("start_date"),
                "end": exp.get("end_date"),
                "bullets": bullets
            })
        
        # Convert skills
        skills_list = []
        skills_dict = resume_data.get("skills", {})
        if isinstance(skills_dict, dict):
            skills_list.extend(skills_dict.get("programming_languages", []))
            skills_list.extend(skills_dict.get("tools", []))
            skills_list.extend(skills_dict.get("analytical_skills", []))
        standard["skills"] = skills_list
        
        # Convert projects
        for proj in resume_data["projects"]:
            standard["projects"].append({
                "title": proj.get("title", ""),
                "tech": proj.get("technologies", []),
                "desc": proj.get("description", "")
            })
        
        # Convert certifications
        for cert in resume_data["certifications"]:
            cert_str = cert.get("name", "")
            if cert.get("issuer"):
                cert_str += f" ({cert['issuer']}"
                if cert.get("year"):
                    cert_str += f", {cert['year']}"
                cert_str += ")"
            standard["certifications"].append(cert_str)
        
        return standard

