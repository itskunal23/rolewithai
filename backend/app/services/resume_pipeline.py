"""
Complete resume parsing pipeline with semantic chunking and normalization
"""
import re
from pathlib import Path
from typing import Dict, Any, Optional
from app.services.pdf_parser import PDFParser
from app.services.nlp_extractor import NLPExtractor
from app.services.resume_scorer import ResumeScorer
from app.services.normalizer import ResumeNormalizer

class ResumePipeline:
    """Standard resume parsing pipeline with normalization"""
    
    def __init__(self):
        self.pdf_parser = PDFParser()
        self.nlp_extractor = NLPExtractor()
        self.scorer = ResumeScorer()
        self.normalizer = ResumeNormalizer()
    
    async def process_resume(
        self,
        pdf_path: str,
        user_id: str,
        use_llm: bool = False  # Disabled by default for speed
    ) -> Dict[str, Any]:
        """
        Process resume through fast rule-based pipeline (≤ 0.4 sec)
        
        Args:
            pdf_path: Path to uploaded PDF
            user_id: User ID
            use_llm: Ignored (LLM parsing disabled for speed)
            
        Returns:
            Complete parsed resume data with score
        """
        # Step 1: Extract text from PDF
        raw_text = self.pdf_parser.extract_text(pdf_path)
        cleaned_text = self.pdf_parser.preprocess_text(raw_text)
        
        # Step 2: Extract contact info with regex
        contact_info = self.pdf_parser.extract_contact_info(cleaned_text)
        
        # Step 3: Extract sections and entities
        sections = self.nlp_extractor.extract_sections(cleaned_text)
        entities = self.nlp_extractor.extract_entities(cleaned_text)
        
        # Step 4: Rule-based parsing (fast & reliable)
        parsed_data = self._parse_resume(cleaned_text, contact_info, sections, entities)
        
        # Step 5: Normalize and add confidence scores
        normalized_data = self.normalizer.normalize_resume(parsed_data, entities)
        
        # Step 6: Calculate resume score
        score = self.scorer.calculate_score(normalized_data)
        normalized_data["resume_score"] = score
        if normalized_data.get("meta"):
            normalized_data["meta"]["resumeScore"] = score
        
        # Step 7: Add metadata
        normalized_data["_metadata"] = {
            "raw_text_length": len(raw_text),
            "processing_method": "rule-based",
            "sections_found": list(sections.keys()),
        }
        
        return {
            "parsed_data": normalized_data,
            "raw_text": raw_text,
            "score": score
        }
    
    def _parse_resume(
        self,
        text: str,
        contact_info: Dict[str, Optional[str]],
        sections: Dict[str, str],
        entities: Dict[str, list]
    ) -> Dict[str, Any]:
        """
        Fast rule-based resume parsing (primary method)
        """
        # Extract skills
        skills = self.nlp_extractor.extract_skills(text)
        
        # Extract name - try multiple methods with improved heuristics
        name = ""
        
        # Method 1: Use spaCy NER persons (most reliable)
        if entities.get("persons") and len(entities["persons"]) > 0:
            # Filter out false positives (tech stack items, etc.)
            for person in entities["persons"]:
                # Reject if it looks like a technology (contains .js, .py, etc.)
                if not re.search(r'\.(js|py|ts|java|cpp|html|css|sql)$', person, re.IGNORECASE):
                    # Reject if it's all caps and short (likely acronym)
                    if not (person.isupper() and len(person) <= 5):
                        # Reject if it contains numbers
                        if not re.search(r'\d', person):
                            name = person
                            break
        
        # Method 2: Extract from first few lines if NER didn't find it
        if not name:
            lines = text.split('\n')[:10]  # Check first 10 lines
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Skip if line contains email or phone patterns
                if re.search(r'@|\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', line):
                    continue
                
                # Skip if line looks like a section header (all caps, short)
                if line.isupper() and len(line) < 30:
                    continue
                
                # Skip if line contains common tech stack indicators
                tech_indicators = ['.js', '.py', 'react', 'angular', 'vue', 'node', 'sql', 'api']
                if any(indicator in line.lower() for indicator in tech_indicators):
                    continue
                
                words = line.split()
                # Name should be 2-4 words, all starting with capital letters
                if 2 <= len(words) <= 4:
                    # Check if all words start with capital and are alphabetic (allow hyphens)
                    if all(w[0].isupper() and w.replace('-', '').isalpha() for w in words if w):
                        # Additional check: reject if any word is too short (likely not a name)
                        if all(len(w) >= 2 for w in words):
                            name = line
                            break
        
        # Enhanced experience extraction: try section first, then full text if section is empty
        experience_text = sections.get("experience", "")
        if not experience_text or len(experience_text.strip()) < 50:
            # If experience section is too short or empty, try to extract from full text
            # Look for date patterns that might indicate experience entries
            date_pattern = r'\b(20\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s\-–—]*(20\d{2}|Present|Current)?\b'
            if re.search(date_pattern, text, re.IGNORECASE):
                # Found dates in text, try parsing full text for experience
                # But limit to text after name/contact section (first 20% might be header)
                lines = text.split('\n')
                # Skip first 20% of lines (likely header/contact info)
                skip_lines = max(5, len(lines) // 5)
                experience_text = '\n'.join(lines[skip_lines:])
        
        # Always ensure experience is a list
        experience = self._parse_experience_section(experience_text)
        if not isinstance(experience, list):
            experience = []
        
        # If still no experience found, try a more aggressive search
        if not experience:
            # Look for common job title patterns in the text
            job_title_patterns = [
                r'\b(Engineer|Developer|Analyst|Manager|Intern|Assistant|Specialist|Coordinator|Consultant|Director|Lead|Senior|Junior|Associate)\b',
            ]
            for pattern in job_title_patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    # Found job titles, try parsing a larger chunk of text
                    # Take middle 60% of text (skip header and footer)
                    lines = text.split('\n')
                    start_idx = len(lines) // 5
                    end_idx = len(lines) - (len(lines) // 5)
                    experience_text = '\n'.join(lines[start_idx:end_idx])
                    experience = self._parse_experience_section(experience_text)
                    if not isinstance(experience, list):
                        experience = []
                    if experience:
                        break
        
        # Ensure all fields are properly typed
        education_list = self._parse_education_section(sections.get("education", ""))
        if not isinstance(education_list, list):
            education_list = []
        
        projects_list = self._parse_projects_section(sections.get("projects", ""))
        if not isinstance(projects_list, list):
            projects_list = []
        
        certifications_list = self._parse_list_section(sections.get("certifications", ""))
        if not isinstance(certifications_list, list):
            certifications_list = []
        
        if not isinstance(skills, list):
            skills = []
        
        if not isinstance(experience, list):
            experience = []
        
        # Basic structure
        parsed = {
            "name": name,
            "email": contact_info.get("email", ""),
            "phone": contact_info.get("phone", ""),
            "location": contact_info.get("location", ""),
            "education": education_list,
            "experience": experience,
            "skills": skills,
            "projects": projects_list,
            "certifications": certifications_list,
            "links": self._extract_links(text),
            "entities": entities,  # Include entities for dashboard
        }
        
        return parsed
    
    def _parse_education_section(self, text: str) -> list:
        """Parse education section with comprehensive extraction including location, GPA, and honors"""
        if not text:
            return []
        
        import re
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        education = []
        
        # Date patterns
        date_pattern = r'\b(20\d{2}|19\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s\-–—]*(20\d{2}|19\d{2}|Present|Current)?\b'
        month_year_pattern = r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b'
        grad_date_pattern = r'(?:Graduation\s+Date|Graduated|Grad\.?\s*Date)[:\s]*([A-Za-z]+\s+\d{4}|\d{4})'
        
        current_edu = None
        i = 0
        
        while i < len(lines):
            line = lines[i].strip()
            line_lower = line.lower()
            
            # Check if line contains education keywords
            has_edu_keywords = any(word in line_lower for word in [
                'bachelor', 'master', 'phd', 'degree', 'university', 'college', 
                'institute', 'school', 'bs', 'ba', 'ms', 'ma', 'mba', 'b.s.', 'b.a.', 'm.s.', 'm.a.'
            ])
            
            # Check if line looks like a school name (contains university/college/school)
            is_school_line = any(word in line_lower for word in ['university', 'college', 'institute', 'school']) and not line.startswith('-')
            
            if has_edu_keywords or (is_school_line and not current_edu):
                # Save previous education entry
                if current_edu:
                    education.append(current_edu)
                
                # Extract school name and location
                # Pattern: "University Name: School Name" or "University Name, Location"
                school = ""
                school_location = ""
                degree = ""
                grad_date = ""
                
                # Check for colon separator (e.g., "Virginia Tech: Pamplin School of Business")
                if ':' in line:
                    parts = line.split(':', 1)
                    school = parts[0].strip()
                    remaining = parts[1].strip() if len(parts) > 1 else ""
                else:
                    school = line
                    remaining = ""
                
                # Extract location from school line or next line
                # Pattern: "City, ST" or "City, ST ZIP"
                location_match = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})(?:\s+(\d{5}))?', school)
                if location_match:
                    school_location = f"{location_match.group(1)}, {location_match.group(2)}"
                    if location_match.group(3):
                        school_location += f" {location_match.group(3)}"
                    # Remove location from school name
                    school = re.sub(r',\s*[A-Z]{2}(?:\s+\d{5})?', '', school).strip()
                
                # Try to extract graduation date
                month_match = re.search(month_year_pattern, line, re.IGNORECASE)
                grad_date_match = re.search(grad_date_pattern, line, re.IGNORECASE)
                
                if month_match:
                    grad_date = f"{month_match.group(1)} {month_match.group(2)}"
                elif grad_date_match:
                    grad_date = grad_date_match.group(1).strip()
                
                # Extract degree from remaining text or next lines
                if remaining:
                    degree = remaining
                else:
                    # Look ahead for degree information
                    degree_parts = []
                    j = i + 1
                    while j < len(lines) and j < i + 5:  # Check next 5 lines
                        next_line = lines[j].strip()
                        # Stop if we hit another section or empty line
                        if not next_line or any(word in next_line.lower() for word in ['experience', 'skills', 'projects', 'certifications']):
                            break
                        # Check if it's a degree line
                        if any(word in next_line.lower() for word in ['bachelor', 'master', 'phd', 'degree', 'bs', 'ba', 'ms', 'ma']):
                            degree_parts.append(next_line)
                            j += 1
                            break
                        j += 1
                    if degree_parts:
                        degree = ' '.join(degree_parts)
                
                current_edu = {
                    "school": school.strip(),
                    "school_location": school_location.strip() if school_location else None,
                    "degree": degree.strip() if degree else "",
                    "grad_date": grad_date.strip() if grad_date else "",
                    "gpa": None,
                    "honors": []
                }
            elif current_edu:
                # Continuation line - extract additional info
                # Check for GPA (various formats)
                gpa_patterns = [
                    r'GPA[:\s]*([0-9.]+)',
                    r'Cumulative\s+GPA[:\s]*([0-9.]+)',
                    r'([0-9]\.[0-9]{1,2})\s*GPA',
                ]
                for pattern in gpa_patterns:
                    gpa_match = re.search(pattern, line, re.IGNORECASE)
                    if gpa_match:
                        try:
                            current_edu["gpa"] = float(gpa_match.group(1))
                            break
                        except:
                            pass
                
                # Check for graduation date if not found yet
                if not current_edu.get("grad_date"):
                    month_match = re.search(month_year_pattern, line, re.IGNORECASE)
                    if month_match:
                        current_edu["grad_date"] = f"{month_match.group(1)} {month_match.group(2)}"
                
                # Check for location if not found yet
                if not current_edu.get("school_location"):
                    location_match = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})(?:\s+(\d{5}))?', line)
                    if location_match:
                        school_location = f"{location_match.group(1)}, {location_match.group(2)}"
                        if location_match.group(3):
                            school_location += f" {location_match.group(3)}"
                        current_edu["school_location"] = school_location
                
                # Extract degree if not found yet
                if not current_edu.get("degree") or len(current_edu["degree"]) < 10:
                    if any(word in line_lower for word in ['bachelor', 'master', 'phd', 'degree', 'bs', 'ba', 'ms', 'ma']):
                        if not current_edu["degree"]:
                            current_edu["degree"] = line
                        else:
                            current_edu["degree"] += " " + line
                
                # Check for honors/awards (Dean's List, etc.)
                honors_keywords = ["dean's list", "dean list", "honor roll", "summa cum laude", 
                                 "magna cum laude", "cum laude", "honors", "scholarship"]
                if any(keyword in line_lower for keyword in honors_keywords):
                    # Extract the honor text
                    honor_text = line
                    # Try to extract dates/years mentioned
                    years = re.findall(r'\b(20\d{2}|19\d{2}|Fall|Spring|Summer|Winter)\s+\d{4}\b', line, re.IGNORECASE)
                    if years:
                        honor_text += f" ({', '.join(years)})"
                    current_edu["honors"].append(honor_text)
            
            i += 1
        
        # Save last education entry
        if current_edu:
            education.append(current_edu)
        
        return education[:5]  # Allow up to 5 entries
    
    def _parse_experience_section(self, text: str) -> list:
        """Parse experience section with improved date and company detection"""
        if not text:
            return []
        
        # Ensure text is a string, not a list or other type
        if not isinstance(text, str):
            return []
        
        experience = []
        lines = text.split('\n')
        
        # Enhanced date pattern (handles various formats)
        # Abbreviated months pattern
        month_abbrev_pattern = r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\b'
        # Full month names pattern
        month_year_pattern = r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b'
        # Date range pattern (handles "June 2024 - August 2024" or "Jun 2024 - Aug 2024")
        date_range_pattern = r'(\w+\s+\d{4})\s*[-–—]\s*(\w+\s+\d{4}|Present|Current)'
        # General date pattern
        date_pattern = r'\b(20\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s\-–—]*(20\d{2}|Present|Current)?\b'
        iso_date_pattern = r'\b(\d{4})[-/](\d{2})[\s\-–—]*(\d{4})?[-/]?(\d{2})?\b'
        
        # Job title keywords (expanded)
        job_keywords = ['engineer', 'developer', 'analyst', 'manager', 'intern', 'assistant', 
                      'specialist', 'coordinator', 'consultant', 'director', 'lead', 'senior',
                      'junior', 'associate', 'fellow', 'researcher', 'scientist', 'designer',
                      'architect', 'administrator', 'executive', 'officer', 'representative',
                      'technician', 'technologist', 'programmer', 'coder', 'student', 'trainee']
        
        current_exp = None
        i = 0
        
        while i < len(lines):
            line = lines[i].strip()
            if not line:
                i += 1
                continue
            
            # Check for date patterns
            has_date = (re.search(date_pattern, line, re.IGNORECASE) or 
                       re.search(month_year_pattern, line, re.IGNORECASE) or
                       re.search(month_abbrev_pattern, line, re.IGNORECASE) or
                       re.search(date_range_pattern, line, re.IGNORECASE) or
                       re.search(iso_date_pattern, line))
            
            # Check if line looks like a job title/company
            # Pattern 1: Company — Role or Role — Company
            has_dash_separator = re.search(r'[–—-]', line)
            # Pattern 2: Contains job keywords
            has_job_keyword = any(word in line.lower() for word in job_keywords)
            # Pattern 3: Location pattern (City, ST or City, ST ZIP)
            has_location = re.search(r'[A-Z][a-z]+,\s*[A-Z]{2}', line)
            
            # Determine if this is a new experience entry
            # Pattern: Company name on one line, location on next, then role and dates
            is_company_line = (
                not line.startswith('-') and 
                not line.startswith('•') and 
                not line.startswith('*') and
                len(line) > 3 and
                # Company names often have capital letters or are standalone
                (line[0].isupper() or has_location)
            )
            
            # Check if next line has location (common pattern: Company on line 1, Location on line 2)
            is_job_line = False
            if is_company_line:
                # Check if this looks like a company name (not a bullet, has some structure)
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    # If next line has location pattern, this is likely a company
                    next_has_location = re.search(r'[A-Z][a-z]+,\s*[A-Z]{2}', next_line)
                    if next_has_location:
                        is_job_line = True
                # Or if this line itself has location and looks like company
                if has_location and not has_job_keyword:
                    is_job_line = True
                # Or if it has date and job keyword
                if has_date and has_job_keyword:
                    is_job_line = True
                # Or if it has dash separator with job keyword
                if has_dash_separator and has_job_keyword:
                    is_job_line = True
            
            if is_job_line:
                # Save previous experience
                if current_exp and (current_exp.get("title") or current_exp.get("company")):
                    experience.append(current_exp)
                
                # Extract dates
                start_date = None
                end_date = None
                
                # Try ISO format first (2024-06 — 2024-08)
                iso_match = re.search(iso_date_pattern, line)
                if iso_match:
                    start_date = f"{iso_match.group(1)}-{iso_match.group(2)}"
                    if iso_match.group(3):
                        end_date = f"{iso_match.group(3)}-{iso_match.group(4) if iso_match.group(4) else '01'}"
                else:
                    # Try month year format
                    month_match = re.search(month_year_pattern, line, re.IGNORECASE)
                    if month_match:
                        month = month_match.group(1)
                        year = month_match.group(2)
                        start_date = f"{month} {year}"
                    else:
                        # Try standard date pattern
                        dates = re.findall(date_pattern, line, re.IGNORECASE)
                        if dates:
                            start_date = dates[0][0] if dates[0][0] else None
                            end_date = dates[0][1] if dates[0][1] else None
                
                # Extract title and company
                # Pattern in user's resume: Company name on line, Location on next line, then Role and dates
                title = ""
                company = ""
                location = None
                
                # Check next line for location
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    loc_match = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+\d{5})?)', next_line)
                    if loc_match and not any(word in next_line.lower() for word in job_keywords):
                        location = loc_match.group(1)
                        # This line is likely the company name
                        company = line.strip()
                        # Check line after location for role and dates
                        # Pattern: Company -> Location -> Title -> Dates (on separate lines)
                        if i + 2 < len(lines):
                            role_line = lines[i + 2].strip()
                            # Check if role line has job keywords (it's the title)
                            role_line_no_dates = re.sub(date_pattern + r'|' + month_year_pattern + r'|' + iso_date_pattern, '', role_line).strip()
                            if any(word in role_line_no_dates.lower() for word in job_keywords):
                                title = role_line_no_dates
                                # Check next line (i+3) for dates if not found on role line
                                if i + 3 < len(lines):
                                    date_line = lines[i + 3].strip()
                                    # Look for date range on date line
                                    date_range_match = re.search(r'(\w+\s+\d{4})\s*[-–—]\s*(\w+\s+\d{4}|Present|Current)', date_line, re.IGNORECASE)
                                    if date_range_match:
                                        start_date = date_range_match.group(1).strip()
                                        end_str = date_range_match.group(2).strip()
                                        if end_str.lower() in ["present", "current"]:
                                            end_date = "Present"
                                        else:
                                            end_date = end_str
                                        i += 3  # Skip location, role, and date lines
                                    else:
                                        # Try to extract dates from role line
                                        date_range_match = re.search(r'(\w+\s+\d{4})\s*[-–—]\s*(\w+\s+\d{4}|Present|Current)', role_line, re.IGNORECASE)
                                        if date_range_match:
                                            start_date = date_range_match.group(1).strip()
                                            end_str = date_range_match.group(2).strip()
                                            if end_str.lower() in ["present", "current"]:
                                                end_date = "Present"
                                            else:
                                                end_date = end_str
                                        i += 2  # Skip location and role lines
                                else:
                                    # No date line, try to extract from role line
                                    date_range_match = re.search(r'(\w+\s+\d{4})\s*[-–—]\s*(\w+\s+\d{4}|Present|Current)', role_line, re.IGNORECASE)
                                    if date_range_match:
                                        start_date = date_range_match.group(1).strip()
                                        end_str = date_range_match.group(2).strip()
                                        if end_str.lower() in ["present", "current"]:
                                            end_date = "Present"
                                        else:
                                            end_date = end_str
                                    i += 2  # Skip location and role lines
                            else:
                                # Role line doesn't have job keywords, might be dates or something else
                                # Check if it's a date line instead
                                date_range_match = re.search(r'(\w+\s+\d{4})\s*[-–—]\s*(\w+\s+\d{4}|Present|Current)', role_line, re.IGNORECASE)
                                if date_range_match:
                                    # This is a date line, title might be missing or on a different line
                                    start_date = date_range_match.group(1).strip()
                                    end_str = date_range_match.group(2).strip()
                                    if end_str.lower() in ["present", "current"]:
                                        end_date = "Present"
                                    else:
                                        end_date = end_str
                                i += 1  # Skip location line only
                        else:
                            i += 1  # Skip location line
                    else:
                        # No location on next line, try to parse from current line
                        # Pattern 1: Company — Role
                        if ' — ' in line or ' – ' in line:
                            line_no_dates = re.sub(date_pattern + r'|' + month_year_pattern + r'|' + iso_date_pattern, '', line).strip()
                            parts = re.split(r'\s+[–—]\s+', line_no_dates)
                            if len(parts) >= 2:
                                if any(word in parts[0].lower() for word in job_keywords):
                                    title = parts[0].strip()
                                    company = parts[1].strip()
                                else:
                                    company = parts[0].strip()
                                    title = parts[1].strip()
                        # Pattern 2: Title | Company | Location
                        elif ' | ' in line:
                            parts = [p.strip() for p in line.split('|')]
                            if len(parts) >= 2:
                                title = parts[0]
                                company = parts[1]
                                if len(parts) >= 3:
                                    location = parts[2]
                        # Pattern 3: Title at Company
                        elif ' at ' in line.lower():
                            parts = re.split(r'\s+at\s+', line, flags=re.IGNORECASE)
                            if len(parts) == 2:
                                title = parts[0].strip()
                                company = parts[1].strip()
                        else:
                            # Single line - try to infer
                            line_no_dates = re.sub(date_pattern + r'|' + month_year_pattern + r'|' + iso_date_pattern, '', line).strip()
                            # If it has location pattern, extract it
                            loc_match = re.search(r'([A-Z][a-z]+,\s*[A-Z]{2}(?:\s+\d{5})?)', line_no_dates)
                            if loc_match:
                                location = loc_match.group(1)
                                line_no_dates = line_no_dates.replace(location, '').strip()
                            
                            # If remaining line has job keyword, it's likely the title
                            if any(word in line_no_dates.lower() for word in job_keywords):
                                title = line_no_dates
                            else:
                                company = line_no_dates
                else:
                    # Last line or no next line - try to parse from current line
                    line_no_dates = re.sub(date_pattern + r'|' + month_year_pattern + r'|' + iso_date_pattern, '', line).strip()
                    if any(word in line_no_dates.lower() for word in job_keywords):
                        title = line_no_dates
                    else:
                        company = line_no_dates
                
                # Clean up title and company (remove dates, extra spaces)
                title = re.sub(date_pattern + r'|' + month_year_pattern + r'|' + iso_date_pattern, '', title).strip()
                company = re.sub(date_pattern + r'|' + month_year_pattern + r'|' + iso_date_pattern, '', company).strip()
                
                # If we still don't have title, check if next non-empty line has it
                if not title and i < len(lines):
                    j = i
                    while j < len(lines) and j < i + 3:
                        check_line = lines[j].strip()
                        if check_line and not check_line.startswith('-') and not check_line.startswith('•'):
                            if any(word in check_line.lower() for word in job_keywords):
                                # Extract title from this line
                                check_line_no_dates = re.sub(date_pattern + r'|' + month_year_pattern + r'|' + iso_date_pattern, '', check_line).strip()
                                if check_line_no_dates:
                                    title = check_line_no_dates
                                    # Extract dates if found
                                    if not start_date:
                                        month_match = re.search(month_year_pattern, check_line, re.IGNORECASE)
                                        if month_match:
                                            start_date = f"{month_match.group(1)} {month_match.group(2)}"
                                    # Look for date range
                                    date_range_match = re.search(date_range_pattern, check_line, re.IGNORECASE)
                                    if date_range_match:
                                        start_date = date_range_match.group(1).strip()
                                        end_str = date_range_match.group(2).strip()
                                        if end_str.lower() in ["present", "current"]:
                                            end_date = "Present"
                                        else:
                                            end_date = end_str
                                break
                        j += 1
                
                current_exp = {
                    "title": title,
                    "company": company,
                    "location": location,
                    "start": start_date,
                    "end": end_date,
                    "bullets": []
                }
            elif current_exp:
                # Check if this is a bullet point
                if line.startswith('-') or line.startswith('•') or line.startswith('*'):
                    bullet = line.lstrip('- •*').strip()
                    if bullet:
                        current_exp["bullets"].append(bullet)
                # Check if line starts with spaces (indented bullet)
                elif line.startswith(' ') and len(line.strip()) > 0:
                    bullet = line.strip()
                    if bullet and not re.search(date_pattern, bullet, re.IGNORECASE):
                        current_exp["bullets"].append(bullet)
                # Continuation of previous content
                elif line and not has_date and len(line) > 10:
                    if current_exp["bullets"]:
                        # Append to last bullet if it's short
                        if len(current_exp["bullets"][-1]) < 200:
                            current_exp["bullets"][-1] += " " + line
                        else:
                            # New bullet
                            current_exp["bullets"].append(line)
                    else:
                        current_exp["bullets"].append(line)
            
            i += 1
        
        # Save last experience
        if current_exp and (current_exp.get("title") or current_exp.get("company")):
            experience.append(current_exp)
        
        # Ensure we always return a list
        if not isinstance(experience, list):
            return []
        
        return experience
    
    def _parse_projects_section(self, text: str) -> list:
        """Parse projects section with comprehensive extraction including roles, locations, dates, and tech stack"""
        if not text:
            return []
        
        import re
        projects = []
        lines = text.split('\n')
        
        # Date patterns
        date_pattern = r'\b(20\d{2}|19\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s\-–—]*(20\d{2}|19\d{2}|Present|Current)?\b'
        month_year_pattern = r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b'
        
        current_project = None
        i = 0
        
        while i < len(lines):
            line = lines[i].strip()
            if not line:
                i += 1
                continue
            
            # Check if line looks like a project title/header
            # Pattern: Project name, possibly with location and date
            is_project_header = (
                not line.startswith('-') and 
                not line.startswith('•') and 
                not line.startswith('*') and
                len(line) > 3 and
                len(line) < 100 and
                # Not a section header
                not any(word in line.lower() for word in ['experience', 'education', 'skills', 'certifications'])
            )
            
            # Check if it has location pattern (City, ST) or date
            has_location = re.search(r'[A-Z][a-z]+,\s*[A-Z]{2}', line)
            has_date = re.search(date_pattern, line, re.IGNORECASE) or re.search(month_year_pattern, line, re.IGNORECASE)
            
            if is_project_header and (has_location or has_date or i == 0 or not current_project):
                # Save previous project
                if current_project:
                    projects.append(current_project)
                
                # Extract project title, location, date, and role
                title = line
                location = None
                project_date = None
                role = None
                
                # Extract location
                loc_match = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*[A-Z]{2}(?:\s+\d{5})?', line)
                if loc_match:
                    location = loc_match.group(0)
                    title = title.replace(location, '').strip()
                
                # Extract date
                month_match = re.search(month_year_pattern, line, re.IGNORECASE)
                date_match = re.search(date_pattern, line, re.IGNORECASE)
                if month_match:
                    project_date = f"{month_match.group(1)} {month_match.group(2)}"
                    title = re.sub(month_year_pattern, '', title, flags=re.IGNORECASE).strip()
                elif date_match:
                    project_date = date_match.group(0)
                    title = re.sub(date_pattern, '', title, flags=re.IGNORECASE).strip()
                
                # Extract role (e.g., "Developer & Product Manager")
                role_keywords = ['developer', 'manager', 'analyst', 'designer', 'engineer', 'lead', 'coordinator']
                if any(keyword in line.lower() for keyword in role_keywords):
                    # Look for role patterns like "Developer & Product Manager" or "Developer | Manager"
                    role_match = re.search(r'([A-Z][a-zA-Z\s&|]+(?:Developer|Manager|Analyst|Designer|Engineer|Lead|Coordinator))', line, re.IGNORECASE)
                    if role_match:
                        role = role_match.group(1).strip()
                        title = title.replace(role, '').strip()
                
                # Clean up title (remove extra separators)
                title = re.sub(r'^[–—\-|]\s*|\s*[–—\-|]\s*$', '', title).strip()
                
                current_project = {
                    "title": title,
                    "role": role,
                    "location": location,
                    "date": project_date,
                    "tech": [],
                    "desc": ""
                }
            elif current_project:
                # Continuation line - extract description and tech stack
                if line.startswith('-') or line.startswith('•') or line.startswith('*'):
                    bullet = line.lstrip('- •*').strip()
                    if bullet:
                        # Extract tech stack from bullet
                        tech_keywords = ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 
                                       'Git', 'Flask', 'MySQL', 'Tableau', 'Excel', 'VBA', 'Salesforce',
                                       'HTML', 'CSS', 'TypeScript', 'Java', 'C#', 'PostgreSQL', 'MongoDB']
                        found_tech = [kw for kw in tech_keywords if kw.lower() in bullet.lower()]
                        if found_tech:
                            current_project["tech"].extend(found_tech)
                        current_project["desc"] += bullet + " "
                else:
                    # Check if it's a role line
                    if not current_project.get("role") and any(word in line.lower() for word in ['developer', 'manager', 'analyst']):
                        current_project["role"] = line
                    # Otherwise, continuation of description
                    elif len(line) > 10:
                        current_project["desc"] += line + " "
            
            i += 1
        
        if current_project:
            projects.append(current_project)
        
        # Clean up descriptions and tech
        for proj in projects:
            proj["desc"] = proj["desc"].strip()
            # Remove duplicates from tech
            proj["tech"] = list(set(proj["tech"]))
            # Remove None values
            if not proj.get("role"):
                proj.pop("role", None)
            if not proj.get("location"):
                proj.pop("location", None)
            if not proj.get("date"):
                proj.pop("date", None)
        
        return projects[:15]  # Allow up to 15 projects
    
    def _parse_list_section(self, text: str) -> list:
        """Parse list section (certifications, etc.) with support for multiple items per line"""
        if not text:
            return []
        
        items = []
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        
        for line in lines:
            # Remove bullet points
            line = line.lstrip('- •*').strip()
            
            # Check if line contains multiple certifications separated by commas or parentheses
            # Pattern: "Cert1 (Issuer, Year), Cert2 (Issuer, Year)"
            # Or: "Cert1, Cert2, Cert3"
            
            # Try to split by common separators
            # First, try splitting by comma (but be careful with dates in parentheses)
            # Look for patterns like "Certification (Issuer, Year)"
            cert_pattern = r'([^,\(]+(?:\([^)]+\))?)'
            matches = re.findall(cert_pattern, line)
            
            if len(matches) > 1:
                # Multiple certifications in one line
                for match in matches:
                    cert = match.strip()
                    if cert and len(cert) > 3:
                        items.append(cert)
            else:
                # Single certification or complex format
                # Try splitting by common separators
                parts = re.split(r',\s*(?![^()]*\))', line)  # Split by comma, but not inside parentheses
                for part in parts:
                    part = part.strip()
                    if part and len(part) > 3:
                        # Check if it's a valid certification (not just a separator word)
                        if not any(word in part.lower() for word in ['and', 'or', '&']):
                            items.append(part)
        
        # Clean up items
        cleaned_items = []
        for item in items:
            item = item.strip()
            # Remove trailing commas/periods
            item = re.sub(r'[,\.]+$', '', item)
            if item and len(item) > 3:
                cleaned_items.append(item)
        
        return cleaned_items
    
    def _extract_links(self, text: str) -> Dict[str, Optional[str]]:
        """Extract LinkedIn, GitHub, portfolio links"""
        import re
        
        links = {
            "linkedin": None,
            "github": None,
            "portfolio": None
        }
        
        # LinkedIn
        linkedin_match = re.search(r'linkedin\.com/in/[\w-]+', text, re.IGNORECASE)
        if linkedin_match:
            links["linkedin"] = f"https://www.{linkedin_match.group(0)}"
        
        # GitHub
        github_match = re.search(r'github\.com/[\w-]+', text, re.IGNORECASE)
        if github_match:
            links["github"] = f"https://{github_match.group(0)}"
        
        # Portfolio (various patterns)
        portfolio_patterns = [
            r'https?://[\w.-]+\.(netlify|vercel|github\.io|portfolio)[\w./-]*',
            r'[\w.-]+\.(netlify|vercel)\.app[/\w-]*',
        ]
        for pattern in portfolio_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                links["portfolio"] = match.group(0) if match.group(0).startswith('http') else f"https://{match.group(0)}"
                break
        
        return links

