from flask import jsonify, request, Blueprint, current_app
from models import Article, User
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

article_bp = Blueprint("article", __name__)

@article_bp.route("/add_article", methods=["POST"])
@jwt_required()
def add_article():
    identity = get_jwt_identity() or {}
    current_app.logger.info("JWT identity: %s", identity)

   
    if identity.get("role") != "admin":
        return jsonify({"error": "you are not an admin so you can't post anything"}), 401

    data = request.get_json() or {}
    required = ["title", "excerpt", "read_time", "content", "category", "tags", "status"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"missing fields: {', '.join(missing)}"}), 400

    
    tags = data.get("tags")
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",") if t.strip()]
    elif isinstance(tags, list):
        tags = [str(t).strip() for t in tags if str(t).strip()]
    else:
        tags = []

    user_id = identity.get("id")
    if not user_id:
        return jsonify({"error": "invalid token: user id missing"}), 401

    new_article = Article(
        user_id=user_id,
        title=data.get("title"),
        status=data.get("status", "draft"),
        excerpt=data.get("excerpt"),
        category=data.get("category"),
        read_time=data.get("read_time", "0 min read"),
        image=data.get("image"),
        author=identity.get("user"),
        author_avatar=identity.get("avatar"),
        content=data.get("content"),
        tags=tags,
    )

    try:
        db.session.add(new_article)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.exception("Failed to save article")
        return jsonify({"error": "failed to save article", "detail": str(e)}), 500

    
    return jsonify({
        "message": "article created",
        "article_id": new_article.id
    }), 201
