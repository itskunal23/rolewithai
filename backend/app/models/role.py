"""
Role/Template model
"""
from sqlalchemy import Column, String, Text
from app.core.database import Base
from app.core.utils import generate_id

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(String, primary_key=True, default=generate_id)
    title = Column(String, nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    canonical_skills = Column(Text, nullable=True)  # JSON array of skill names
    level = Column(String, nullable=True)  # entry, mid, senior

