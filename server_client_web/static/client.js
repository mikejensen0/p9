let messages = [];

//Used to get locally stored chat with AI if any 
const savedMessages = localStorage.getItem("chatMessages");
if (savedMessages) {
    messages = JSON.parse(savedMessages);
    updateDisplayedMessages();
}

document.getElementById("messageInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter" && event.shiftKey) {

    }
    else if (event.key == "Enter") {
        event.preventDefault(); 
        sendAndRecieveMessageAi(); 
    }
});

function sendAndRecieveMessageAi() {
    const messageToSend = document.getElementById('messageInput').value;
    if (messageToSend.trim() !== "") {
        document.getElementById("messageInput").value = "";
        messages.push({ user: messageToSend, response: null });
        updateDisplayedMessages();
        fetch('/post_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageToSend })
        })
            .then(response => response.json())
            .then(data => {
                messages[messages.length - 1].response = data.response;
                updateDisplayedMessages();
            })
            .catch(error => console.log('Error:', error));
    }
}

function updateDisplayedMessages() {
    const displayMessagesElement = document.getElementById("displayMessages");
    displayMessagesElement.innerHTML = "";
    messages.forEach((msgObj) => {
        const userMessageElement = document.createElement("p");
        userMessageElement.innerText = msgObj.user;
        displayMessagesElement.appendChild(userMessageElement);
        if (msgObj.response) {
            const responseMessageElement = document.createElement("p");
            responseMessageElement.innerText = msgObj.response;
            responseMessageElement.style.color = "#4a90e2"; 
            displayMessagesElement.appendChild(responseMessageElement);
        }
    });
    displayMessagesElement.scrollTop = displayMessagesElement.scrollHeight;
    localStorage.setItem("chatMessages", JSON.stringify(messages));
}


//Main purpose of this is just to clear the local memory if the server is down when a user refreshes
window.addEventListener('beforeunload', function (event) {
    checkServerStatus();
});

document.addEventListener("DOMContentLoaded", function () {
    if (performance.getEntriesByType("navigation")[0].type === "reload") {
        console.log("The page was refreshed.");
        checkServerStatus();
    } else {
        console.log("called resetChat");
        resetChat();
    }
});

function checkServerStatus() {
    fetch('/status')
        .then(response => {
            if (!response.ok && response.status !== 304) {
                throw new Error('Server is down');
            }
        })
        .catch(error => {
            console.log(error)
            localStorage.clear();
        });
}

function resetChatFromButton() {
    let userresponse = confirm("This will reset your chat. Proceed?");
    if (userresponse) {
        resetChat();
    }
    else {
        console.log("abort");
    }
}
function resetChat() {
    fetch('/reset_chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); 
            localStorage.clear();
            location.reload()
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Helper function for submitUserCode()
function toggleClasses(element, condition) {
    if (condition) {
        element.classList.add("pass");
        element.classList.remove("fail");
    } else {
        element.classList.add("fail");
        element.classList.remove("pass");
    }
}

function submitUserCode() {
    const submittedCode = document.getElementById('codeSubmit').value;
    const url = '/submit_code_intermediary';  // This points to server.py, not directly to Docker
    var testArray = [];
    if (submittedCode.trim() !== "") {
        console.log("Code submitted:", submittedCode);

        // Sending the C code to the Python intermediary server to be send to docker server and run
        axios.post(url, { code: submittedCode })
            .then(response => {
                responseString = JSON.stringify(response.data);
                responseString = responseString.split('test_output')[1];
                testArray = responseString.split('test_');

                var i = 1;
                var allTestsDetails = []
                while(i < testArray.length){
                    var currentTestDetails = [];
                    var test = testArray[i];
                    var testDetails = test.split(':');
                    var testName = testDetails[0];
                    var testStatus = testDetails[1].split('\\')[0];
                    currentTestDetails.push(testName, testStatus);
                    if (testStatus === 'FAIL') {
                        var testResults = testDetails[2].split('\\')[0];
                        var testResultsFixed = testResults.replace('Expected ', '').replace(' Was', '').split(' ');
                        testResultsFixed.shift();
                        currentTestDetails.push(testResultsFixed);
                    }

                    allTestsDetails.push(currentTestDetails);
                    i++;
                }
                for(var j = 0; j < allTestsDetails.length; j++){
                    if(allTestsDetails[j][1] === 'FAIL'){
                        console.log('Test: ' + allTestsDetails[j][0] + ' Status: ' + allTestsDetails[j][1] + ' Expected: ' + allTestsDetails[j][2][0] + ' Actual: ' + allTestsDetails[j][2][1]);
                    }
                    else{
                        console.log('Test: ' + allTestsDetails[j][0] + ' Status: ' + allTestsDetails[j][1]);
                    }
                }
                

                const isPass = response.data.status === "pass";

                // pass/fail tags added to html elements. May need to be explicitly retrieved later.
                toggleClasses(testResultWindow, isPass);
            })
    }
}
