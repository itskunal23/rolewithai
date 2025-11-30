"""
Resume upload and management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pathlib import Path
import shutil
from typing import Optional
from app.core.database import get_db
from app.core.config import settings
from app.models.user import User
from app.models.resume import Resume
from app.models.skill import Skill, UserSkill
from app.services.resume_pipeline import ResumePipeline
from app.api.v1.auth import get_current_user, get_current_user_optional
from app.core.utils import generate_id

router = APIRouter()

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload and process resume PDF
    
    Returns:
        Job status and resume ID
    """
    # Validate file type
    if not file.filename or not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported"
        )
    
    # Use demo user if not authenticated
    if current_user is None:
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
    
    # Create user upload directory (use same approach as main.py)
    # Get backend directory: resume.py is at app/api/v1/resume.py
    # parent.parent.parent.parent = backend
    backend_dir = Path(__file__).parent.parent.parent.parent
    upload_dir = backend_dir / "data" / "uploads"
    user_upload_dir = upload_dir / current_user.id
    user_upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Save file
    resume_id = generate_id()
    file_path = user_upload_dir / f"{resume_id}.pdf"
    
    try:
        # Read file content asynchronously
        file_content = await file.read()
        # Write file content
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        print(f"✓ File saved to: {file_path}")
    except Exception as e:
        import traceback
        print(f"❌ File save error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    
    # Process resume - use enhanced pipeline if available
    try:
        from app.services.enhanced_resume_pipeline import EnhancedResumePipeline
        pipeline = EnhancedResumePipeline()
        use_enhanced = True
        print(f"📄 Processing resume with ENHANCED pipeline: {file.filename}")
    except ImportError:
        from app.services.resume_pipeline import ResumePipeline
        pipeline = ResumePipeline()
        use_enhanced = False
        print(f"📄 Processing resume with standard pipeline: {file.filename}")
    
    try:
        print(f"   File path: {file_path}")
        print(f"   File exists: {file_path.exists()}")
        print(f"   File size: {file_path.stat().st_size if file_path.exists() else 0} bytes")
        print(f"   Starting pipeline processing...")
        
        if use_enhanced:
            result = await pipeline.process_resume(
                str(file_path),
                current_user.id
            )
        else:
            result = await pipeline.process_resume(
                str(file_path),
                current_user.id,
                use_llm=False  # Fast rule-based parsing (no LLM)
            )
        
        print(f"✓ Resume processed successfully. Score: {result['score']}")
        print(f"   Parsed data keys: {list(result['parsed_data'].keys())}")
        
        # Save to database
        resume = Resume(
            id=resume_id,
            user_id=current_user.id,
            filename=file.filename,
            file_path=str(file_path),
            raw_text=result["raw_text"],
            resume_score=result["score"]
        )
        resume.set_parsed_data(result["parsed_data"])
        
        db.add(resume)
        await db.commit()
        await db.refresh(resume)
        
        # Update user skills from parsed resume
        await _sync_user_skills(current_user.id, result["parsed_data"], db)
        
        # Transform parsed data to frontend format
        frontend_data = _transform_to_frontend_format(result["parsed_data"])
        
        return {
            "status": "completed",
            "resume_id": resume_id,
            "score": result["score"],
            "message": "Resume processed successfully",
            "resume_data": frontend_data
        }
    
    except Exception as e:
        # Log full error for debugging BEFORE cleanup
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ Resume processing error: {str(e)}")
        print(f"Traceback: {error_trace}")
        
        # Clean up file on error
        try:
            if file_path.exists():
                file_path.unlink()
                print(f"✓ Cleaned up file: {file_path}")
        except Exception as cleanup_error:
            print(f"⚠ Failed to clean up file: {cleanup_error}")
        
        # Return error response instead of raising to prevent server crash
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process resume: {str(e)}"
        )

