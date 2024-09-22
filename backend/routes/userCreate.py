from flask import Blueprint, jsonify, request
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os

userCreateBlueprint = Blueprint('users', __name__)
#Get MongoDB URI from environment variable
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI,server_api=ServerApi('1'),w=1)
db = client.get_database("SchoolFaqUser")
usersCollection = db.users

# Define the /api/users endpoint to create a user
@userCreateBlueprint.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Validate input
    if not email or not password:
        return jsonify({"message": "Email, password, and name are required"}), 400

    # Check if user already exists
    existingUser = usersCollection.find_one({"email": email})
    if existingUser:
        return jsonify({"message": "User already exists"}), 400

    # Hash the password
    hashedPassword = generate_password_hash(password)

    # Insert new user into MongoDB
    usersCollection.insert_one({
        "email": email,
        "password": hashedPassword,
    })

    return jsonify({"message": "User created successfully"}), 201
