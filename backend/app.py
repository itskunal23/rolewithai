"""
RoleWithAI Backend - Entry Point
Run with: python app.py
Starts both backend and frontend servers automatically
"""
import sys
import os
import subprocess
import signal
import platform
from pathlib import Path
from threading import Thread
import time

# CRITICAL: Manipulate path BEFORE any other imports to prevent 'frontend' import conflicts
backend_dir = Path(__file__).parent.absolute()
os.chdir(backend_dir)

# Remove parent directory from sys.path to avoid importing 'frontend'
parent_dir = str(backend_dir.parent)
if parent_dir in sys.path:
    sys.path.remove(parent_dir)

# Also check and remove if current working directory is the parent
current_dir = str(Path.cwd())
if current_dir == parent_dir and current_dir in sys.path:
    sys.path.remove(current_dir)

# Ensure backend directory is first in path (highest priority)
if str(backend_dir) in sys.path:
    sys.path.remove(str(backend_dir))
sys.path.insert(0, str(backend_dir))

# Set PYTHONPATH environment variable for subprocesses (uvicorn workers)
# This ensures child processes also have the correct path
os.environ['PYTHONPATH'] = str(backend_dir)

# Also set it in sys.path format for maximum compatibility
if 'PYTHONPATH' not in os.environ or str(backend_dir) not in os.environ.get('PYTHONPATH', ''):
    existing_pythonpath = os.environ.get('PYTHONPATH', '')
    if existing_pythonpath:
        os.environ['PYTHONPATH'] = f"{backend_dir}{os.pathsep}{existing_pythonpath}"
    else:
        os.environ['PYTHONPATH'] = str(backend_dir)

