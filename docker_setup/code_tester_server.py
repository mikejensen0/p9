from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

# Paths inside the container
USER_CODE_PATH = '/app/temp_code.c'        # Path to the user's C code
UNIT_TEST_PATH = '/app/unit-test.c'        # Path to the pre-defined unit tests
UNITY_PATH = '/app/unity/unity.c'          # Path to Unity C file
UNITY_INCLUDE_PATH = '/app/unity/'         # Path to Unity headers (e.g., unity.h)
TEST_BINARY_PATH = '/app/test_binary'      # Path to compiled binary

@app.route('/submit_code', methods=['POST'])
def submit_code():
    # Get the submitted C code as a string from the POST request
    data = request.get_json()
    code = data.get('code', '')
    somt = data.get('somt', '')
    if not code:
        return jsonify({"error": "No C code provided"}), 400
    # Save the user's C code to a temporary file
    with open(USER_CODE_PATH, 'w') as f:
        f.write(code)
    # Compile the user's code along with the unit test file and Unity
    compile_command = ['gcc', USER_CODE_PATH, UNIT_TEST_PATH, UNITY_PATH, '-o', TEST_BINARY_PATH, f'-I{UNITY_INCLUDE_PATH}']
    compile_result = subprocess.run(compile_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if compile_result.returncode != 0:
        return jsonify({
            "error": "Compilation failed",
            "details": compile_result.stderr.decode()
        }), 400
    # Run the compiled binary (which contains the Unity tests)
    test_result = subprocess.run([TEST_BINARY_PATH], stdout=subprocess.PIPE, stderr=subprocess.PIPE, env={**os.environ, "SOMT_VAR": somt})
    return jsonify({
        "test_output": test_result.stdout.decode(),
        "test_errors": test_result.stderr.decode()
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
