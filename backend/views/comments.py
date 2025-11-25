from flask import Blueprint, request, jsonify, current_app
from extensions import db
from models import Comment, Article, User  # import Article/User if you want to validate ids
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

comment_bp = Blueprint("comment", __name__)

@comment_bp.route("/comments", methods=["GET"])
def get_comments():
    article_id = request.args.get("article_id", type=int)
    
    if article_id:
        # Filter comments for the specific article
        comments = Comment.query.filter_by(article_id=article_id).all()
    else:
        # Return all comments if no article_id is provided
        comments = Comment.query.all()
    
    return jsonify([c.to_dict() for c in comments]), 200


@comment_bp.route("/comment/<int:comment_id>", methods=["GET"])
def get_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "comment not found"}), 404
    return jsonify(comment.to_dict()), 200


# POST a comment (optionally require auth)
@comment_bp.route("/post_comment", methods=["POST"])
@jwt_required()   # uncomment if you want authenticated posting
def post_comment():
    data = request.get_json() or {}
    # Basic validation
    if not data.get("content") or not data.get("article_id"):
        return jsonify({"error": "missing required fields (article_id and content)"}), 400

    # sanitize/normalize replies: expect list or missing -> []
    raw_replies = data.get("replies", [])
    if raw_replies is None:
        raw_replies = []
    if not isinstance(raw_replies, list):
        # If frontend sends a JSON string for replies, try parsing
        try:
            import json
            raw_replies = json.loads(raw_replies) if isinstance(raw_replies, str) else [raw_replies]
        except Exception:
            raw_replies = []

    # Optionally validate article exists
    article_id = data.get("article_id")
    article = Article.query.get(article_id)
    if not article:
        return jsonify({"error": "article not found"}), 404

    # build the Comment object
    # Adjust fields to match your actual Comment model (article_id vs article relationship)
    new_comment = Comment(
        article_id = article_id,                 # use article=data.get('article') if you use relationship attachment
        user_id = data.get("user_id"),
        avatar = data.get("avatar", ""),
        content = data.get("content"),
        likes = data.get("likes", 0),
        replies = raw_replies
    )

    try:
        db.session.add(new_comment)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.exception("Failed to save comment")
        return jsonify({"error": "failed to save comment", "detail": str(e)}), 500

    return jsonify({"message": "comment added", "comment_id": new_comment.id}), 201

@comment_bp.route("/post_reply", methods=["POST"])
def post_reply():
    data = request.get_json() or {}

    if not data.get("comment_id") or not data.get("content"):
        return jsonify({"error": "missing required fields"}), 400

    # Find parent comment
    parent = Comment.query.get(data["comment_id"])
    if not parent:
        return jsonify({"error": "comment not found"}), 404

    # Construct new reply object (stored inside replies JSON list)
    new_reply = {
        "id": int(datetime.utcnow().timestamp()),  # unique id
        "user_id": data.get("user_id"),
        "user": data.get("user"), 
        "avatar": data.get("avatar", ""),
        "content": data["content"],
        "likes": 0,
        "liked": False,
        "timestamp": datetime.utcnow().isoformat()
    }

    # Ensure replies list exists
    replies = parent.replies or []
    replies.append(new_reply)
    parent.replies = replies

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "failed to save reply", "detail": str(e)}), 500

    return jsonify({"message": "reply added", "reply_id": new_reply["id"]}), 201
