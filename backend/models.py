from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

from extensions import db


class User(db.Model, SerializerMixin):
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


class Article(db.Model, SerializerMixin):
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

    read_time = db.Column(db.String(50), nullable=False)
    image = db.Column(db.String(255), nullable=True)
    author = db.Column(db.String(100), nullable=True)
    author_avatar = db.Column(db.String(255), nullable=True)
    content = db.Column(db.Text, nullable=True)

    likes = db.Column(db.Integer, default=0, nullable=False)
    liked = db.Column(db.Boolean, default=False, nullable=False)

    # Use JSON to store tags (portable across DBs). If you're using Postgres you can change to ARRAY.
    tags = db.Column(db.JSON, default=list)

    # relationships
    user = db.relationship("User", back_populates="articles")
    comments = db.relationship("Comment", back_populates="article", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Article {self.id} by {self.author}>"


class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    article_id = db.Column(db.Integer, db.ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    avatar = db.Column(db.String(255), nullable=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    likes = db.Column(db.Integer, default=0, nullable=False)

    # replies: store as JSON list of reply objects (portable). Or make a Reply model if replies need more structure.
    replies = db.Column(db.JSON, default=list)

    # relationships
    user = db.relationship("User", back_populates="comments")
    article = db.relationship("Article", back_populates="comments")

    def __repr__(self):
        return f"<Comment {self.id} on article {self.article_id}>"
