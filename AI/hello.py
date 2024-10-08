import google.generativeai as genai
import os
from flask import Flask, jsonify, request, render_template
from dotenv import load_dotenv

load_dotenv()
#from flask_cors import CORS

app = Flask(__name__)
#CORS(app) 
genai.configure(api_key=os.getenv("API_KEY", None))
model = genai.GenerativeModel("gemini-1.5-flash")

chat = model.start_chat(
    history=[
        {"role": "user", "parts": "You are a coding assistant you specialize in supporting user write code, furthermore when the user asks for code you will not give the full code you will only give a subset of the code. For example a single function, and then throuhg several promps you will provide the whole code to the user."},
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
    
    return jsonify({'response':  response.text})

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "running"}), 200

if __name__ == '__main__':
    app.run(debug=True)
