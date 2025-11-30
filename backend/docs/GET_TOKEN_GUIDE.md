# How to Get Authentication Token

## Method 1: Using API (Recommended)

### Step 1: Register a User

**Using curl:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "Your Name",
    "password": "yourpassword123"
  }'
```

**Using Python:**
```python
import requests

response = requests.post(
    "http://localhost:8000/api/v1/auth/register",
    json={
        "email": "user@example.com",
        "name": "Your Name",
        "password": "yourpassword123"
    }
)
print(response.json())
```

### Step 2: Login to Get Token

**Using curl:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=yourpassword123"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Using Python:**
```python
import requests

response = requests.post(
    "http://localhost:8000/api/v1/auth/login",
    data={
        "username": "user@example.com",  # Note: 'username' field, not 'email'
        "password": "yourpassword123"
    }
)

token_data = response.json()
token = token_data["access_token"]
print(f"Your token: {token}")
```

### Step 3: Use the Token

**Using curl:**
```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Using Python:**
```python
import requests

token = "YOUR_TOKEN_HERE"

response = requests.get(
    "http://localhost:8000/api/v1/auth/me",
    headers={"Authorization": f"Bearer {token}"}
)

print(response.json())
```

## Method 2: Using FastAPI Docs (Easiest)

1. **Open FastAPI Docs:**
   - Go to: http://localhost:8000/docs

2. **Register a User:**
   - Find `/api/v1/auth/register` endpoint
   - Click "Try it out"
   - Enter:
     ```json
     {
       "email": "user@example.com",
       "name": "Your Name",
       "password": "yourpassword123"
     }
     ```
   - Click "Execute"

3. **Login:**
   - Find `/api/v1/auth/login` endpoint
   - Click "Try it out"
   - Click "Authorize" button (top right)
   - Enter:
     - Username: `user@example.com`
     - Password: `yourpassword123`
   - Click "Authorize"
   - **The token is now stored in your browser session!**

4. **Test Protected Endpoints:**
   - Try `/api/v1/auth/me` - it should work now!

## Method 3: Store Token in Frontend

**In your frontend code (JavaScript/TypeScript):**

```typescript
// Login function
async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('username', email);  // Note: 'username' not 'email'
  formData.append('password', password);

  const response = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  const token = data.access_token;

  // Store token in localStorage
  localStorage.setItem('auth_token', token);
  
  return token;
}

// Use token in requests
async function getCurrentUser() {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('http://localhost:8000/api/v1/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
}
```

## Quick Test Script

Create a file `test_auth.py`:

```python
import requests

BASE_URL = "http://localhost:8000"

# Step 1: Register
print("1. Registering user...")
register_response = requests.post(
    f"{BASE_URL}/api/v1/auth/register",
    json={
        "email": "test@example.com",
        "name": "Test User",
        "password": "testpass123"
    }
)
print(f"Register: {register_response.status_code}")
print(register_response.json())

# Step 2: Login
print("\n2. Logging in...")
login_response = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    data={
        "username": "test@example.com",
        "password": "testpass123"
    }
)
token_data = login_response.json()
token = token_data["access_token"]
print(f"Token: {token[:50]}...")

# Step 3: Use token
print("\n3. Getting user info...")
me_response = requests.get(
    f"{BASE_URL}/api/v1/auth/me",
    headers={"Authorization": f"Bearer {token}"}
)
print(f"User info: {me_response.json()}")
```

Run it:
```bash
python test_auth.py
```

## Important Notes

1. **Token Expiration:** Tokens expire after 30 days (configurable in `settings.ACCESS_TOKEN_EXPIRE_MINUTES`)

2. **Token Format:** Always include `Bearer ` prefix:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

3. **Login Field:** The login endpoint uses `username` field (not `email`), but you pass the email address as the username value.

4. **Demo Mode:** Your app currently supports demo mode (no auth required for resume upload), but using tokens gives you:
   - User-specific data
   - Resume history per user
   - Better security

## Troubleshooting

**401 Unauthorized:**
- Check token is correct
- Ensure `Bearer ` prefix is included
- Token might be expired (login again)

**400 Bad Request (Register):**
- Email already exists
- Invalid email format
- Password too short

**401 Unauthorized (Login):**
- Wrong email/password
- User doesn't exist (register first)

