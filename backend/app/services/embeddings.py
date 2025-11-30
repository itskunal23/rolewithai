"""
Local embeddings using sentence-transformers
"""
import numpy as np
from typing import List, Optional
from sentence_transformers import SentenceTransformer
from app.core.config import settings
import pickle
import base64

class EmbeddingService:
    """Generate and manage embeddings using sentence-transformers"""
    
    def __init__(self):
        self.model_name = settings.EMBEDDING_MODEL
        self.dimension = settings.EMBEDDING_DIM
        self._model = None
    
    @property
    def model(self) -> SentenceTransformer:
        """Lazy load the embedding model"""
        if self._model is None:
            self._model = SentenceTransformer(self.model_name)
        return self._model
    
    def encode(self, texts: List[str]) -> np.ndarray:
        """
        Generate embeddings for a list of texts
        
        Args:
            texts: List of text strings
            
        Returns:
            Numpy array of embeddings (n_texts, dimension)
        """
        if not texts:
            return np.array([])
        
        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        return embeddings
    
    def encode_single(self, text: str) -> np.ndarray:
        """Generate embedding for a single text"""
        return self.encode([text])[0]
    
    def similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """
        Calculate cosine similarity between two embeddings
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
            
        Returns:
            Cosine similarity score (0-1)
        """
        return float(np.dot(embedding1, embedding2))
    
    def encode_to_blob(self, texts: List[str]) -> bytes:
        """
        Encode texts and convert to binary blob for database storage
        
        Args:
            texts: List of text strings
            
        Returns:
            Pickled numpy array as bytes
        """
        embeddings = self.encode(texts)
        return pickle.dumps(embeddings)
    
    def decode_from_blob(self, blob: bytes) -> np.ndarray:
        """
        Decode embeddings from database blob
        
        Args:
            blob: Pickled numpy array
            
        Returns:
            Numpy array of embeddings
        """
        return pickle.loads(blob)
    
    def encode_to_base64(self, texts: List[str]) -> str:
        """Encode to base64 string for JSON storage"""
        blob = self.encode_to_blob(texts)
        return base64.b64encode(blob).decode('utf-8')
    
    def decode_from_base64(self, b64_str: str) -> np.ndarray:
        """Decode from base64 string"""
        blob = base64.b64decode(b64_str.encode('utf-8'))
        return self.decode_from_blob(blob)

