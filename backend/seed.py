from app import app, db, bcrypt  # include bcrypt
from models import User, Article, Comment
from datetime import datetime

# Run inside the Flask app context
with app.app_context():
    # Optional: clear existing data (use only in testing!)
    db.drop_all()
    db.create_all()

    # --- USERS ---
    user1 = User(
        full_name="Faith Nkarichia",
        email="faith@example.com",
        password=bcrypt.generate_password_hash("123456").decode("utf-8"),  # 🔒 hashed
        role="admin",
        avatar="faith_avatar.png"  # 🆕 added avatar
    )

    user2 = User(
        full_name="John Doe",
        email="john@example.com",
        password=bcrypt.generate_password_hash("password").decode("utf-8"),  # 🔒 hashed
        role="normal_user",
        avatar="john_avatar.png"  # 🆕 added avatar
    )

    # --- ARTICLES ---
    article1 = Article(
        user=user1,
        title="Learn Flask in a Day",  # 🆕 added title
        status="published",            # 🆕 added status
        excerpt="Learn Flask in a Day",
        category="Backend",
        read_time="5 min",
        image="flask_basics.jpg",
        author="Faith Nkarichia",
        author_avatar="faith_avatar.png",
        content="Flask is a lightweight web framework for Python. This article covers how to get started...",
        tags=["Flask", "Python", "Web Development"],
        likes=12,
        liked=True,
    )

    article2 = Article(
        user=user2,
        title="Mastering CSS Grid Layout",  # 🆕 added title
        status="draft",                     # 🆕 added status
        excerpt="Mastering CSS Grid Layout",
        category="CSS",
        read_time="6 min",
        image="css_grid.png",
        author="John Doe",
        author_avatar="john_avatar.png",
        content="CSS Grid makes web layouts easier than ever. In this guide, we'll explore the basics of creating responsive designs...",
        tags=["CSS", "Frontend", "Web Design"],
        likes=8,
        liked=False,
    )

    # --- COMMENTS ---
    comment1 = Comment(
        article=article1,
        user=user2,
        avatar="john_avatar.png",
        content="Awesome guide, Faith! I learned a lot.",
        likes=4,
        replies=[
            {"user": "Faith", "message": "Thanks, John! Glad it helped."}
        ],
    )

    comment2 = Comment(
        article=article2,
        user=user1,
        avatar="faith_avatar.png",
        content="This is great, John! I love CSS Grid.",
        likes=3,
        replies=[
            {"user": "John", "message": "Thanks, Faith!"}
        ],
    )

    # Add to session
    db.session.add_all([user1, user2, article1, article2, comment1, comment2])
    db.session.commit()

    print("✅ Database seeded successfully with titles, status, avatars, and hashed passwords!")
