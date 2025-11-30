"""
Resume scoring heuristics
"""
from typing import Dict, Any, List
from datetime import datetime
import re

class ResumeScorer:
    """Calculate resume score based on heuristics"""
    
    def __init__(self):
        pass
    
    def calculate_score(self, parsed_data: Dict[str, Any]) -> int:
        """
        Calculate resume score (0-100)
        
        Scoring breakdown:
        - Base: 25 pts (contact + education presence)
        - Skills: +5 pts per relevant skill (max 20 pts)
        - Projects: +10 pts for at least one project
        - Experience: +10 pts for recent experience with >3 bullets
        - Quality: +30 pts (LLM confidence + filler quality)
        
        Args:
            parsed_data: Parsed resume JSON
            
        Returns:
            Score from 0-100
        """
        score = 0
        
        # Base score: contact info + education (25 pts)
        has_contact = bool(
            parsed_data.get("email") or
            parsed_data.get("phone") or
            parsed_data.get("location")
        )
        has_education = bool(parsed_data.get("education"))
        
        if has_contact:
            score += 15
        if has_education:
            score += 10
        
        # Skills score (max 20 pts)
        skills = parsed_data.get("skills", [])
        if skills:
            # +5 pts per skill, max 4 skills = 20 pts
            skill_count = min(len(skills), 4)
            score += skill_count * 5
        
        # Projects score (10 pts)
        projects = parsed_data.get("projects", [])
        if projects:
            score += 10
        
        # Experience score (10 pts)
        experience = parsed_data.get("experience", [])
        if experience:
            # Check for recent experience (last 3 years) with substantial content
            recent_exp = self._has_recent_experience(experience)
            if recent_exp:
                score += 10
        
        # Quality score (30 pts) - based on content richness
        quality_score = self._calculate_quality_score(parsed_data)
        score += quality_score
        
        return min(score, 100)
    
    def _has_recent_experience(self, experience: List[Dict[str, Any]]) -> bool:
        """Check if there's recent experience (within last 3 years) with good content"""
        current_year = datetime.now().year
        
        for exp in experience:
            # Safely get dates, ensuring they're strings
            # Handle multiple possible field names from different pipelines
            end_date = (
                exp.get("end") or 
                exp.get("endDate") or 
                exp.get("end_date") or 
                exp.get("endDate") or
                ""
            )
            start_date = (
                exp.get("start") or 
                exp.get("startDate") or 
                exp.get("start_date") or
                exp.get("startDate") or
                ""
            )
            # Get bullets - ensure it's always a list
            bullets_raw = exp.get("bullets") or exp.get("description") or []
            if not isinstance(bullets_raw, list):
                bullets = [bullets_raw] if bullets_raw else []
            else:
                bullets = bullets_raw
            
            # Convert dates to string if not already, handle None values
            if end_date is not None and end_date != "":
                end_date = str(end_date)
            else:
                end_date = ""
            
            if start_date is not None and start_date != "":
                start_date = str(start_date)
            else:
                start_date = ""
            
            # Check if end date is recent or "Present"
            if end_date and isinstance(end_date, str):
                end_lower = end_date.lower()
                if "present" in end_lower or "current" in end_lower or end_lower == "now":
                    if len(bullets) >= 3:
                        return True
            
            # Try to extract year from date (use end_date first, then start_date)
            date_to_search = end_date if end_date else start_date
            if date_to_search and isinstance(date_to_search, str):
                year_match = re.search(r'20\d{2}', date_to_search)
                if year_match:
                    try:
                        year = int(year_match.group(0))
                        if current_year - year <= 3 and len(bullets) >= 3:
                            return True
                    except (ValueError, AttributeError):
                        pass
        
        return False
    
    def _calculate_quality_score(self, parsed_data: Dict[str, Any]) -> int:
        """
        Calculate quality score based on content richness
        
        Returns:
            Score from 0-30
        """
        score = 0
        
        # Education detail (5 pts)
        education = parsed_data.get("education", [])
        if education:
            for edu in education:
                if edu.get("degree") and edu.get("school"):
                    score += 5
                    break
        
        # Experience detail (10 pts)
        experience = parsed_data.get("experience", [])
        total_bullets = sum(len(exp.get("bullets", [])) for exp in experience)
        if total_bullets >= 5:
            score += 10
        elif total_bullets >= 3:
            score += 5
        
        # Skills variety (5 pts)
        skills = parsed_data.get("skills", [])
        if len(skills) >= 5:
            score += 5
        
        # Projects detail (5 pts)
        projects = parsed_data.get("projects", [])
        if projects:
            for proj in projects:
                if proj.get("desc") and proj.get("tech"):
                    score += 5
                    break
        
        # Certifications (5 pts)
        certifications = parsed_data.get("certifications", [])
        if certifications:
            score += 5
        
        return min(score, 30)

