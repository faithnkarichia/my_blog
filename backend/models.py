from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)            
    role = db.Column(db.String(50), nullable=False, default="normal_user")
    avatar=db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # relationships
    articles = db.relationship("Article", back_populates="user", cascade="all, delete-orphan")
    comments = db.relationship("Comment", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.email}>"


class Article(db.Model):
    __tablename__ = "articles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    excerpt = db.Column(db.String(1024), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    category = db.Column(
        db.Enum("Frontend", "Backend", "CSS", "JavaScript", "Web Development", "DevOps", name="article_categories"),
        default="Web Development",
        nullable=False,
    )

    read_time = db.Column(db.String(50), nullable=False, default="0 min read")
    image = db.Column(db.String(255), nullable=True)
    author = db.Column(db.String(100), nullable=True)
    author_avatar = db.Column(db.String(255), nullable=True)
    content = db.Column(db.Text, nullable=False)
    title= db.Column(db.String(300), nullable= False)
    status=db.Column(db.String, nullable=False)

    likes = db.Column(db.Integer, default=0, nullable=False)
    liked = db.Column(db.Boolean, default=False, nullable=False)
    stats=db.Column(db.Integer, nullable=True)

    tags = db.Column(db.JSON, default=list)

    # relationships
    user = db.relationship("User", back_populates="articles")
    comments = db.relationship("Comment", back_populates="article", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Article {self.id} by {self.author}>"
    



    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "excerpt": self.excerpt,
            "date": self.date.isoformat() if self.date else None,
            "category": self.category,
            "read_time": self.read_time,
            "image": self.image,
            "author": self.author,
            "author_avatar": self.author_avatar,
            "content": self.content,
            "status": self.status,
            "likes": self.likes,
            "liked": self.liked,
            "stats": self.stats,
            "tags": self.tags,
            
            "comments": [comment.to_dict() for comment in self.comments] if self.comments else []
        }




class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    article_id = db.Column(db.Integer, db.ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    avatar = db.Column(db.String(255), nullable=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    likes = db.Column(db.Integer, default=0, nullable=False)

    replies = db.Column(db.JSON, default=list)

    # relationships
    user = db.relationship("User", back_populates="comments")
    article = db.relationship("Article", back_populates="comments")

    def __repr__(self):
        return f"<Comment {self.id} on article {self.article_id}>"
    

    def to_dict(self, include_user: bool = False):
        data = {
            "id": self.id,
            "article_id": self.article_id,
            "user_id": self.user_id,
            "avatar": self.avatar,
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "likes": self.likes,
            "replies": self.replies if self.replies is not None else [],
        }

        if include_user and self.user:
            data["user"] = {
                "id": getattr(self.user, "id", None),
                "full_name": getattr(self.user, "full_name", None),
                "email": getattr(self.user, "email", None),         
                "avatar": getattr(self.user, "avatar", None),
               
            }

        return data
