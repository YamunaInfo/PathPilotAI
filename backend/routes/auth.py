from flask import Blueprint, jsonify, request
from services.auth_service import create_token, create_user, get_user_by_email, verify_password

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def success_response(message: str, data=None, status=200):
    payload = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
        for key, value in data.items():
            payload[key] = value
    return jsonify(payload), status


def error_response(message: str, status=400):
    return jsonify({"success": False, "message": message}), status


@auth_bp.post("/register")
def register():
    payload = request.get_json(silent=True) or {}
    required = ["fullName", "email", "phone", "state", "occupation", "password"]
    if not all(field in payload for field in required):
        return error_response("Please provide all required fields")

    if get_user_by_email(payload["email"]):
        return error_response("User already exists")

    if len(payload["password"]) < 6:
        return error_response("Password must be at least 6 characters")

    created = create_user(payload)
    if not created:
        return error_response("Unable to register user right now", 500)

    token = create_token(str(created["id"]))
    user_data = {
        "id": created["id"],
        "fullName": created["fullName"],
        "email": created["email"],
        "phone": created["phone"],
        "state": created["state"],
        "occupation": created["occupation"],
    }
    return success_response("Registration successful", {"token": token, "user": user_data}, 201)


@auth_bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not email or not password:
        return error_response("Email and password are required")

    user = get_user_by_email(email)
    if not user or not verify_password(password, user.get("password", "")):
        return error_response("Invalid email or password")

    token = create_token(str(user["_id"]))
    user_data = {
        "id": str(user.get("_id")),
        "fullName": user.get("fullName"),
        "email": user.get("email"),
        "phone": user.get("phone"),
        "state": user.get("state"),
        "occupation": user.get("occupation"),
    }
    return success_response("Login successful", {"token": token, "user": user_data})
