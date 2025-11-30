"""
Dashboard endpoints with gating logic
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime
import re
from typing import Dict, Any, Optional
from app.core.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.project import Project
from app.api.v1.auth import get_current_user, get_current_user_optional
from app.core.utils import generate_id

router = APIRouter()


def _calculate_experience_years(experience: list) -> float:
    """Calculate total years of experience from experience entries"""
    if not experience:
        return 0.0
    
    total_months = 0
    current_date = datetime.now()
    
    for exp in experience:
        start_date = exp.get("start") or exp.get("startDate", "")
        end_date = exp.get("end") or exp.get("endDate", "Present")
        
        # Extract year from start date
        start_year = None
        start_month = 1
        if start_date:
            # Try ISO format (YYYY-MM)
            iso_match = re.match(r'^(\d{4})-(\d{2})$', str(start_date))
            if iso_match:
                start_year = int(iso_match.group(1))
                start_month = int(iso_match.group(2))
            else:
                # Try year extraction
                year_match = re.search(r'\b(19|20)\d{2}\b', str(start_date))
                if year_match:
                    start_year = int(year_match.group(0))
                    # Try to extract month (handles both full and abbreviated names)
                    month_match = re.search(r'(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)', str(start_date), re.IGNORECASE)
                    if month_match:
                        month_map = {
                            'january': 1, 'jan': 1, 'february': 2, 'feb': 2, 'march': 3, 'mar': 3,
                            'april': 4, 'apr': 4, 'may': 5, 'june': 6, 'jun': 6,
                            'july': 7, 'jul': 7, 'august': 8, 'aug': 8, 'september': 9, 'sep': 9,
                            'october': 10, 'oct': 10, 'november': 11, 'nov': 11, 'december': 12, 'dec': 12
                        }
                        month_str = month_match.group(0).lower()
                        start_month = month_map.get(month_str, month_map.get(month_str[:3], 1))
        
        # Extract year from end date
        end_year = current_date.year
        end_month = current_date.month
        if end_date and str(end_date).lower() not in ["present", "current", ""]:
            # Try ISO format
            iso_match = re.match(r'^(\d{4})-(\d{2})$', str(end_date))
            if iso_match:
                end_year = int(iso_match.group(1))
                end_month = int(iso_match.group(2))
            else:
                # Try year extraction
                year_match = re.search(r'\b(19|20)\d{2}\b', str(end_date))
                if year_match:
                    end_year = int(year_match.group(0))
                    month_match = re.search(r'(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)', str(end_date), re.IGNORECASE)
                    if month_match:
                        month_map = {
                            'january': 1, 'jan': 1, 'february': 2, 'feb': 2, 'march': 3, 'mar': 3,
                            'april': 4, 'apr': 4, 'may': 5, 'june': 6, 'jun': 6,
                            'july': 7, 'jul': 7, 'august': 8, 'aug': 8, 'september': 9, 'sep': 9,
                            'october': 10, 'oct': 10, 'november': 11, 'nov': 11, 'december': 12, 'dec': 12
                        }
                        month_str = month_match.group(0).lower()
                        end_month = month_map.get(month_str, month_map.get(month_str[:3], 1))
        
        # Calculate months for this experience
        if start_year:
            start_dt = datetime(start_year, start_month, 1)
            end_dt = datetime(end_year, end_month, 1)
            months = (end_dt.year - start_dt.year) * 12 + (end_dt.month - start_dt.month)
            total_months += max(0, months)
    
    return round(total_months / 12.0, 1)


def _get_education_level(education: list) -> str:
    """Determine highest education level"""
    if not education:
        return ""
    
    level_map = {
        "phd": 5, "doctorate": 5, "ph.d": 5,
        "master": 4, "mba": 4, "ms": 4, "ma": 4, "m.s": 4, "m.a": 4,
        "bachelor": 3, "bs": 3, "ba": 3, "b.s": 3, "b.a": 3,
        "associate": 2, "aa": 2, "as": 2,
        "high school": 1, "diploma": 1
    }
    
    highest_level = 0
    highest_name = ""
    
    for edu in education:
        degree = str(edu.get("degree", "")).lower()
        for key, level in level_map.items():
            if key in degree and level > highest_level:
                highest_level = level
                highest_name = edu.get("degree", "")
    
    if highest_level >= 5:
        return "Doctorate"
    elif highest_level >= 4:
        return "Master's"
    elif highest_level >= 3:
        return "Bachelor's"
    elif highest_level >= 2:
        return "Associate's"
    elif highest_level >= 1:
        return "High School"
    
    return education[0].get("degree", "") if education else ""


def _generate_ai_insights(
    experience: list,
    education: list,
    skills: list,
    projects: list,
    experience_years: float,
    resume_score: int
) -> Dict[str, Any]:
    """Generate AI-powered insights and recommendations - matches frontend interface"""
    # Identify skill gaps (common tech skills not present)
    skill_lower = [s.lower() if isinstance(s, str) else str(s).lower() for s in skills]
    skill_gaps_list = []
    
    cloud_skills = ["aws", "azure", "gcp", "cloud"]
    if not any(cloud in " ".join(skill_lower) for cloud in cloud_skills):
        skill_gaps_list.append({
            "skill": "Cloud platforms (AWS/Azure/GCP)",
            "current_percent": 0,
            "required_percent": 80
        })
    
    devops_skills = ["docker", "kubernetes", "ci/cd", "terraform", "jenkins"]
    if not any(devops in " ".join(skill_lower) for devops in devops_skills):
        skill_gaps_list.append({
            "skill": "DevOps tools (Docker, Kubernetes, CI/CD)",
            "current_percent": 0,
            "required_percent": 70
        })
    
    data_skills = ["pandas", "numpy", "scikit-learn", "tensorflow", "pytorch"]
    if not any(data in " ".join(skill_lower) for data in data_skills):
        if any("python" in s for s in skill_lower):
            skill_gaps_list.append({
                "skill": "Data science libraries (Pandas, NumPy, Scikit-learn)",
                "current_percent": 0,
                "required_percent": 75
            })
    
    # Generate project suggestions based on skill gaps
    project_suggestions = []
    if skill_gaps_list:
        for gap in skill_gaps_list[:2]:  # Limit to 2 suggestions
            if "Cloud" in gap["skill"]:
                project_suggestions.append({
                    "title": "Cloud Infrastructure Project",
                    "description": "Build a scalable application using AWS/Azure/GCP to demonstrate cloud architecture skills.",
                    "skills": ["AWS", "Docker", "Kubernetes", "Terraform"]
                })
            elif "DevOps" in gap["skill"]:
                project_suggestions.append({
                    "title": "CI/CD Pipeline Project",
                    "description": "Create an automated deployment pipeline using Docker, Kubernetes, and CI/CD tools.",
                    "skills": ["Docker", "Kubernetes", "GitHub Actions", "Terraform"]
                })
    
    # Calculate ATS readiness score
    ats_score = 0
    if experience and all(exp.get("title") for exp in experience):
        ats_score += 25
    if experience and all(exp.get("start") and exp.get("end") for exp in experience):
        ats_score += 25
    if len(skills) >= 10:
        ats_score += 25
    if education:
        ats_score += 25
    
    # Build job match stats
    job_match_stats = {
        "ats_readiness": "B",
        "completeness_score": resume_score,
        "experience_years": experience_years,
        "skills_count": len(skills),
        "missing_sections": []
    }
    
    if ats_score >= 90:
        job_match_stats["ats_readiness"] = "A"
    elif ats_score >= 75:
        job_match_stats["ats_readiness"] = "B+"
    elif ats_score >= 60:
        job_match_stats["ats_readiness"] = "B"
    elif ats_score >= 50:
        job_match_stats["ats_readiness"] = "C+"
    else:
        job_match_stats["ats_readiness"] = "C"
    
    # Check for missing sections
    missing_titles = sum(1 for exp in experience if not exp.get("title") or exp.get("title", "").strip() == "")
    if missing_titles > 0:
        job_match_stats["missing_sections"].append(f"Job titles ({missing_titles} missing)")
    
    missing_dates = sum(1 for exp in experience if not exp.get("start") or not exp.get("end"))
    if missing_dates > 0:
        job_match_stats["missing_sections"].append(f"Experience dates ({missing_dates} missing)")
    
    # Return structure matching frontend interface
    return {
        "skill_gaps": skill_gaps_list,
        "project_suggestions": project_suggestions,
        "job_match_stats": job_match_stats
    }


def _deduplicate_skills(skills: list) -> list:
    """Remove duplicate skills and normalize skill names"""
    if not skills:
        return []
    
    seen = set()
    deduplicated = []
    
    for skill in skills:
        if not skill:
            continue
        
        # Normalize skill name
        skill_str = str(skill).strip()
        skill_lower = skill_str.lower()
        
        # Skip if we've seen this exact skill or a very similar one
        if skill_lower in seen:
            continue
        
        # Check for similar skills (e.g., "Python" and "python", "Git" and "GitHub")
        is_duplicate = False
        for seen_skill in seen:
            # Exact match (case-insensitive)
            if skill_lower == seen_skill.lower():
                is_duplicate = True
                break
            # One contains the other (e.g., "GitHub" contains "Git")
            if len(skill_lower) > 3 and len(seen_skill.lower()) > 3:
                if skill_lower in seen_skill.lower() or seen_skill.lower() in skill_lower:
                    # Prefer the longer, more specific version
                    if len(skill_str) < len(seen_skill):
                        is_duplicate = True
                        break
        
        if not is_duplicate:
            seen.add(skill_lower)
            deduplicated.append(skill_str)
    
    return deduplicated


def _split_name(name: str) -> Dict[str, str]:
    """Split name into firstName and lastName"""
    if not name:
        return {"firstName": "", "lastName": ""}
    
    parts = name.strip().split()
    if len(parts) == 0:
        return {"firstName": "", "lastName": ""}
    elif len(parts) == 1:
        return {"firstName": parts[0], "lastName": ""}
    else:
        return {"firstName": parts[0], "lastName": " ".join(parts[1:])}


@router.get("/{user_id}")
async def get_dashboard(
    user_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """
    Get dashboard data for user - Returns exact structure matching frontend spec
    
    Supports optional authentication - if not authenticated, uses demo user for demo_user_id
    
    Returns:
    {
        "profile": {firstName, lastName, email, phone, location, links, headline},
        "stats": {resume_score, skills_count, experience_years, projects_count, education_level, processing_method, raw_text_length},
        "resume": {experience, education, skills, projects, certifications, entities, metadata},
        "recommendations": {skill_gaps, project_suggestions, job_match_stats}
    }
    """
    # Handle unauthenticated access for demo_user
    if not current_user:
        if user_id == "demo_user":
            # Create or get demo user
            result = await db.execute(select(User).where(User.email == "demo@rolewithai.com"))
            demo_user = result.scalar_one_or_none()
            if not demo_user:
                demo_user = User(
                    id=generate_id(),
                    email="demo@rolewithai.com",
                    name="Demo User",
                    password_hash=""  # No password for demo user
                )
                db.add(demo_user)
                await db.commit()
                await db.refresh(demo_user)
            current_user = demo_user
            user_id = demo_user.id  # Use the actual demo user ID
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
    
    # Verify user access (only if authenticated and user_id doesn't match)
    if current_user.id != user_id and user_id != "demo_user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Check if user has resumes (use current_user.id which is the resolved user ID)
    result = await db.execute(
        select(Resume).where(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .limit(1)
    )
    latest_resume = result.scalar_one_or_none()
    
    if not latest_resume or not latest_resume.parsed_json:
        return {
            "enabled": False,
            "message": "Please upload a resume to enable your dashboard"
        }
    
    # Get parsed data
    parsed_data = latest_resume.get_parsed_data()
    if not parsed_data:
        return {
            "enabled": False,
            "message": "Resume data not available"
        }
    
    # Get project count
    result = await db.execute(
        select(func.count(Project.id)).where(Project.user_id == current_user.id)
    )
    project_count = result.scalar() or 0
    
    # Extract name and split
    name = parsed_data.get("name", "") or parsed_data.get("firstName", "") + " " + parsed_data.get("lastName", "")
    if not name.strip():
        name = current_user.name or "User"
    name_parts = _split_name(name)
    
    # Build profile
    profile = {
        "firstName": parsed_data.get("firstName") or name_parts["firstName"],
        "lastName": parsed_data.get("lastName") or name_parts["lastName"],
        "email": parsed_data.get("email", ""),
        "phone": parsed_data.get("phone", ""),
        "location": parsed_data.get("location", ""),
        "links": parsed_data.get("links", {}) or {},
        "headline": parsed_data.get("title", "") or parsed_data.get("headline", "")
    }
    
    # Ensure experience is a list (not a string)
    experience_raw = parsed_data.get("experience", [])
    if isinstance(experience_raw, str):
        # If experience is a string, it means parsing failed - return empty list
        experience_list = []
    elif isinstance(experience_raw, list):
        experience_list = experience_raw
    else:
        experience_list = []
    
    # Ensure education is a list
    education_raw = parsed_data.get("education", [])
    if isinstance(education_raw, str):
        education_list = []
    elif isinstance(education_raw, list):
        education_list = education_raw
    else:
        education_list = []
    
    # Ensure projects is a list
    projects_raw = parsed_data.get("projects", [])
    if isinstance(projects_raw, str):
        projects_list = []
    elif isinstance(projects_raw, list):
        projects_list = projects_raw
    else:
        projects_list = []
    
    # Ensure skills is a list and deduplicate
    skills_raw = parsed_data.get("skills", [])
    if isinstance(skills_raw, str):
        skills_list = []
    elif isinstance(skills_raw, list):
        skills_list = _deduplicate_skills(skills_raw)
    else:
        skills_list = []
    
    # Ensure certifications is a list
    certifications_raw = parsed_data.get("certifications", [])
    if isinstance(certifications_raw, str):
        certifications_list = []
    elif isinstance(certifications_raw, list):
        certifications_list = certifications_raw
    else:
        certifications_list = []
    
    # Calculate experience years
    experience_years = _calculate_experience_years(experience_list)
    
    # Get education level
    education_level = _get_education_level(education_list)
    
    # Get metadata
    metadata = parsed_data.get("_metadata", {})
    if not isinstance(metadata, dict):
        metadata = {}
    processing_method = metadata.get("processing_method", "rule-based")
    raw_text_length = metadata.get("raw_text_length", len(latest_resume.raw_text or ""))
    sections_found = metadata.get("sections_found", [])
    if not isinstance(sections_found, list):
        sections_found = []
    
    # Build stats
    stats = {
        "resume_score": latest_resume.resume_score,
        "skills_count": len(skills_list),
        "experience_years": experience_years,
        "projects_count": project_count,
        "education_level": education_level,
        "processing_method": processing_method,
        "raw_text_length": raw_text_length
    }
    
    # Build resume data - ensure all fields are properly structured
    resume = {
        "experience": experience_list,
        "education": education_list,
        "skills": skills_list,
        "projects": projects_list,
        "certifications": certifications_list,
        "entities": parsed_data.get("entities", {}) if isinstance(parsed_data.get("entities"), dict) else {},
        "metadata": {
            "sections_found": sections_found,
            "processed_at": latest_resume.created_at.isoformat() if latest_resume.created_at else "",
            "resume_id": latest_resume.id
        }
    }
    
    # Generate AI insights and recommendations
    recommendations = _generate_ai_insights(
        experience_list, 
        education_list, 
        skills_list, 
        projects_list,
        experience_years,
        latest_resume.resume_score
    )
    
    return {
        "profile": profile,
        "stats": stats,
        "resume": resume,
        "recommendations": recommendations
    }

@router.get("/{user_id}/stats")
async def get_dashboard_stats(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get dashboard statistics"""
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Get resume count
    result = await db.execute(
        select(func.count(Resume.id)).where(Resume.user_id == user_id)
    )
    resume_count = result.scalar() or 0
    
    # Get project count
    result = await db.execute(
        select(func.count(Project.id)).where(Project.user_id == user_id)
    )
    project_count = result.scalar() or 0
    
    # Get latest resume score
    result = await db.execute(
        select(Resume.resume_score).where(Resume.user_id == user_id)
        .order_by(Resume.created_at.desc())
        .limit(1)
    )
    latest_score = result.scalar_one_or_none() or 0
    
    return {
        "resume_count": resume_count,
        "project_count": project_count,
        "latest_score": latest_score,
        "dashboard_enabled": resume_count > 0
    }

