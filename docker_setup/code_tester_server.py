from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

# Paths inside the container
USER_CODE_PATH = '/app/temp_code.c'        # Path to the user's C code
UNIT_TEST_EXPRESSION_PATH = '/app/unit-test-expression.c'
UNIT_TEST_NAV_PATH = '/app/unit-test-nav.c'        
UNIT_TEST_STACK_PATH = '/app/unit-test-stack.c'
UNIT_TEST_STATE_PATH = '/app/unit-test-state.c'
UNITY_PATH = '/app/unity/unity.c'          # Path to Unity C file
UNITY_INCLUDE_PATH = '/app/unity/'         # Path to Unity headers (e.g., unity.h)
TEST_BINARY_PATH = '/app/test_binary'      # Path to compiled binary

@app.route('/submit_code', methods=['POST'])
def submit_code():
    # Get the submitted C code as a string from the POST request
    data = request.get_json()
    code = data.get('code', '')
    tests_to_run = data.get('tests_to_run', '')
    if not code:
        return jsonify({"error": "No C code provided"}), 400
    # Save the user's C code to a temporary file
    with open(USER_CODE_PATH, 'w') as f:
        f.write(code)
    # Compile the user's code along with the unit test file and Unity
    if tests_to_run == "expression":
        UNIT_TEST_PATH = UNIT_TEST_EXPRESSION_PATH
    elif tests_to_run == "nav":
        UNIT_TEST_PATH = UNIT_TEST_NAV_PATH
    elif tests_to_run == "stack":
        UNIT_TEST_PATH = UNIT_TEST_STACK_PATH
    elif tests_to_run == "state":
        UNIT_TEST_PATH = UNIT_TEST_STATE_PATH
    else:
        return jsonify({"error": f"{tests_to_run} unit test does not exist"})
    compile_command = ['gcc', USER_CODE_PATH, UNIT_TEST_PATH, UNITY_PATH, '-o', TEST_BINARY_PATH, f'-I{UNITY_INCLUDE_PATH}']
    compile_result = subprocess.run(compile_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if compile_result.returncode != 0:
        return jsonify({
            "error": "Compilation failed",
            "details": compile_result.stderr.decode()
        }), 400
    # Run the compiled binary (which contains the Unity tests)
    test_result = subprocess.run([TEST_BINARY_PATH], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return jsonify({
        "test_output": test_result.stdout.decode(),
        "test_errors": test_result.stderr.decode()
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
