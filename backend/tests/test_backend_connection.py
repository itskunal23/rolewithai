"""
Quick test script to verify backend is accessible
"""
import requests
import sys

def test_backend():
    base_url = "http://localhost:8000"
    
    print("Testing backend connection...")
    print(f"Backend URL: {base_url}")
    print("-" * 50)
    
    # Test 1: Health check
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        print(f"✓ Health check: {response.status_code}")
        print(f"  Response: {response.json()}")
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return False
    
    # Test 2: CORS preflight (simulate browser)
    try:
        headers = {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        response = requests.options(f"{base_url}/api/v1/resume/upload", headers=headers, timeout=5)
        print(f"✓ CORS preflight: {response.status_code}")
        cors_headers = {k: v for k, v in response.headers.items() if k.lower().startswith('access-control')}
        if cors_headers:
            print(f"  CORS headers: {cors_headers}")
        else:
            print(f"  ⚠ No CORS headers found")
    except Exception as e:
        print(f"✗ CORS test failed: {e}")
    
    # Test 3: API docs
    try:
        response = requests.get(f"{base_url}/docs", timeout=5)
        print(f"✓ API docs: {response.status_code}")
    except Exception as e:
        print(f"✗ API docs failed: {e}")
    
    print("-" * 50)
    print("Backend is running and accessible!")
    print("\nIf frontend still can't connect:")
    print("1. Check frontend is running on http://localhost:3000")
    print("2. Check browser console for CORS errors")
    print("3. Verify NEXT_PUBLIC_API_URL in frontend/.env")
    
    return True

if __name__ == "__main__":
    try:
        import requests
    except ImportError:
        print("Installing requests...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
        import requests
    
    success = test_backend()
    sys.exit(0 if success else 1)

