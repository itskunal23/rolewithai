#!/usr/bin/env python3
"""
Quick script to test authentication and get a token
"""
import requests
import sys

BASE_URL = "http://localhost:8000"

def main():
    print("🔐 RoleWithAI Authentication Test\n")
    
    # Get user input
    email = input("Enter email: ").strip() or "test@example.com"
    name = input("Enter name: ").strip() or "Test User"
    password = input("Enter password: ").strip() or "testpass123"
    
    print("\n" + "="*50)
    
    # Step 1: Register
    print("\n1️⃣ Registering user...")
    try:
        register_response = requests.post(
            f"{BASE_URL}/api/v1/auth/register",
            json={
                "email": email,
                "name": name,
                "password": password
            }
        )
        
        if register_response.status_code == 200:
            print("✅ Registration successful!")
            print(f"   User: {register_response.json()}")
        elif register_response.status_code == 400:
            print("⚠️  User already exists, continuing to login...")
        else:
            print(f"❌ Registration failed: {register_response.status_code}")
            print(f"   {register_response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend!")
        print(f"   Make sure backend is running on {BASE_URL}")
        sys.exit(1)
    
    # Step 2: Login
    print("\n2️⃣ Logging in...")
    try:
        login_response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            data={
                "username": email,  # Note: 'username' field, but use email value
                "password": password
            }
        )
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data["access_token"]
            print("✅ Login successful!")
            print(f"\n📝 Your Token:")
            print(f"   {token}")
            print(f"\n💾 Save this token to use in API requests")
            print(f"   Authorization: Bearer {token[:50]}...")
        else:
            print(f"❌ Login failed: {login_response.status_code}")
            print(f"   {login_response.text}")
            sys.exit(1)
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend!")
        sys.exit(1)
    
    # Step 3: Test token
    print("\n3️⃣ Testing token...")
    try:
        me_response = requests.get(
            f"{BASE_URL}/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if me_response.status_code == 200:
            user_info = me_response.json()
            print("✅ Token works!")
            print(f"   User ID: {user_info['id']}")
            print(f"   Email: {user_info['email']}")
            print(f"   Name: {user_info['name']}")
        else:
            print(f"❌ Token test failed: {me_response.status_code}")
            print(f"   {me_response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend!")
        sys.exit(1)
    
    print("\n" + "="*50)
    print("\n✅ All tests passed! Your token is ready to use.")
    print(f"\n💡 To use this token in requests:")
    print(f"   headers = {{'Authorization': 'Bearer {token[:30]}...'}}")

if __name__ == "__main__":
    main()

