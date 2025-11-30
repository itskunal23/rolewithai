"""Test script to verify imports work correctly"""
import sys
from pathlib import Path

# Simulate what app.py does
backend_dir = Path(__file__).parent.absolute()
parent_dir = str(backend_dir.parent)
print(f"Backend dir: {backend_dir}")
print(f"Parent dir: {parent_dir}")
print(f"Parent in sys.path: {parent_dir in sys.path}")

if parent_dir in sys.path:
    sys.path.remove(parent_dir)
    print("Removed parent from sys.path")

sys.path.insert(0, str(backend_dir))
print(f"Added backend to sys.path: {str(backend_dir) in sys.path}")

print("\nTesting imports...")
try:
    from app.services.pdf_parser import PDFParser
    print("✓ PDFParser imported successfully")
except Exception as e:
    print(f"✗ Failed to import PDFParser: {e}")
    import traceback
    traceback.print_exc()