@router.get("/{resume_id}")
async def get_resume(
    resume_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Get parsed resume data (public access for demo mode)"""
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id)
    )
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # If user is authenticated, verify ownership (optional check for demo mode)
    if current_user and resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resume"
        )
    
    parsed_data = resume.get_parsed_data()
    
    # Transform backend format to frontend ResumeJson format
    frontend_data = _transform_to_frontend_format(parsed_data)
    
    return {
        "id": resume.id,
        "filename": resume.filename,
        "parsed_data": frontend_data,
        "score": resume.resume_score,
        "created_at": resume.created_at.isoformat() if resume.created_at else None
    }

@router.get("/")
async def list_resumes(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """List all resumes for current user (or latest resume for demo user if not authenticated)"""
    if not current_user:
        # For unauthenticated users, return the most recent resume (demo mode)
        result = await db.execute(
            select(Resume)
            .order_by(Resume.created_at.desc())
            .limit(1)
        )
        latest_resume = result.scalar_one_or_none()
        if latest_resume:
            return [{
                "id": latest_resume.id,
                "filename": latest_resume.filename,
                "score": latest_resume.resume_score,
                "created_at": latest_resume.created_at.isoformat() if latest_resume.created_at else None
            }]
        return []
    
    result = await db.execute(
        select(Resume).where(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
    )
    resumes = result.scalars().all()
    
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "score": r.resume_score,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in resumes
    ]

def _transform_to_frontend_format(parsed_data: dict) -> dict:
    """
    Transform backend parsed resume format to clean frontend ResumeJson format
    NO nulls, NO duplicates, NO raw text - only clean structured data
    """
    import re
    from datetime import datetime
    
    # Extract and clean name
    name_raw = parsed_data.get("name") or ""
    name = str(name_raw).strip() if name_raw else ""
    name_parts = name.split(maxsplit=1) if name else ["", ""]
    firstName = name_parts[0] if len(name_parts) > 0 else ""
    lastName = name_parts[1] if len(name_parts) > 1 else ""
    
    # Extract title from first experience or use default
    title = ""
    if parsed_data.get("experience") and len(parsed_data["experience"]) > 0:
        title_raw = parsed_data["experience"][0].get("title") or ""
        title = str(title_raw).strip() if title_raw else ""
    
    # Calculate career level based on YEARS of experience, not count
    careerLevel = _calculate_career_level(parsed_data.get("experience", []))
    
    # Build clean summary
    summary = _build_summary(parsed_data, title, careerLevel)
    
    # Transform experience - clean and validate
    experience = []
    seen_companies = set()  # Prevent duplicates
    for exp in parsed_data.get("experience", []):
        company = exp.get("company", "").strip()
        role = exp.get("title", "").strip()
        
        # Handle None values properly
        company_raw = exp.get("company") or ""
        role_raw = exp.get("title") or ""
        
        company = str(company_raw).strip() if company_raw else ""
        role = str(role_raw).strip() if role_raw else ""
        
        # Skip if empty or duplicate
        if not company and not role:
            continue
        
        # Create unique key to detect duplicates
        exp_key = f"{company.lower()}_{role.lower()}"
        if exp_key in seen_companies:
            continue
        seen_companies.add(exp_key)
        
        # Clean dates - never return "null" or None
        # Handle None values properly
        start_date_raw = exp.get("start") or ""
        end_date_raw = exp.get("end") or ""
        
        start_date = str(start_date_raw).strip() if start_date_raw else ""
        end_date = str(end_date_raw).strip() if end_date_raw else "Present"
        
        # Ensure end_date is not empty
        if not end_date:
            end_date = "Present"
        
        # Clean achievements - remove empty strings
        achievements = [a.strip() for a in exp.get("bullets", []) if a and a.strip()]
        
        experience.append({
            "company": company,
            "role": role,
            "startDate": start_date,
            "endDate": end_date,
            "achievements": achievements
        })
    
    # Transform education - clean and validate
    education = []
    seen_edu = set()  # Prevent duplicates
    for edu in parsed_data.get("education", []):
        # Handle None values properly
        institution_raw = edu.get("school") or ""
        degree_raw = edu.get("degree") or ""
        grad_date_raw = edu.get("grad_date") or ""
        
        institution = str(institution_raw).strip() if institution_raw else ""
        degree = str(degree_raw).strip() if degree_raw else ""
        grad_date = str(grad_date_raw).strip() if grad_date_raw else ""
        
        # Skip if empty
        if not institution and not degree:
            continue
        
        # Create unique key
        edu_key = f"{institution.lower()}_{degree.lower()}"
        if edu_key in seen_edu:
            continue
        seen_edu.add(edu_key)
        
        # Extract year from grad_date if it's a string with year
        year = ""
        if grad_date:
            # Try to extract 4-digit year
            year_match = re.search(r'\b(19|20)\d{2}\b', grad_date)
            if year_match:
                year = year_match.group(0)
            else:
                year = grad_date  # Use as-is if no year found
        
        education.append({
            "institution": institution,
            "degree": degree,
            "year": year  # Never null, always string
        })
    
    # Transform projects - clean
    projects = []
    seen_projects = set()
    for proj in parsed_data.get("projects", []):
        if isinstance(proj, dict):
            proj_title_raw = proj.get("title") or ""
            proj_title = str(proj_title_raw).strip() if proj_title_raw else ""
        else:
            proj_title = str(proj).strip() if proj else ""
        
        if proj_title and proj_title.lower() not in seen_projects:
            seen_projects.add(proj_title.lower())
            projects.append(proj_title)
    
    # Clean skills - remove duplicates and empty strings
    skills = []
    seen_skills = set()
    for skill in parsed_data.get("skills", []):
        skill_clean = str(skill).strip()
        if skill_clean and skill_clean.lower() not in seen_skills:
            seen_skills.add(skill_clean.lower())
            skills.append(skill_clean)
    
    # Clean certifications
    certifications = []
    seen_certs = set()
    for cert in parsed_data.get("certifications", []):
        cert_clean = str(cert).strip()
        if cert_clean and cert_clean.lower() not in seen_certs:
            seen_certs.add(cert_clean.lower())
            certifications.append(cert_clean)
    
    # Job match stats (synthetic but based on resume quality)
    skills_count = len(skills)
    exp_count = len(experience)
    base_views = max(10, skills_count * 3 + exp_count * 5)
    
    return {
        "firstName": firstName,
        "lastName": lastName,
        "title": title or "Professional",
        "location": str(parsed_data.get("location") or "").strip(),
        "careerLevel": careerLevel,
        "summary": summary,
        "skills": skills,
        "experience": experience,
        "education": education,
        "certifications": certifications,
        "projects": projects,
        "avatarUrl": None,
        "jobMatchStats": {
            "profileViews": base_views,
            "postImpressions": base_views * 40,
            "searchAppearances": base_views // 3
        },
        "links": parsed_data.get("links", {}) or {}
    }


def _calculate_career_level(experience: list) -> str:
    """
    Calculate career level based on YEARS of experience, not count
    """
    import re
    from datetime import datetime
    
    if not experience:
        return "Entry Level"
    
    total_years = 0
    current_year = datetime.now().year
    
    for exp in experience:
        # Handle None values properly - convert to empty string first
        start_date_raw = exp.get("start") or ""
        end_date_raw = exp.get("end") or ""
        
        # Convert to string and strip
        start_date = str(start_date_raw).strip() if start_date_raw else ""
        end_date = str(end_date_raw).strip() if end_date_raw else "Present"
        
        # If end_date is empty after stripping, default to "Present"
        if not end_date:
            end_date = "Present"
        
        # Extract year from start date
        start_year = None
        if start_date:
            year_match = re.search(r'\b(19|20)\d{2}\b', start_date)
            if year_match:
                start_year = int(year_match.group(0))
        
        # Extract year from end date
        end_year = current_year
        if end_date and end_date.lower() not in ["present", "current"]:
            year_match = re.search(r'\b(19|20)\d{2}\b', end_date)
            if year_match:
                end_year = int(year_match.group(0))
        
        # Calculate years for this experience
        if start_year:
            years = end_year - start_year
            total_years += max(0, years)
    
    # Determine level based on total years
    if total_years == 0:
        return "Entry Level"
    elif total_years < 3:
        return "Entry Level"
    elif total_years < 7:
        return "Mid Level"
    else:
        return "Senior Level"


def _build_summary(parsed_data: dict, title: str, career_level: str) -> str:
    """
    Build clean professional summary
    """
    summary_parts = []
    
    if title:
        summary_parts.append(title)
    
    # Add career level context
    if career_level == "Entry Level":
        summary_parts.append("seeking opportunities to grow")
    elif career_level == "Mid Level":
        summary_parts.append("with proven track record")
    else:
        summary_parts.append("with extensive experience")
    
    # Add top skills
    skills = parsed_data.get("skills", [])
    if skills:
        top_skills = skills[:3]
        summary_parts.append(f"Expert in {', '.join(top_skills)}")
    
    summary = ". ".join(summary_parts) + "." if summary_parts else "Professional seeking new opportunities."
    return summary

async def _sync_user_skills(user_id: str, parsed_data: dict, db: AsyncSession):
    """Sync user skills from parsed resume data"""
    skills = parsed_data.get("skills", [])
    
    if not skills:
        return
    
    # Get or create skills
    for skill_name in skills:
        # Check if skill exists
        result = await db.execute(select(Skill).where(Skill.name == skill_name))
        skill = result.scalar_one_or_none()
        
        if not skill:
            skill = Skill(id=generate_id(), name=skill_name)
            db.add(skill)
            await db.flush()
        
        # Check if user_skill exists
        result = await db.execute(
            select(UserSkill).where(
                UserSkill.user_id == user_id,
                UserSkill.skill_id == skill.id
            )
        )
        user_skill = result.scalar_one_or_none()
        
        if not user_skill:
            user_skill = UserSkill(
                id=generate_id(),
                user_id=user_id,
                skill_id=skill.id,
                proficiency=50  # Default proficiency
            )
            db.add(user_skill)
    
    await db.commit()

