"""
Normalization rules for resume data:
- Name: Prefer first line with 2-3 capitalized words
- Phone: Extract and format consistently
- Dates: Normalize to YYYY-MM when possible
- Skills: Dedupe, map synonyms (JS → JavaScript)
- Experiences: Validate company + role + 1 bullet minimum
"""
import re
from typing import Dict, Any, List, Optional


class ResumeNormalizer:
    """
    Normalizes parsed resume data with validation and confidence scoring
    """
    
    def __init__(self):
        # Skill synonym mapping
        self.skill_synonyms = {
            'js': 'JavaScript',
            'javascript': 'JavaScript',
            'ts': 'TypeScript',
            'typescript': 'TypeScript',
            'react.js': 'React',
            'reactjs': 'React',
            'node.js': 'Node.js',
            'nodejs': 'Node.js',
            'html5': 'HTML',
            'css3': 'CSS',
            'aws': 'AWS',
            'gcp': 'GCP',
            'azure': 'Azure',
            'ml': 'Machine Learning',
            'ai': 'Artificial Intelligence',
            'nlp': 'Natural Language Processing',
            'cv': 'Computer Vision',
        }
    
    def normalize_name(self, name: str, entities: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Normalize name with confidence scoring
        
        Rules:
        - Prefer first line if it contains 2-3 capitalized words
        - Use NER PERSON if available
        - Fallback: first token line that is not a job title or company
        
        Returns:
            {'firstName': str, 'lastName': str, 'confidence': int}
        """
        if not name:
            return {'firstName': '', 'lastName': '', 'confidence': 0}
        
        name = name.strip()
        
        # Try NER entities first
        if entities and entities.get('persons'):
            for person in entities['persons']:
                # Filter false positives
                if not re.search(r'\.(js|py|ts|java|cpp|html|css|sql)$', person, re.IGNORECASE):
                    if not (person.isupper() and len(person) <= 5):
                        if not re.search(r'\d', person):
                            name = person
                            break
        
        # Split into parts
        parts = name.split()
        
        # Filter out common false positives
        job_titles = ['engineer', 'developer', 'analyst', 'manager', 'intern', 
                     'assistant', 'specialist', 'coordinator', 'consultant']
        parts = [p for p in parts if p.lower() not in job_titles]
        
        if len(parts) == 0:
            return {'firstName': '', 'lastName': '', 'confidence': 0}
        
        # Extract first and last name
        if len(parts) == 1:
            firstName = parts[0]
            lastName = ''
            confidence = 50
        elif len(parts) == 2:
            firstName = parts[0]
            lastName = parts[1]
            confidence = 85
        elif len(parts) >= 3:
            firstName = parts[0]
            lastName = ' '.join(parts[1:3])  # Take first 2 for last name
            confidence = 80
        else:
            firstName = parts[0] if parts else ''
            lastName = ''
            confidence = 40
        
        # Validate: names should start with capital
        if firstName and not firstName[0].isupper():
            confidence = max(0, confidence - 20)
        if lastName and not lastName[0].isupper():
            confidence = max(0, confidence - 10)
        
        return {
            'firstName': firstName,
            'lastName': lastName,
            'confidence': confidence
        }
    
    def normalize_phone(self, phone: str) -> Dict[str, Any]:
        """
        Normalize phone number with ZIP code removal
        
        Pattern: +?1?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}
        If ZIP adjacent, remove ZIP
        
        Returns:
            {'phone': str, 'confidence': int}
        """
        if not phone:
            return {'phone': '', 'confidence': 0}
        
        # Remove ZIP code if adjacent (5 digits before phone)
        phone_clean = phone.strip()
        
        # Pattern: 5 digits followed by phone
        zip_phone_pattern = r'\b(\d{5})\s+(\d{3})[-.\s]*(\d{3})[-.\s]*(\d{4})\b'
        zip_match = re.search(zip_phone_pattern, phone_clean)
        
        if zip_match:
            # Extract phone only
            area_code = zip_match.group(2)
            exchange = zip_match.group(3)
            number = zip_match.group(4)
            phone_clean = f"+1 ({area_code}) {exchange}-{number}"
            confidence = 90
        else:
            # Standard phone pattern
            phone_pattern = r'\+?1?[\s-]?\(?(\d{3})\)?[\s-]?(\d{3})[\s-]?(\d{4})'
            match = re.search(phone_pattern, phone_clean)
            if match:
                area_code = match.group(1)
                exchange = match.group(2)
                number = match.group(3)
                phone_clean = f"+1 ({area_code}) {exchange}-{number}"
                confidence = 85
            else:
                confidence = 30
        
        return {'phone': phone_clean, 'confidence': confidence}
    
    def normalize_date(self, date_str: str) -> Dict[str, Any]:
        """
        Normalize date to YYYY-MM format when possible
        
        Returns:
            {'date': str, 'confidence': int}
        """
        if not date_str:
            return {'date': '', 'confidence': 0}
        
        date_str = date_str.strip()
        
        # ISO format already (YYYY-MM)
        iso_pattern = r'^(\d{4})-(\d{2})$'
        if re.match(iso_pattern, date_str):
            return {'date': date_str, 'confidence': 100}
        
        # Month Year format (January 2024, Jan 2024)
        month_year_pattern = r'(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})'
        match = re.search(month_year_pattern, date_str, re.IGNORECASE)
        if match:
            month_name = match.group(1)
            year = match.group(2)
            
            month_map = {
                'january': '01', 'jan': '01',
                'february': '02', 'feb': '02',
                'march': '03', 'mar': '03',
                'april': '04', 'apr': '04',
                'may': '05',
                'june': '06', 'jun': '06',
                'july': '07', 'jul': '07',
                'august': '08', 'aug': '08',
                'september': '09', 'sep': '09',
                'october': '10', 'oct': '10',
                'november': '11', 'nov': '11',
                'december': '12', 'dec': '12',
            }
            
            month_num = month_map.get(month_name.lower(), '01')
            normalized = f"{year}-{month_num}"
            return {'date': normalized, 'confidence': 90}
        
        # Year only (2024)
        year_pattern = r'^(\d{4})$'
        if re.match(year_pattern, date_str):
            return {'date': f"{date_str}-01", 'confidence': 70}
        
        # Keep original if can't normalize
        return {'date': date_str, 'confidence': 50}
    
    def normalize_skills(self, skills: List[str]) -> Dict[str, Any]:
        """
        Dedupe skills and map synonyms
        
        Returns:
            {'skills': List[str], 'confidence': int}
        """
        if not skills:
            return {'skills': [], 'confidence': 0}
        
        normalized = set()
        
        for skill in skills:
            if not skill:
                continue
            
            skill_lower = skill.lower().strip()
            
            # Check synonym mapping
            if skill_lower in self.skill_synonyms:
                normalized.add(self.skill_synonyms[skill_lower])
            else:
                # Title case for consistency
                normalized.add(skill.strip().title())
        
        skill_list = sorted(list(normalized))
        
        # Confidence based on number of skills
        if len(skill_list) >= 5:
            confidence = 90
        elif len(skill_list) >= 3:
            confidence = 75
        elif len(skill_list) >= 1:
            confidence = 60
        else:
            confidence = 0
        
        return {'skills': skill_list, 'confidence': confidence}
    
    def validate_experience(self, experience: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Validate experience entries:
        - Must have company + role
        - Must have at least 1 bullet OR be considered low confidence
        
        Returns:
            {'experience': List[Dict], 'confidence': int}
        """
        if not experience:
            return {'experience': [], 'confidence': 0}
        
        validated = []
        confidences = []
        
        for exp in experience:
            company = exp.get('company', '').strip()
            role = exp.get('title', '').strip() or exp.get('role', '').strip()
            bullets = exp.get('bullets', [])
            
            # Check if has required fields
            has_company = bool(company)
            has_role = bool(role)
            has_bullets = len(bullets) > 0
            
            # Calculate confidence
            if has_company and has_role and has_bullets:
                confidence = 90
            elif has_company and has_role:
                confidence = 60  # Missing bullets
            elif has_company or has_role:
                confidence = 40  # Missing one required field
            else:
                confidence = 10  # Missing both
            
            # Only include if has at least company or role
            if has_company or has_role:
                exp['extractionConfidence'] = confidence
                validated.append(exp)
                confidences.append(confidence)
        
        # Overall confidence is average of individual confidences
        overall_confidence = int(sum(confidences) / len(confidences)) if confidences else 0
        
        return {
            'experience': validated,
            'confidence': overall_confidence
        }
    
    def normalize_resume(self, parsed_data: Dict[str, Any], entities: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Complete normalization pipeline with confidence scoring
        
        Returns:
            Normalized resume data with extractionConfidence fields
        """
        normalized = {}
        confidences = {}
        
        # Normalize name
        name_data = self.normalize_name(parsed_data.get('name', ''), entities)
        normalized['firstName'] = name_data['firstName']
        normalized['lastName'] = name_data['lastName']
        confidences['name'] = name_data['confidence']
        
        # Normalize phone
        phone_data = self.normalize_phone(parsed_data.get('phone', ''))
        normalized['phone'] = phone_data['phone']
        confidences['phone'] = phone_data['confidence']
        
        # Email (no normalization needed, but check confidence)
        email = parsed_data.get('email', '').strip()
        normalized['email'] = email
        confidences['email'] = 90 if '@' in email else 0
        
        # Location (no normalization, but check confidence)
        location = parsed_data.get('location', '').strip()
        normalized['location'] = location
        confidences['location'] = 70 if location else 0
        
        # Normalize skills
        skills_data = self.normalize_skills(parsed_data.get('skills', []))
        normalized['skills'] = skills_data['skills']
        confidences['skills'] = skills_data['confidence']
        
        # Normalize experience dates and validate
        experience = parsed_data.get('experience', [])
        for exp in experience:
            # Normalize start date
            if exp.get('start'):
                start_data = self.normalize_date(exp['start'])
                exp['startDate'] = start_data['date']
                exp['startConfidence'] = start_data['confidence']
            
            # Normalize end date
            if exp.get('end'):
                end_data = self.normalize_date(exp['end'])
                exp['endDate'] = end_data['date']
                exp['endConfidence'] = end_data['confidence']
        
        # Validate experience
        exp_data = self.validate_experience(experience)
        normalized['experience'] = exp_data['experience']
        confidences['experience'] = exp_data['confidence']
        
        # Education (normalize dates and preserve all fields)
        education = parsed_data.get('education', [])
        for edu in education:
            if edu.get('grad_date'):
                grad_data = self.normalize_date(edu['grad_date'])
                edu['gradDate'] = grad_data['date']
                edu['gradConfidence'] = grad_data['confidence']
            # Preserve school_location if present
            if edu.get('school_location'):
                edu['school_location'] = edu['school_location']
            # Preserve honors/awards if present
            if edu.get('honors'):
                edu['honors'] = edu['honors']
            # Preserve GPA if present
            if edu.get('gpa') is not None:
                edu['gpa'] = edu['gpa']
        normalized['education'] = education
        confidences['education'] = 80 if education else 0
        
        # Other fields (projects, certifications, links)
        normalized['projects'] = parsed_data.get('projects', [])
        normalized['certifications'] = parsed_data.get('certifications', [])
        normalized['links'] = parsed_data.get('links', {})
        
        # Calculate overall extraction confidence
        if confidences:
            # Weighted average (name and experience are most important)
            weights = {
                'name': 0.3,
                'experience': 0.3,
                'skills': 0.2,
                'email': 0.1,
                'phone': 0.05,
                'location': 0.05,
            }
            
            weighted_sum = sum(confidences.get(k, 0) * weights.get(k, 0.1) for k in weights.keys())
            overall_confidence = int(weighted_sum)
        else:
            overall_confidence = 0
        
        # Add metadata
        normalized['meta'] = {
            'extractionConfidence': overall_confidence,
            'fieldConfidences': confidences,
            'resumeScore': 0  # Will be calculated by scorer
        }
        
        return normalized

