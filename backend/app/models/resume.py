"""
Resume model
"""
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.core.utils import generate_id
import json

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=True)  # Path to stored PDF
    raw_text = Column(Text, nullable=True)  # Extracted text
    parsed_json = Column(Text, nullable=True)  # JSON string of parsed data
    resume_score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="resumes")
    projects = relationship("Project", back_populates="resume", cascade="all, delete-orphan")
    
    def get_parsed_data(self):
        """Get parsed JSON as dict"""
        if self.parsed_json:
            return json.loads(self.parsed_json)
        return None
    
    def set_parsed_data(self, data: dict):
        """Set parsed JSON from dict"""
        self.parsed_json = json.dumps(data, ensure_ascii=False)

