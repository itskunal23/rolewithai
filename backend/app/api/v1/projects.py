"""
Project generation endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.project import Project
from app.services.llm_orchestrator import LLMOrchestrator
from app.api.v1.auth import get_current_user
from app.core.utils import generate_id

router = APIRouter()

class ProjectGenerateRequest(BaseModel):
    resume_id: str
    skill_ids: Optional[List[str]] = None
    difficulty: str = "beginner"  # beginner, intermediate, advanced
    role_title: Optional[str] = None

@router.post("/generate")
async def generate_project(
    request: ProjectGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a project specification based on resume skills
    
    IMPORTANT: Requires a parsed resume. Returns 403 if no resume exists.
    """
    # Verify resume belongs to user
    result = await db.execute(
        select(Resume).where(
            Resume.id == request.resume_id,
            Resume.user_id == current_user.id
        )
    )
    resume = result.scalar_one_or_none()
    
    if not resume or not resume.parsed_json:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Resume not found or not parsed. Please upload and process a resume first."
        )
    
    # Get parsed data
    parsed_data = resume.get_parsed_data()
    skills = parsed_data.get("skills", [])
    
    if not skills:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No skills found in resume"
        )
    
    # Generate project spec using LLM
    llm_orchestrator = LLMOrchestrator()
    
    try:
        project_spec = await llm_orchestrator.generate_project_spec(
            skills=skills[:10],  # Limit to top 10 skills
            role_title=request.role_title,
            difficulty=request.difficulty
        )
        
        # Create project record
        project = Project(
            id=generate_id(),
            user_id=current_user.id,
            resume_id=request.resume_id,
            title=project_spec.get("title", "Generated Project"),
            status="pending"
        )
        project.set_spec(project_spec)
        
        db.add(project)
        await db.commit()
        await db.refresh(project)
        
        return {
            "project_id": project.id,
            "title": project.title,
            "spec": project.get_spec(),
            "status": project.status
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate project: {str(e)}"
        )

@router.get("/")
async def list_projects(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all projects for current user"""
    result = await db.execute(
        select(Project).where(Project.user_id == current_user.id)
        .order_by(Project.created_at.desc())
    )
    projects = result.scalars().all()
    
    return [
        {
            "id": p.id,
            "title": p.title,
            "status": p.status,
            "spec": p.get_spec(),
            "created_at": p.created_at.isoformat() if p.created_at else None
        }
        for p in projects
    ]

@router.get("/{project_id}")
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get project details"""
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return {
        "id": project.id,
        "title": project.title,
        "status": project.status,
        "spec": project.get_spec(),
        "created_at": project.created_at.isoformat() if project.created_at else None
    }

