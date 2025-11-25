from flask import jsonify, request, Blueprint, current_app
from models import Article
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

article_bp = Blueprint("article", __name__)

@article_bp.route("/add_article", methods=["POST"])
@jwt_required()
def add_article():
    identity = get_jwt_identity() or {}

    if identity.get("role") != "admin":
        return jsonify({"error": "you are not an admin so you can't post anything"}), 401

    data = request.get_json() or {}
    required = ["title", "excerpt", "read_time", "category", "tags", "status"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"missing fields: {', '.join(missing)}"}), 400

    # handle tags
    tags = data.get("tags")
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",") if t.strip()]
    elif isinstance(tags, list):
        tags = [str(t).strip() for t in tags if str(t).strip()]
    else:
        tags = []

    # handle sections (optional)
    sections = data.get("sections", [])

    new_article = Article(
        user_id=identity.get("id"),
        title=data.get("title"),
        status=data.get("status", "draft"),
        excerpt=data.get("excerpt"),
        category=data.get("category"),
        read_time=data.get("read_time", "0 min read"),
        image=data.get("image"),
        author=identity.get("user"),
        author_avatar=identity.get("avatar"),
        content=data.get("content"),
        sections=sections,   
        tags=tags,
    )

    try:
        db.session.add(new_article)
        db.session.commit()
        return jsonify({"message": "article created", "article_id": new_article.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "failed to save article", "detail": str(e)}), 500


@article_bp.route("/edit_article/<int:article_id>", methods=["PUT"])
@jwt_required()
def edit_article(article_id):
    current_user = get_jwt_identity()
    article = Article.query.get(article_id)

    if not article:
        return jsonify({"error": "this article does not exist in our database"}), 404

    if current_user.get("role") != "admin" and article.user_id != current_user.get("id"):
        return jsonify({"error": "You are not authorized to edit this post"}), 401

    data = request.get_json() or {}

    # tags
    tags = data.get("tags")
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",") if t.strip()]
    elif isinstance(tags, list):
        tags = [str(t).strip() for t in tags if str(t).strip()]
    else:
        tags = article.tags or []

    # update fields
    article.title = data.get("title", article.title)
    article.excerpt = data.get("excerpt", article.excerpt)
    article.category = data.get("category", article.category)
    article.read_time = data.get("read_time", article.read_time)
    article.image = data.get("image", article.image)
    article.content = data.get("content", article.content)
    article.sections = data.get("sections", article.sections)  # 🆕 added
    article.tags = tags
    article.status = data.get("status", article.status)

    try:
        db.session.commit()
        return jsonify({"message": "article updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "failed to update article", "detail": str(e)}), 500


@article_bp.route("/articles", methods=["GET"])
def articles():
    articles = Article.query.all()
    article_list = [article.to_dict() for article in articles]
    return jsonify(article_list), 200


@article_bp.route("/article/<int:article_id>", methods=["GET"])
def get_article(article_id):
    article = Article.query.filter_by(id=article_id).first()
    if not article:
        return jsonify({"error": "There is no article with such id in the database"}), 404
    return jsonify(article.to_dict()), 200


@article_bp.route("/article/<int:article_id>", methods=["DELETE"])
@jwt_required()
def delete_article(article_id):
    identity = get_jwt_identity()
    if identity.get("role") != "admin":
        return jsonify({"error": "You are not an admin so you can never delete an article"}), 403

    article = Article.query.filter_by(id=article_id).first()
    if not article:
        return jsonify({"error": "There is no article with such id"}), 404

    db.session.delete(article)
    db.session.commit()
    return jsonify({"message": f"article {article_id} deleted successfully"}), 200


@article_bp.route("/published_articles", methods=["GET"])
def published_articles():
    published = Article.query.filter_by(status="published").all()
    return jsonify([article.to_dict() for article in published]), 200
