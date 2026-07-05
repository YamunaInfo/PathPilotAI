import os
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.process import process_bp
from routes.ai import ai_bp
from routes.profile import profile_bp
from database.mongodb import initialize_store

PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"


def create_app():
    app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path="")
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.register_blueprint(auth_bp)
    app.register_blueprint(process_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(profile_bp)

    @app.get("/")
    def index_or_health():
        accepts_html = "text/html" in request.headers.get("Accept", "")
        if accepts_html:
            return send_from_directory(FRONTEND_DIR, "index.html")
        return jsonify({"success": True, "message": "PathPilot AI backend is running"})

    @app.get("/health")
    def health_check():
        return jsonify({"success": True, "message": "PathPilot AI backend is running"})

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"success": False, "message": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"success": False, "message": "Internal server error"}), 500

    initialize_store()
    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=False)
