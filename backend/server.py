from flask import Flask, jsonify, request

import random
import json
import torch
from  modelTraining.model import NeuralNet
from modelTraining.nltk_utils import tokenize,stem,bagOfWords

app = Flask(__name__)
# Make sure the device supports CUDA
device = torch.device('cuda' if torch.cuda.is_available() else "cpu")

# Load intents and model data
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

botName = "Shane"

# Define the /chat endpoint to interact with the chatbot
@app.route('/chat', methods=['POST'])
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
        # Loop through all tags in intents and check if it fits
        for intent in intents["intents"]:
            if tag == intent["tag"]:
                response = random.choice(intent['responses'])
                return jsonify({"bot": botName, "response": response})
    else:
        return jsonify({"bot": botName, "response": "I do not understand..."})




if __name__ == '__main__':

    app.run(debug=True, port=5050)