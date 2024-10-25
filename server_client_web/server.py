import google.generativeai as genai
import os
import requests
from flask import Flask, jsonify, request, render_template
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt


load_dotenv()

app = Flask(__name__)

genai.configure(api_key=os.getenv("API_KEY", None))
model = genai.GenerativeModel("gemini-1.5-flash")

initial_history = [
            {"role": "user", "parts": "You are a coding assistant you specialize in supporting user write code"},
            {"role": "model", "parts": "Okay, I can do that"},
        ]

chat = model.start_chat(
    history = initial_history
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "running"}), 200

@app.route('/post_message', methods=['POST'])
@retry(stop=stop_after_attempt(10))
def post_message():
    data = request.json
    received_message = data.get('message')
    response = chat.send_message(received_message)
    return jsonify({'response': response.text})

@app.route('/reset_chat', methods=['POST'])
def reset_chat():
    global chat
    chat = model.start_chat(
        history = initial_history
    )
    return jsonify({"message": "Chat reset successfully."})

@app.route('/submit_code_intermediary', methods=['POST'])
def submit_code_intermediary():
    data = request.json
    code = data.get('code')
    
    if 'main (' in code or 'main(' in code:
        return jsonify({"error": "Do not include a main function in your code submission"}), 400

    docker_url = 'http://localhost:5000/submit_code'

    response = requests.post(docker_url, json={'code': code})
    
    if "PASS" in response.text and "0 Failures" in response.text:
        status = "pass"
    else:
        status = "fail"
        
    return jsonify({"status": status, "details": response.text})

if __name__ == '__main__':
    app.run(debug=True)
