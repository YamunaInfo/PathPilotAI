from flask import Blueprint, jsonify, request
from services.process_service import get_all_processes, get_process_by_id, search_processes

process_bp = Blueprint("process", __name__, url_prefix="/api/processes")


def success_response(message: str, data=None, status=200):
    payload = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
        for key, value in data.items():
            payload[key] = value
    return jsonify(payload), status


def error_response(message: str, status=400):
    return jsonify({"success": False, "message": message}), status


@process_bp.get("")
def list_processes():
    query = request.args.get("q", "").strip()
    if query:
        processes = search_processes(query)
    else:
        processes = get_all_processes()
    return success_response("Processes loaded", {"processes": processes})


@process_bp.get("/<process_id>")
def get_process(process_id: str):
    process_doc = get_process_by_id(process_id)
    if not process_doc:
        return error_response("Process not found", 404)
    return success_response("Process loaded", {"process": process_doc})
