from flask import Blueprint, jsonify,request
from models import User
from flask_jwt_extended import create_access_token
from extensions import bcrypt,db



user_bp= Blueprint("user", __name__)



@user_bp.route("/login", methods=["POST"])
def login():
    # we actually getting data from the frontend
    data=request.get_json()
    print(data)

    if not data or "email" not in data or "password" not in data:
        return jsonify({"error":"Email or password not available"}),400
        
    # check if that dada exixts in our db
    email=data['email']
    password=data['password']

# we query the db to check if the user is there
    user= User.query.filter_by(email=email).first()
    # if yes generate token and allow access based on the role
    print(user.full_name,"user data")

    if not user :
        return jsonify({"error":"email or password is wrong"}),401
    
    if not bcrypt.check_password_hash(user.password,password):
        return jsonify({"error":"email or password is wrong"}),401



        
    print( "creating jwt token for the  user")
    access_token=create_access_token(
            {"id":user.id , "role":user.role, "user":user.full_name,"avatar":user.avatar}
        )
   
    


    return jsonify({"access_token":access_token}),200



@user_bp.route("/signup", methods=["POST"])
def signup():
    try: 

        data=request.get_json()
        print(data)

        if not data or "name" not in data or "email" not in data or "password" not in data:
            return jsonify({"error":"name, email,role or password is missing"}),400
        name=data["name"]
        email=data["email"]
        password=data["password"]
        # role=data["role"]
        avatar=data["avatar"]
        


        existingUser=User.query.filter_by(email=email).first()

        if existingUser:
            return jsonify({
                "error":"this email already exists in our system"
            }),400
        

        hashed_password=bcrypt.generate_password_hash(password).decode("utf-8")

        newUser=User(
            full_name=name,
            email=email,
            password=hashed_password,
           
            avatar=avatar
            )
        db.session.add(newUser)
        db.session.commit()



        return jsonify({"message":"user created successifully"}),200
    except Exception as e:
        print("asas",e)

  
    

    
    
    