 // Initialize an empty array to store messages and responses
 let messages = [];

 document.addEventListener("DOMContentLoaded", () => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
        updateMessageList();
    }
    
});

function checkServerStatus() {
   
    fetch('/status')
        .then(response => {
            if (!response.ok) {
                throw new Error('Server is down');
            }
        })
        .catch(error => {
            localStorage.clear()
        });
}

function postMessage() {
    // Get the value from the input field
    const messageToSend = document.getElementById('messageInput').value;

    // Only proceed if there's text in the input
    if (messageToSend.trim() !== "") {
        // Clear the input field after submitting
        document.getElementById("messageInput").value = "";

        // Add the user message temporarily to the array (before getting server response)
        messages.push({ user: messageToSend, response: null });

        // Update the list of messages displayed
        updateMessageList();

        // Send the message to the server
        fetch('/post_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageToSend })
        })
        .then(response => response.json())
        .then(data => {
            // Update the last message in the array with the server response
            messages[messages.length - 1].response = data.response;

            // Update the list of messages displayed with the server response included
            updateMessageList();
        })
        .catch(error => console.log('Error:', error));
    }
}

function postBigMessage() {
    const bigMessageToSend = document.getElementById('bigMessageInput').value;
    const url = '/submit_code_intermediary';  // This points to hello.py, not directly to Docker

    if (bigMessageToSend.trim() !== "") {
        console.log("Big message submitted:", bigMessageToSend);

        // Sending the C code to the Python intermediary server
        axios.post(url, { code: bigMessageToSend })
            .then(response => {
                // Print the response (test output or errors)
                console.log(response.data);
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error.response ? error.response.data : error.message);
            });
    }
}


function updateMessageList() {
    // Get the element where messages are displayed
    const displayMessagesElement = document.getElementById("displayMessages");

    // Clear the current list
    displayMessagesElement.innerHTML = "";

    // Create a new paragraph for each user message and server response
    messages.forEach((msgObj) => {
        // Display the user message
        const userMessageElement = document.createElement("p");
        userMessageElement.innerText = msgObj.user;
        displayMessagesElement.appendChild(userMessageElement);

        // If there's a server response, display it
        if (msgObj.response) {
            const responseMessageElement = document.createElement("p");
            responseMessageElement.innerText = msgObj.response;
            responseMessageElement.style.color = "#4a90e2"; // Optional: Different color for server response
            displayMessagesElement.appendChild(responseMessageElement);
        }
    });

    // Scroll to the bottom of the messages container
    displayMessagesElement.scrollTop = displayMessagesElement.scrollHeight;

    localStorage.setItem("chatMessages", JSON.stringify(messages));
setInterval(checkServerStatus, 5000);
}