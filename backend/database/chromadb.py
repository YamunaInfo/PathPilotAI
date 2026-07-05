import os
import logging
from typing import Optional
import chromadb
from chromadb.config import Settings
from config import Config

logger = logging.getLogger(__name__)

client: Optional[chromadb.Client] = None
collection = None


def initialize_vector_store():
    global client, collection
    try:
        client = chromadb.PersistentClient(path=Config.CHROMA_PERSIST_DIRECTORY)
        collection = client.get_or_create_collection(name=Config.CHROMA_COLLECTION_NAME)
        logger.info("ChromaDB ready")
    except Exception as exc:
        logger.exception("ChromaDB initialization failed: %s", exc)
        client = None
        collection = None


def get_collection():
    return collection


def add_documents(documents, metadatas, ids):
    if collection is None:
        return False
    collection.add(documents=documents, metadatas=metadatas, ids=ids)
    return True


def query_documents(query_text: str, n_results: int = 4):
    if collection is None:
        return []
    results = collection.query(query_texts=[query_text], n_results=n_results)
    return results
