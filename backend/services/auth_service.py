import logging
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
from bson import ObjectId
from config import Config
from database.mongodb import get_collection

logger = logging.getLogger(__name__)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)


def decode_token(token: str):
    return jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])


def _normalize_id(value: str):
    try:
        return ObjectId(str(value))
    except Exception:
        return str(value)


def get_user_by_email(email: str):
    users = get_collection("users")
    if users is None:
        return None
    return users.find_one({"email": email.lower()})


def create_user(payload: dict):
    users = get_collection("users")
    if users is None:
        return None
    user_doc = {
        "fullName": payload["fullName"],
        "email": payload["email"].lower(),
        "phone": payload["phone"],
        "state": payload["state"],
        "occupation": payload["occupation"],
        "password": hash_password(payload["password"]),
    }
    result = users.insert_one(user_doc)
    user_doc["id"] = str(result.inserted_id)
    user_doc["_id"] = str(result.inserted_id)
    return user_doc


def get_user_by_id(user_id: str):
    users = get_collection("users")
    if users is None:
        return None
    return users.find_one({"_id": _normalize_id(user_id)})


def update_user_profile(user_id: str, updates: dict):
    users = get_collection("users")
    if users is None:
        return None
    users.update_one({"_id": _normalize_id(user_id)}, {"$set": updates})
    return users.find_one({"_id": _normalize_id(user_id)})
