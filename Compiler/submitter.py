import requests

# The URL of the running container
url = 'http://localhost:5000/submit_code'

# Example C code to be tested
c_code = """
int add(int a, int b) {
    return a + b;
}
"""

# Sending the C code to the container
response = requests.post(url, json={'code': c_code})

# Print the response (test output or errors)
print(response.json())
