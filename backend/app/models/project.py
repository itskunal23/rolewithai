"""
Project model
"""
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.core.utils import generate_id
import json

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_id = Column(String, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=True)
    title = Column(String, nullable=False)
    spec_json = Column(Text, nullable=True)  # JSON string with project spec
    status = Column(String, default="pending")  # pending, in_progress, completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="projects")
    resume = relationship("Resume", back_populates="projects")
    
    def get_spec(self):
        """Get project spec as dict"""
        if self.spec_json:
            return json.loads(self.spec_json)
        return None
    
    def set_spec(self, spec: dict):
        """Set project spec from dict"""
        self.spec_json = json.dumps(spec, ensure_ascii=False)

