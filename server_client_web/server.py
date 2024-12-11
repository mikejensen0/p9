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

base_behaviour = [
            {"role": "user", "parts": "You are a coding assistant you specialize in supporting user write c code"},
            {"role": "model", "parts": "Okay, I can do that"},
        ]

mult_response = [
            {"role": "user", "parts": "You are a coding assistant you specialize in supporting user write c code"},
            {"role": "model", "parts": "Okay, I can do that"},
            {"role": "user", "parts": "When the user asks you for code you will always provide more than one way to solve their question in c code"},
            {"role": "model", "parts": "Okay, when the user asks for code i will provide several examples of how they can solve their question in c code"},
            {"role": "user", "parts": "If request to use different coding language comply and then write the code in that langauge but after that go back to writing c code"},
            {"role": "model", "parts": "Okay, when the user asks me to use a different coding language I will provide multiple examples of a solution in that langauge and then go back to writing c code"}
        ]
unfinished_code = [
            {"role": "user", "parts": "You are a coding assistant you specialize in supporting user c code"},
            {"role": "model", "parts": "Okay, I can do that"},
            {"role": "user", "parts": "When the user asks you for code provide a solution as normally but replace the variable types with a placeholder making it clear to the user they need to put in the type from understanding the way the code is used"},
            {"role": "model", "parts": "Okay, when the user asks for code i will provide a solution in c like normal but leave a placeholder on the types to demonstrate to the user they need to fill out the types"},
            {"role": "user", "parts": "If request to use different coding language comply and then write the code in that langauge but after that go back to writing c code"},
            {"role": "model", "parts": "Okay, when the user asks me to use a different coding language I will provide a solution in that language while still putting type placeholders and then go back to writing c code"},
            {"role": "user", "parts": "Do not give hints in your explanation what the type should be"},
            {"role": "model", "parts": "Okay, i will not provide hints about what i think the type should be in my explanation"},
            {"role": "model", "parts": "If asked what the type is tell them you cannot tell them what the type is and that they need to read the code and understand the type"},
            {"role": "model", "parts": "Okay, when they ask what the type is ill tell them that they need to read the code and then understand what the type should be and i can not tell them what the type is"}
        ]
chat = model.start_chat(
    history = base_behaviour
)

index = 0
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
    global index 

    if index == 0: 
        chat = model.start_chat(
        history = base_behaviour
        )
    elif index == 1: 
        chat = model.start_chat(
        history = base_behaviour
        )
    elif index == 2:
        chat = model.start_chat(
        history = mult_response
        )
    elif index == 3:
        chat = model.start_chat(
        history = unfinished_code
        )
    else:
        return jsonify({"error": "Something went wrong when resetting chat"})
    return jsonify({"message": "Chat reset successfully."})

@app.route('/set_ai_behaviour', methods=['POST'])
def set_ai_behaviour():
    global chat
    global index
    data = request.json
    friction_type = data.get('friction')
    if friction_type == 0: 
        index = 0 
        chat = model.start_chat(
        history = base_behaviour
        )
    elif friction_type == 1: 
        index = 1
        chat = model.start_chat(
        history = base_behaviour
        )
    elif friction_type == 2:
        index = 2
        chat = model.start_chat(
        history = mult_response
        )
    elif friction_type == 3:
        index = 3
        chat = model.start_chat(
        history = unfinished_code
        )
    else:
        return jsonify({"error": "Something went wrong when setting friction behaviour"})
    return jsonify({"message": "Changed friction behaviour"})

@app.route('/write_to_file', methods=['POST'])
def write_to_file():
    data = request.json
    user_code = data.get('codeArray')
    ai_chat = data.get('chatArray')
    active_friction = data.get('frictionArray')
    time_left = data.get('timeLeftArray')

    with open('data/test1.txt', 'w') as file:
        i = 0 
        
        while i < 4:
            if active_friction[i] == 0:
                friction = "base"
            elif active_friction[i] == 1:
                friction = "blur"
            elif active_friction[i] == 2:
                friction = "mult_response"
            elif active_friction[i] == 3:
                friction = "unfinish_code"
            else:
                raise Exception("friction not supported")

            file.write(f"Friction: {friction} \n")
            if time_left[i +1] <= 0:
                file.write(f"Time left: {time_left[i+1]}")
            else:
                file.write(f"Time left: {time_left[i+1]/1000}")
            file.write("Chat for task:\n\n")
            file.write(f"{ai_chat[i]}\n\n")
            file.write("Code for task:\n\n")
            file.write(f"{user_code[i]}\n\n")
            i += 1
    return jsonify({"message": "Wrote to file"})

@app.route('/submit_code_intermediary', methods=['POST'])
def submit_code_intermediary():
    data = request.json
    code = data.get('code')
    tests_to_run = data.get('testsToRun')
    if 'main (' in code or 'main(' in code:
        return jsonify({"error": "Do not include a main function in your code submission"}), 400

    docker_url = 'http://localhost:5000/submit_code'

    response = requests.post(docker_url, json={'code': code, 'tests_to_run': tests_to_run})
    
    if "PASS" in response.text and "0 Failures" in response.text:
        status = "pass"
    else:
        status = "fail"
        
    return jsonify({"status": status, "details": response.text})

if __name__ == '__main__':
    app.run(debug=True)
