from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.chat import chatBlueprint
from routes.userAuth import authBlueprint
from routes.userCreate import userCreateBlueprint
from dotenv import load_dotenv


app = Flask(__name__)
load_dotenv(dotenv_path="../backend/.env")
# Register the blueprints
app.register_blueprint(chatBlueprint)
app.register_blueprint(authBlueprint)
app.register_blueprint(userCreateBlueprint)

CORS(app) 
if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True, port=8080)