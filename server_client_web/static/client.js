let messages = [];
let taskIds = [0,1,2,3]; 
let taskTexts = ["1", "2", "3", "5"];
let frictionIds = [0,1,2,3];
let currentTask = 0;
let currentFriction = 0;
let codeCache = [];
let chatCache = [];
let counter;

//Used to get locally stored chat with AI if any 
const savedMessages = localStorage.getItem("chatMessages");
if (savedMessages) {
    messages = JSON.parse(savedMessages);
    updateDisplayedMessages();
}

document.getElementById('displayMessages').addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'code') {
        event.target.style.color = '#4a90e2';
        event.target.style.textShadow = '0px 0px 0px';
    }
});

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
                const responseAsHtml = marked.parse(data.response);
                /* <P> causes a weird white space in our ai responses at end and start of the 
                   response so this is just added to replace it with an element that does not*/
                const replacedFirstPInHtml = responseAsHtml.replace("<p>", "<span>").replace("</p>", "</span>");
                const responseReversed = replacedFirstPInHtml.split(' ').reverse().join(' ');
                const replacedLastPInHtml = responseReversed.replace("<p>", "<span>").replace("</p>", "</span>");
                const ResponseWithStartEndPReplaced  = replacedLastPInHtml.split(' ').reverse().join(' ')
                messages[messages.length - 1].response = ResponseWithStartEndPReplaced
                updateDisplayedMessages();
            })
            .catch(error => console.log('Error:', error));
    }
}

