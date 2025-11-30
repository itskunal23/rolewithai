"""
API endpoint tests
"""
import pytest
from httpx import AsyncClient
from app.main import app
from app.models.user import User
import cuid2

@pytest.mark.asyncio
async def test_health_check():
    """Test health check endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data

@pytest.mark.asyncio
async def test_register_user(db_session):
    """Test user registration"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "newuser@example.com",
                "name": "New User",
                "password": "testpass123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["email"] == "newuser@example.com"

@pytest.mark.asyncio
async def test_login(db_session, test_user):
    """Test user login"""
    # First set password hash (in real scenario, user would register with password)
    from app.api.v1.auth import get_password_hash
    test_user.password_hash = get_password_hash("testpass123")
    await db_session.commit()
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/auth/login",
            data={
                "username": test_user.email,
                "password": "testpass123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

