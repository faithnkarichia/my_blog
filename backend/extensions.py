from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy


db=SQLAlchemy()
jwt=JWTManager()
migrate=Migrate()
bcrypt=Bcrypt()