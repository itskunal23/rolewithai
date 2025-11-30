"""
Pytest configuration and fixtures
"""
import pytest
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool
from app.core.database import Base, get_db
from app.models import User, Resume, Skill, Project
from app.core.config import settings
import os

# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
async def db_session():
    """Create test database session"""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async_session_maker = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session_maker() as session:
        yield session
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()

@pytest.fixture
async def test_user(db_session):
    """Create test user"""
    user = User(
        id="test_user_123",
        email="test@example.com",
        name="Test User"
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user

@pytest.fixture
def sample_resume_text():
    """Sample resume text for testing"""
    return """
Kunal Goenka
k.goenka23@gmail.com
540-424-1253
Stafford VA, 22554

EDUCATION
Virginia Tech: Pamplin School of Business
B.Sc. Business Information Technology - Decision Support Systems
May 2025
GPA: 3.27

EXPERIENCE
Supplier Quality Intern
The Boeing Company
St. Louis, MO
June 2024 - August 2024

• Developed interactive Tableau dashboards using MySQL and enterprise data warehouse sources to visualize supplier quality KPIs
• Identified and cleaned Procurement data on Purchase Orders and Double Quality Clauses for transition to SAP

SKILLS
Python, SQL, VBA, JavaScript, HTML, CSS, C#, Tableau, Excel, PowerPoint, Salesforce, MySQL, VSCode, GitHub, Data Modeling, Data Cleaning, Data Visualization

PROJECTS
DineSmart - Restaurant recommendation system
Tech: Flask, Python, React
Description: Built a recommendation engine using machine learning

CERTIFICATIONS
Fundamentals of AI & ML (Skillsoft, 2024)
Tableau for Data Visualizations (Skillsoft, 2024)

LINKS
LinkedIn: https://www.linkedin.com/in/kunalgoenka23/
GitHub: https://github.com/itskunal23
Portfolio: https://kunal-g-portfolio.netlify.app/
"""

