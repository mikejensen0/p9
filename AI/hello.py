import google.generativeai as genai
import os
import requests  # Import requests to handle HTTP requests to the Docker container
from flask import Flask, jsonify, request, render_template
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Setup the chat model (as in your original `hello.py`)
genai.configure(api_key=os.getenv("API_KEY", None))
model = genai.GenerativeModel("gemini-1.5-flash")

chat = model.start_chat(
    history=[
        {"role": "user", "parts": "You are a coding assistant..."},
        {"role": "model", "parts": "Okay, i can do that"},
    ]
)

@app.route('/reset_chat', methods=['POST'])
def reset_chat():
    global chat
    chat = model.start_chat(
        history=[
            {"role": "user", "parts": "You are a coding assistant you specialize in supporting user write code, furthermore when the user asks for code you will not give the full code you will only give a subset of the code. For example a single function, and then throuhg several promps you will provide the whole code to the user."},
            {"role": "model", "parts": "Okay, I can do that"},
        ]
    )
    return jsonify({"message": "Chat reset successfully."})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/post_message', methods=['POST'])
def post_message():
    data = request.json
    received_message = data.get('message')
    response = chat.send_message(received_message)
    return jsonify({'response': response.text})

@app.route('/submit_code_intermediary', methods=['POST'])
def submit_code_intermediary():
    # Get the C code from the JavaScript request
    data = request.json
    code = data.get('code')
    
    if 'main (' in code or 'main(' in code:
        return jsonify({"error": "Do not include a main function in your code submission"}), 400

    # Send the C code to the Docker container (where Flask API is running)
    docker_url = 'http://localhost:5000/submit_code'  # Docker Flask server URL

    response = requests.post(docker_url, json={'code': code})

    # Return the result from the Docker Flask server back to the frontend
    return jsonify(response.json())

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "running"}), 200

if __name__ == '__main__':
    app.run(debug=True)
