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
        title="Learn Flask in a Day",  
        status="published",            
        excerpt="Learn Flask in a Day",
        category="Backend",
        read_time="5 min",
        image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        author="Faith Nkarichia",
        author_avatar="faith_avatar.png",

        # 🆕 structured sections instead of single content
        sections=[
            {
                "subtitle": "Introduction to Flask",
                "content": "Flask is a lightweight web framework for Python. It’s simple, flexible, and perfect for beginners."
            },
            {
                "subtitle": "Setting Up the Environment",
                "content": "To get started, install Flask using pip and create your first app with just a few lines of code."
            },
            {
                "subtitle": "Building Your First Route",
                "content": "Routes define the URLs your users can visit. You can use decorators like @app.route('/') to handle requests."
            }
        ],

        # Optional: keep summary content for backwards compatibility
        content="Flask is a lightweight web framework for Python. This article covers how to get started...",
        
        tags=["Flask", "Python", "Web Development"],
        likes=12,
        liked=True,
    )

    article2 = Article(
        user=user2,
        title="Mastering CSS Grid Layout",  
        status="draft",                     
        excerpt="Mastering CSS Grid Layout",
        category="CSS",
        read_time="6 min",
        image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        author="John Doe",
        author_avatar="john_avatar.png",

        # 🆕 structured sections
        sections=[
            {
                "subtitle": "Introduction to CSS Grid",
                "content": "CSS Grid is a powerful tool for creating two-dimensional layouts with rows and columns."
            },
            {
                "subtitle": "Creating Your First Grid",
                "content": "Use display: grid to enable Grid Layout, then define rows and columns with grid-template-rows and grid-template-columns."
            },
            {
                "subtitle": "Responsive Design with Grid",
                "content": "CSS Grid makes responsive layouts easy with the auto-fit and minmax() functions."
            }
        ],

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

    # Add everything to the session
    db.session.add_all([user1, user2, article1, article2, comment1, comment2])
    db.session.commit()

    print("✅ Database seeded successfully with sections, titles, status, avatars, and hashed passwords!")
