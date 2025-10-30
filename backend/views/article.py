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
    print("taaags",tags)
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

@article_bp.route("/edit_article/<int:article_id>", methods=["PUT"])
@jwt_required()
def edit_article(article_id):
    try: 
        current_user=get_jwt_identity()
        # print("this is the current user",current_user)

        if current_user.get("role") != "admin" and article.user_id != current_user.get("id"):
            return jsonify({"error":"You are not authorized to edit this post"}),401
        
        data=request.get_json()
        print("incoming article data",data)
        
        article=Article.query.get(article_id)
        print("article in the db",article)
        if not article:
            return jsonify({"error":"this article does not exist in our database"}),404
        
        
        user_id=current_user.get("id")
        tags = data.get("tags")
        
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",") if t.strip()]
        elif isinstance(tags, list):
            tags = [str(t).strip() for t in tags if str(t).strip()]
        else:
            tags = article.tags or []

        
            
        article.title=data.get("title", article.title)
        print("article.title after updating",article.title)
        # article.status=data.get("published", "draft", article.status)
        article.excerpt=data.get("excerpt", article.excerpt)
        article.category=data.get("category", article.category)
        article.read_time=data.get("read_time", article.read_time)
        article.image=data.get("image", article.image)
        # article.author=current_user.get("user",article.author)
        # article.author_avatar=current_user.get("avatar", article.author_avatar)
        article.content=data.get("content", article.content)
        article.tags=tags

        try:
            
            db.session.commit()

            return jsonify({"message":"article updated successifully"}),200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "failed to update article", "detail": str(e)}), 500
    except Exception as e:
        print("errorrrr",e)
        return jsonify({"error":str(e)})


# get all the articles
@article_bp.route("/articles", methods=["GET"])
def articles():
    
# first we query the db
    articles=Article.query.all()
    # print(articles)
    article_list=[article.to_dict() for article in articles]
    # print("article_list", article_list)



    return jsonify(article_list),200

# get one article

@article_bp.route("/article/<int:article_id>", methods=["GET"])

def get_article(article_id):
    # query the db
    
    article=Article.query.filter_by(id=article_id).first()
    print(article)
    if not article:
        return jsonify({"error":"There is no article with such id in the database"})

    return jsonify(article.to_dict()),200
# delete an article
@article_bp.route("/article/<int:article_id>", methods=["DELETE"])
@jwt_required()
def delete_article(article_id):
    identity=get_jwt_identity()
    role=identity.get("role")
    if role!="admin":
        return jsonify({"error":"You are not an admin so you can never delete an article"}),403
    
    # get the article
    article=Article.query.filter_by(id=article_id).first()
    if not article:
        return jsonify({"error":"There is no article with such id"}),404
    
    db.session.delete(article)
    db.session.commit()


    return jsonify({"message":f"article{article_id} deleted successifully"}),200


# get all the articles for the client side
@article_bp.route("/published_articles", methods=["GET"])
def published_articles():
    # i want to get the articles that are published only
    all_articles=Article.query.all()

    published=[article.to_dict() for article in all_articles if article.status=="published"]
    # print("publisheeed", published)

    return jsonify(published),200
