"""
Utility functions
"""
try:
    # Try cuid2 v2.x API first
    from cuid2 import Cuid
    _cuid_instance = Cuid()
    def generate_id() -> str:
        return _cuid_instance.generate()
except (ImportError, AttributeError):
    try:
        # Try cuid2 v1.x API
        import cuid2
        def generate_id() -> str:
            return cuid2.cuid()
    except (ImportError, AttributeError):
        # Fallback to UUID if cuid2 is not available
        import uuid
        def generate_id() -> str:
            return str(uuid.uuid4())

