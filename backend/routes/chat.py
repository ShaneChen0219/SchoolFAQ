from flask import Blueprint, jsonify, request
import random
import torch
from modelTraining.model import NeuralNet
from modelTraining.nltk_utils import tokenize, bagOfWords
import json

#Blueprint is a way to modulize reusable components
#chat is the name of the blueprint
#__name__ : the module of where the blueprint is created
chatBlueprint = Blueprint("chat", __name__)

# Make sure the device supports CUDA
#TODO Eventually will deploy to AWS, instead of using "MPS" use "CUDA" => Linux(VM) doesn't have MPS
device = torch.device('cuda' if torch.cuda.is_available() else "cpu")

with open('./modelTraining/intents.json', 'r') as f:
    intents = json.load(f)
FILE = "./modelTraining/data.pth"
data = torch.load(FILE)

inputSize = data["inputSize"]
hiddenSize = data["hiddenSize"]
outputSize = data["outputSize"]
allWords = data["allWords"]
tags = data["tags"]
modelState = data["modelState"]

# Load the model
model = NeuralNet(inputSize, hiddenSize, outputSize).to(device)
model.load_state_dict(modelState)
model.eval()

botName = "bot"

@chatBlueprint.route('/chat', methods=['POST'])
def chat():
    data = request.json
    sentence = data.get("message")
    
    if not sentence:
        return jsonify({"error": "Please provide a message."}), 400

    # Tokenize the input sentence
    sentence = tokenize(sentence)
    X = bagOfWords(sentence, allWords)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    # Get model predictions
    output = model(X)
    _, predicted = torch.max(output, dim=1)
    tag = tags[predicted.item()]

    # Check the probability is high enough
    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    if prob.item() > 0.75:
        for intent in intents["intents"]:
            if tag == intent["tag"]:
                response = random.choice(intent['responses'])
                return jsonify({"bot": botName, "response": response})
    else:
        return jsonify({"bot": botName, "response": "I do not understand..."})