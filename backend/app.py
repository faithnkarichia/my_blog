from extensions import db,jwt,migrate,bcrypt

from flask import Flask
from flask_cors import CORS


app=Flask(__name__)

CORS(app, origin=["http://localhost:5173"])
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.config['JWT_SECRET_KEY']="dwfhwrtyhmmmwydopbghdtekndvklavdfterhnvbbckoudghrtyc"


db.init_app(app)
jwt.init_app(app)
migrate.init_app(app,db)
bcrypt.init_app(app)

from views import user_bp

app.register_blueprint(user_bp)

@app.route("/")
def home():
    return "Your Flask app is running"

if __name__=='__main__':
    app.run(debug=True)