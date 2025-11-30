"""
API v1 routes
"""
from fastapi import APIRouter
from app.api.v1 import auth, resume, dashboard, projects

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["authentication"])
router.include_router(resume.router, prefix="/resume", tags=["resume"])
router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
router.include_router(projects.router, prefix="/projects", tags=["projects"])

