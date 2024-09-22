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

CORS(app, origins="http://localhost:3000") 
if __name__ == '__main__':

    app.run(debug=True, port=5050)