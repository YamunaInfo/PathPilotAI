from flask import Blueprint, jsonify, request
from services.rag_service import build_answer

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")


def success_response(message: str, data=None, status=200):
    payload = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
        for key, value in data.items():
            payload[key] = value
    return jsonify(payload), status


def error_response(message: str, status=400):
    return jsonify({"success": False, "message": message}), status


@ai_bp.post("/chat")
def chat():
    payload = request.get_json(silent=True) or {}
    message = (payload.get("message") or "").strip()
    if not message:
        return error_response("Please provide a message")

    reply = build_answer(message)
    return success_response("Response generated", {"reply": reply})
