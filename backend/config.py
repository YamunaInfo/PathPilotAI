import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "pathpilot-dev-secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "pathpilot-jwt-secret")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    MONGO_URI = os.getenv("MONGO_URI", "")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    CHROMA_PERSIST_DIRECTORY = os.getenv("CHROMA_PERSIST_DIRECTORY", os.path.join(os.path.dirname(__file__), "database", "chroma_store"))
    CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "pathpilot")
