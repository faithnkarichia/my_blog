from extensions import db,jwt,migrate,bcrypt

from flask import Flask
from flask_cors import CORS
from datetime import timedelta


app=Flask(__name__)

# CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)


app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.config['JWT_SECRET_KEY']="dwfhwrtyhmmmwydopbghdtekndvklavdfterhnvbbckoudghrtyc"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1) 

db.init_app(app)
jwt.init_app(app)
migrate.init_app(app,db)
bcrypt.init_app(app)

from views import user_bp,article_bp,comment_bp


app.register_blueprint(user_bp)
app.register_blueprint(article_bp)
app.register_blueprint(comment_bp)

@app.route("/")
def home():
    return "Your Flask app is running"

if __name__=='__main__':
    app.run(debug=True)