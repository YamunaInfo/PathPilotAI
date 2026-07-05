from flask import Blueprint, jsonify, request
from services.auth_service import decode_token, get_user_by_email
from database.mongodb import get_collection

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")


def success_response(message: str, data=None, status=200):
    payload = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
        for key, value in data.items():
            payload[key] = value
    return jsonify(payload), status


def error_response(message: str, status=400):
    return jsonify({"success": False, "message": message}), status


def get_current_user():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ", 1)[1]
    try:
        payload = decode_token(token)
    except Exception:
        return None
    user_id = payload.get("sub")
    users = get_collection("users")
    if users is None:
        return None
    return users.find_one({"_id": user_id})


@profile_bp.get("")
def get_profile():
    user = get_current_user()
    if not user:
        return error_response("Unauthorized", 401)
    return success_response("Profile loaded", {"user": {
        "id": str(user.get("_id")),
        "fullName": user.get("fullName"),
        "email": user.get("email"),
        "phone": user.get("phone"),
        "state": user.get("state"),
        "occupation": user.get("occupation"),
    }})


@profile_bp.put("")
def update_profile():
    user = get_current_user()
    if not user:
        return error_response("Unauthorized", 401)

    payload = request.get_json(silent=True) or {}
    updates = {}
    for key in ["fullName", "phone", "state", "occupation"]:
        if key in payload:
            updates[key] = payload[key]

    if not updates:
        return error_response("No updates provided")

    users = get_collection("users")
    if users is None:
        return error_response("Profile service unavailable", 500)

    users.update_one({"_id": user.get("_id")}, {"$set": updates})
    refreshed = users.find_one({"_id": user.get("_id")})
    return success_response("Profile updated", {"user": {
        "id": str(refreshed.get("_id")),
        "fullName": refreshed.get("fullName"),
        "email": refreshed.get("email"),
        "phone": refreshed.get("phone"),
        "state": refreshed.get("state"),
        "occupation": refreshed.get("occupation"),
    }})
