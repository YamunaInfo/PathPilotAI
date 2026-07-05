import logging
import uuid
from types import SimpleNamespace
from typing import Optional
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from config import Config

logger = logging.getLogger(__name__)

client: Optional[MongoClient] = None
mongo_db = None
fallback_db = {}


class InMemoryCollection:
    def __init__(self, name: str):
        self.name = name
        self._documents = []

    def _matches(self, document: dict, query: dict) -> bool:
        for key, value in query.items():
            if document.get(key) != value:
                return False
        return True

    def insert_one(self, document: dict):
        document = dict(document)
        document.setdefault("_id", str(uuid.uuid4()))
        self._documents.append(document)
        return SimpleNamespace(inserted_id=document["_id"])

    def insert_many(self, documents):
        inserted_ids = []
        for document in documents:
            inserted = self.insert_one(document)
            inserted_ids.append(inserted.inserted_id)
        return SimpleNamespace(inserted_ids=inserted_ids)

    def find_one(self, query: Optional[dict] = None):
        query = query or {}
        for document in self._documents:
            if self._matches(document, query):
                return document
        return None

    def find(self, query: Optional[dict] = None):
        query = query or {}
        return [document for document in self._documents if self._matches(document, query)]

    def count_documents(self, query: Optional[dict] = None):
        return len(self.find(query))

    def update_one(self, query: dict, update: dict):
        for document in self._documents:
            if self._matches(document, query):
                if "$set" in update:
                    document.update(update["$set"])
                return SimpleNamespace(modified_count=1)
        return SimpleNamespace(modified_count=0)


def initialize_store():
    global client, mongo_db
    if not Config.MONGO_URI:
        logger.warning("MONGO_URI is not configured. Using local in-memory store.")
        client = None
        mongo_db = None
        return
    try:
        client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
        mongo_db = client.get_default_database()
        logger.info("MongoDB connected")
    except PyMongoError as exc:
        logger.exception("MongoDB connection failed: %s", exc)
        client = None
        mongo_db = None


def get_db():
    return mongo_db if mongo_db is not None else fallback_db


def get_collection(name: str):
    db = get_db()
    if db is None:
        return None
    if isinstance(db, dict):
        if name not in db:
            db[name] = InMemoryCollection(name)
        return db[name]
    return db[name]