# ANSI color codes for terminal output
class Colors:
    RESET = '\033[0m'
    BOLD = '\033[1m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RED = '\033[91m'
    GRAY = '\033[90m'

# Global variable to store frontend process
frontend_process = None

def print_status(message, status="info"):
    """Print formatted status message"""
    icons = {
        "success": f"{Colors.GREEN}✓{Colors.RESET}",
        "error": f"{Colors.RED}✗{Colors.RESET}",
        "warning": f"{Colors.YELLOW}⚠{Colors.RESET}",
        "info": f"{Colors.CYAN}ℹ{Colors.RESET}",
        "loading": f"{Colors.BLUE}⟳{Colors.RESET}"
    }
    icon = icons.get(status, "")
    print(f"{icon} {message}")

def print_header(title, char="="):
    """Print formatted header"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}{char * 60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{title.center(60)}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{char * 60}{Colors.RESET}\n")

def wait_for_backend(max_attempts=60, delay=0.5):
    """Wait for backend to be ready before starting frontend"""
    import urllib.request
    import urllib.error
    import socket
    
    backend_url = "http://127.0.0.1:8000/health"
    print_status("Waiting for backend server to be ready...", "loading")
    
    spinner_chars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    spinner_idx = 0
    
    for attempt in range(max_attempts):
        try:
            req = urllib.request.Request(backend_url)
            req.add_header('User-Agent', 'RoleWithAI-Startup')
            req.add_header('Connection', 'close')
            
            with urllib.request.urlopen(req, timeout=0.5) as response:
                status = response.getcode()
                if status == 200:
                    try:
                        _ = response.read()
                    except:
                        pass
                    print_status("Backend server is ready!", "success")
                    return True
        except urllib.error.HTTPError as e:
            if e.code == 200:
                print_status("Backend server is ready!", "success")
                return True
        except (urllib.error.URLError, OSError, ConnectionError, socket.timeout, socket.gaierror, TimeoutError):
            pass
        except Exception:
            pass
        
        if attempt < max_attempts - 1:
            time.sleep(delay)
            # Show spinner and progress
            if attempt % 2 == 0:  # Update spinner every 2 attempts
                spinner = spinner_chars[spinner_idx % len(spinner_chars)]
                elapsed = (attempt + 1) * delay
                print(f"\r{Colors.GRAY}{spinner} Checking backend... ({elapsed:.1f}s){Colors.RESET}", end="", flush=True)
                spinner_idx += 1
    
    print()  # New line after spinner
    print_status("Backend did not become ready in time. Starting frontend anyway...", "warning")
    return False

def start_frontend():
    """Start the frontend development server"""
    global frontend_process
    frontend_dir = backend_dir.parent / "frontend"
    
    if not frontend_dir.exists():
        print("⚠️  Frontend directory not found. Skipping frontend startup.")
        return
    
    # Wait for backend to be ready first
    wait_for_backend()
    
    print_header("Starting RoleWithAI Frontend Server")
    print_status(f"Frontend will be available at: {Colors.BOLD}{Colors.GREEN}http://localhost:3000{Colors.RESET}", "info")
    
    try:
        # Check if npm is available
        if platform.system() == "Windows":
            # Try npm first, then bun
            try:
                subprocess.run(["npm", "--version"], check=True, capture_output=True, shell=True)
                cmd = ["npm", "run", "dev"]
            except (subprocess.CalledProcessError, FileNotFoundError):
                try:
                    subprocess.run(["bun", "--version"], check=True, capture_output=True, shell=True)
                    cmd = ["bun", "run", "dev"]
                except (subprocess.CalledProcessError, FileNotFoundError):
                    print("⚠️  Neither npm nor bun found. Skipping frontend startup.")
                    return
        else:
            # On Unix, try npm first
            try:
                subprocess.run(["npm", "--version"], check=True, capture_output=True)
                cmd = ["npm", "run", "dev"]
            except (subprocess.CalledProcessError, FileNotFoundError):
                try:
                    subprocess.run(["bun", "--version"], check=True, capture_output=True)
                    cmd = ["bun", "run", "dev"]
                except (subprocess.CalledProcessError, FileNotFoundError):
                    print("⚠️  Neither npm nor bun found. Skipping frontend startup.")
                    return
        
        # Start frontend in a subprocess
        frontend_process = subprocess.Popen(
            cmd,
            cwd=str(frontend_dir),
            shell=(platform.system() == "Windows"),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        # Print frontend output in a separate thread
        def print_frontend_output():
            if frontend_process and frontend_process.stdout:
                for line in iter(frontend_process.stdout.readline, ''):
                    if line:
                        line_clean = line.rstrip()
                        # Color code different types of frontend messages
                        if "Ready" in line_clean or "ready" in line_clean:
                            print(f"{Colors.GREEN}[Frontend]{Colors.RESET} {line_clean}")
                        elif "Error" in line_clean or "error" in line_clean or "Failed" in line_clean:
                            print(f"{Colors.RED}[Frontend]{Colors.RESET} {line_clean}")
                        elif "Compiling" in line_clean or "compiling" in line_clean:
                            print(f"{Colors.BLUE}[Frontend]{Colors.RESET} {line_clean}")
                        elif "Local:" in line_clean or "Network:" in line_clean:
                            print(f"{Colors.CYAN}[Frontend]{Colors.RESET} {line_clean}")
                        else:
                            print(f"{Colors.GRAY}[Frontend]{Colors.RESET} {line_clean}")
        
        output_thread = Thread(target=print_frontend_output, daemon=True)
        output_thread.start()
        
    except Exception as e:
        print(f"⚠️  Error starting frontend: {e}")
        print("   Backend will continue to run without frontend.")

def cleanup_processes():
    """Clean up frontend process on exit"""
    global frontend_process
    if frontend_process:
        try:
            if platform.system() == "Windows":
                frontend_process.terminate()
            else:
                frontend_process.send_signal(signal.SIGTERM)
            frontend_process.wait(timeout=5)
        except Exception:
            try:
                frontend_process.kill()
            except Exception:
                pass

# Register cleanup handler
def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print("\n\n🛑 Shutting down servers...")
    cleanup_processes()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
if platform.system() != "Windows":
    signal.signal(signal.SIGTERM, signal_handler)

# Now safe to import uvicorn and other modules
import uvicorn

if __name__ == "__main__":
    print_header("RoleWithAI - Backend & Frontend", "═")
    
    print_header("Starting Backend Server")
    print_status(f"Backend API: {Colors.BOLD}{Colors.GREEN}http://localhost:8000{Colors.RESET}", "info")
    print_status(f"API Documentation: {Colors.BOLD}{Colors.GREEN}http://localhost:8000/docs{Colors.RESET}", "info")
    print_status("Initializing FastAPI application...", "loading")
    
    # Start frontend in a separate thread (will wait for backend)
    frontend_thread = Thread(target=start_frontend, daemon=True)
    frontend_thread.start()
    
    print(f"\n{Colors.BOLD}{Colors.YELLOW}💡 Press Ctrl+C to stop both servers{Colors.RESET}\n")
    
    try:
        # Use import string for reload to work properly
        # Only watch the backend directory, exclude frontend and other parent dirs
        
        # On Windows, use reload-includes instead of reload_dirs for better compatibility
        reload_kwargs = {
            "host": "0.0.0.0",
            "port": 8000,
            "reload": True,
            "reload_excludes": ["*/frontend/*", "*/node_modules/*", "*/.git/*", "*/__pycache__/*", "*/data/*"],
            "log_level": "info"
        }
        
        # Windows-specific reload configuration
        if platform.system() == "Windows":
            # Use reload-includes to only watch app directory
            reload_kwargs["reload_includes"] = ["app/**/*.py"]
        else:
            # On Unix systems, use reload_dirs
            reload_kwargs["reload_dirs"] = [str(backend_dir)]
        
        uvicorn.run(
            "app.main:app",
            **reload_kwargs
        )
    except ImportError as e:
        print(f"❌ Error importing app: {e}")
        print("Make sure you're running from the backend directory and all dependencies are installed.")
        cleanup_processes()
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down servers...")
        cleanup_processes()
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        cleanup_processes()
        sys.exit(1)

