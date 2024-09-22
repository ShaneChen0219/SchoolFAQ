from flask import Blueprint, jsonify, request
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
from werkzeug.security import check_password_hash

authBlueprint = Blueprint("userAuth", __name__)

#Get MongoDB URI from environment variable
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI,server_api=ServerApi('1'))
db = client.get_database("SchoolFaqUser")
usersCollection = db.get_collection("users")

@authBlueprint.route("/api/login",methods = ['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = usersCollection.find_one({"email": email})
    if user and check_password_hash(user.get("password"), password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401