function updateDisplayedMessages() {
    const displayMessagesElement = document.getElementById("displayMessages");
    displayMessagesElement.innerHTML = "";
    messages.forEach((msgObj) => {
        const userMessageElement = document.createElement("div");
        userMessageElement.innerText = msgObj.user;
        displayMessagesElement.appendChild(userMessageElement);
        if (msgObj.response) {
            const responseMessageElement = document.createElement("div");
            responseMessageElement.innerHTML = msgObj.response;
            responseMessageElement.style.color = "#4a90e2"; 
            displayMessagesElement.appendChild(responseMessageElement);
            const codeElements = responseMessageElement.querySelectorAll('code');
    
            codeElements.forEach((codeElement) => {
                const codeLength = codeElement.textContent.length;
                if(codeLength < 20){
                    codeElement.style.color = '#4a90e2'; 
                    codeElement.style.textShadow = '0px 0px 0px'; 
                }
            });
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
            const displayMessagesElement = document.getElementById("displayMessages");
            displayMessagesElement.innerHTML = "";
            messages = [];
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function setInitialTask(tasks){
    var shuffledIds = randomiser(tasks);
    taskTexts = adjustTaskList(shuffledIds);
    taskIds = shuffledIds;
    assignFrictions(frictionIds);
    selectTask(0);
}

function adjustTaskList(idList) {
    let adjustedTaskList = [];
    let i = 0;

    taskTexts.forEach((task) => {
        adjustedTaskList[idList[i]] = task;
        i++;
    })

    return adjustedTaskList;
}

function randomiser(list){
    let currentIndex = list.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [list[currentIndex], list[randomIndex]] = [list[randomIndex], list[currentIndex]];

        return list;
    }
}

function assignFrictions(frictions){
    randomisedFrictions = randomiser(frictions.slice(1));
    randomisedFrictions.unshift(frictions[0]);
    frictionIds = randomisedFrictions;
}

function selectTask(taskIndex, frictionIndex){
    toggleTasksCode('tasks');
    changeTaskText(taskIndex);
    resetCode();
    changeTaskTests(taskIndex);
    changeTaskChat(taskIndex, frictionIndex);
    countdown(45/4*60*1000);
}

function nextTask() {
    if(currentTask == (taskIds.length - 1) || currentFriction == (frictionIds.length -1)) {
        //End experiment
        stopCountdown(counter);
    }

    if((currentTask + 1) < taskIds.length && (currentFriction + 1) < frictionIds.length) {
        stopCountdown(counter);
        //Pause, make them click begin task
        const beginTaskContainer = document.getElementById("begin-task-container");
        beginTaskContainer.classList.add('active');
    }
}

function beginTask() {
    selectTask(++currentTask, ++currentFriction);
    if(currentTask == (taskIds.length - 1) || currentFriction == (frictionIds.length -1)) {
        const nextTaskButton = document.getElementById("buttonNextTask");
        nextTaskButton.textContent = "End Task";
    }
    const beginTaskContainer = document.getElementById("begin-task-container");
    beginTaskContainer.classList.remove('active');
}

function changeTaskText(index) {
    var taskText = getTaskText(index);
    const taskContainer = document.getElementById("task-container");
    taskContainer.innerHTML = "";
    const taskInformation = document.createElement("div");
    taskInformation.innerHTML = taskHTML(taskText);
    taskContainer.appendChild(taskInformation);
}

function resetCode(taskIndex){
    const code = document.getElementById("code");
    let prevTaskId = getTaskId[taskIndex-1];
    codeCache[prevTaskId] = code.value;
    code.value = "";
    updateLineNumbers();
}

function changeTaskChat(taskIndex, frictionIndex) {
    let prevFrictionId = getFrictionId(frictionIndex);
    let prevTaskId = getTaskId[taskIndex-1];
    
    const displayMessagesElement = document.getElementById("displayMessages");
    chatCache[prevTaskId] = displayMessagesElement.innerHTML;
    resetChat();
}

function changeTaskTests(index) {
    var taskId = getTaskId(index);
}

function countdown(startTime){
    let currentTime = startTime;

    counter = setInterval(function() {
        currentTime -= 1000;

        var minutes = Math.floor((currentTime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((currentTime % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = minutes + "m " + seconds + "s ";

        if (currentTime < 0) {
            nextTask();
        }
    }, 1000);
}

function stopCountdown(currentCountdown){
    clearInterval(currentCountdown);
    document.getElementById("countdown").innerHTML = "&nbsp;";
}

function getTaskId(index) {
    return taskIds[index];
}

function getTaskText(index) {
    return taskTexts[index];
}

function getFrictionId(index) {
    return frictionIds[index];
}

function taskHTML(task){
    const responseAsHtml = marked.parse(task);

    const replacedFirstPInHtml = responseAsHtml.replace("<p>", "<span>").replace("</p>", "</span>");
    const responseReversed = replacedFirstPInHtml.split(' ').reverse().join(' ');
    const replacedLastPInHtml = responseReversed.replace("<p>", "<span>").replace("</p>", "</span>");
    const ResponseWithStartEndPReplaced  = replacedLastPInHtml.split(' ').reverse().join(' ');

    return ResponseWithStartEndPReplaced;
} 

function deactivateSiblings(element){
    const parent = element.parentElement;
    for (const child of parent.children) {
        if (child !== element) {
            child.classList.remove('active');
        }
    }
}

function toggleContent(element, selectedTestElement, testObj) {
    let isActive = element.classList.toggle('active');
    selectedTestElement.innerHTML = "";
    if (isActive) {
        deactivateSiblings(element);

        const selectedTestHeader = document.createElement("h1");
        const testResultElement = document.createElement("p");
        selectedTestHeader.innerText = testObj.name;
        selectedTestHeader.classList.add(testObj.status);
        testResultElement.innerText = "Expected: " + testObj.expected + "\n Actual: " + testObj.actual;
        selectedTestElement.appendChild(selectedTestHeader);
        selectedTestElement.appendChild(testResultElement);
    }
}

// Helper function for submitUserCode()
function showTestStatuses(testDetails, fail) {
    if(fail){
        const testResultsContainerElement = document.getElementById("testResults");
        testResultsContainerElement.innerHTML = "";
        const testResultsHeaderElement = document.createElement("h1");
        testResultsHeaderElement.innerText = "Code Error"; 
        testResultsHeaderElement.style = "color: red";
        testResultsContainerElement.appendChild(testResultsHeaderElement);
    }
    else{
        let first = true;

        const testResultsContainerElement = document.getElementById("testResults");
        testResultsContainerElement.innerHTML = "";
        const testResultsHeaderElement = document.createElement("h1");
        const testResultItemsElement = document.createElement("div");
        const selectedTestElement = document.createElement("div");
        testResultItemsElement.className = "testResults";
        testResultsContainerElement.appendChild(testResultsHeaderElement);
        testDetails.forEach((testObj) => {
            const testResultElement = document.createElement("div");
            testResultElement.className = "testResult";
            testResultElement.innerText = testObj.name;
            testResultElement.classList.add(testObj.status);
            if(testObj.status === 'FAIL'){
                testResultElement.onclick = () => toggleContent(testResultElement, selectedTestElement, testObj);
            }
            testResultItemsElement.appendChild(testResultElement);
            testResultsContainerElement.appendChild(testResultItemsElement);
            testResultsContainerElement.appendChild(selectedTestElement);
            if(testObj.status === 'FAIL' && first) {
                testResultElement.click();
                first = false;
            }
        });
        testResultItemsElement.scrollTop = testResultItemsElement.scrollHeight;
    }
}

function toggleTasksCode(selected) {
    if(selected === 'tasks') {
        document.getElementsByClassName('tasksTab')[0].classList.add('active');
        document.getElementsByClassName('codeTab')[0].classList.remove('active');
        document.getElementById('task-container').className = 'active';
        document.getElementById('code-container').className = '';
    }
    else if(selected === 'code') {
        document.getElementsByClassName('tasksTab')[0].classList.remove('active');
        document.getElementsByClassName('codeTab')[0].classList.add('active');
        document.getElementById('task-container').className = '';
        document.getElementById('code-container').className = 'active';
    }
}

function submitUserCode() {
    const submittedCode = document.getElementById('code').value;
    const url = '/submit_code_intermediary';  // This points to server.py, not directly to Docker
    var testArray = [];
    if (submittedCode.trim() !== "") {
        console.log("Code submitted:", submittedCode);

        // Sending the C code to the Python intermediary server to be send to docker server and run
        axios.post(url, { code: submittedCode })
            .then(response => {
                try{
                    responseString = JSON.stringify(response.data);
                    responseString = responseString.split('test_output')[1];
                    testArray = responseString.split('test_');
    
                    var i = 1;
                    var allTestsDetails = [];
                    while(i < testArray.length){
                        var test = testArray[i];
                        var testDetails = test.split(':');
                        let testObj = {
                            name: testDetails[0],
                            status: testDetails[1].split('\\')[0],
                        };
    
                        if (testObj.status === 'FAIL') {
                            var testResults = testDetails[2].split('\\')[0];
                            var testResultsFixed = testResults.replace('Expected ', '').replace(' Was', '').split(' ');
                            testResultsFixed.shift();
                            testObj.expected = testResultsFixed[0];
                            testObj.actual = testResultsFixed[1];
                        }
                        allTestsDetails.push(testObj);
                        i++;
                    }
                    showTestStatuses(allTestsDetails, false);
                }
                catch(e){
                    showTestStatuses(null, true);
                }
                
            })
    }
}

function updateLineNumbers() {
    const textarea = document.getElementById('code');
    const lineNumbers = document.getElementById('lineNumbers');
    
    // Split the text content by newline to get the number of lines
    const lines = textarea.value.split('\n').length;
    
    // Generate line numbers
    let lineNumbersContent = '';
    for (let i = 1; i <= lines; i++) {
        lineNumbersContent += i + '\n';
    } 
    changeCSSRelativeToScrollBars(textarea)
    // Update the line numbers div
    lineNumbers.textContent = lineNumbersContent;
}

function changeCSSRelativeToScrollBars(textarea){    
        if(hasHorizontalScrollbar(textarea))
        {
            document.querySelector('.line-numbers').style.overflowX = 'scroll';
        }
        else {
            document.querySelector('.line-numbers').style.overflowX = 'hidden';
        }
}

function hasHorizontalScrollbar(element) {
    return element.scrollWidth > element.clientWidth;
}

function hasVerticalScrollbar(element) {
    return element.scrollHeight > element.clientHeight;
}

function syncScroll() {
    const textarea = document.getElementById('code');
    const lineNumbers = document.getElementById('lineNumbers');
    
    // Sync the scroll position of lineNumbers with the textarea
    lineNumbers.scrollTop = textarea.scrollTop;
}

// Add this event listener to keep the scrolling synchronized
document.getElementById('code').addEventListener('scroll', syncScroll);
document.addEventListener('DOMContentLoaded', () => {
    updateLineNumbers();
    syncScroll(); // Sync scroll initially
});

