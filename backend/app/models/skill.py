"""
Skill models
"""
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.core.utils import generate_id

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(String, primary_key=True, default=generate_id)
    name = Column(String, unique=True, nullable=False, index=True)
    category = Column(String, nullable=True)  # e.g., "technical", "ml", "data"
    
    # Relationships
    user_skills = relationship("UserSkill", back_populates="skill")

class UserSkill(Base):
    __tablename__ = "user_skills"
    
    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    proficiency = Column(Integer, default=0)  # 0-100
    
    # Relationships
    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill", back_populates="user_skills")

