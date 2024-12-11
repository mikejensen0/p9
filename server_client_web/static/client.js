let messages = [];

const stackTask = `Make a simple stack implementation in c that supports basic operations PUSH, POP, ADD,  SUB.
- PUSH is used to PUSH a number onto top of the stack and POP is used to remove the top number from the stack.

- ADD does addition with the top and second top element.
- SUB functions the same but does subtraction. 
- Input to the stack should be given by an outside user in the form of inputs like this [“PUSH 20”, “PUSH 30”, “ADD”, PUSH 20] 
which should then give us a stack with 20 as the top element and 50 as the second element on the stack. 
- After executing the operations there should be some output that shows how the stack currently looks so for example [50, 20] (or [20, 50]?) 
`
const stateMachineTask = `Make a simple state machine simulating a door in c. It should have the states OPENED, CLOSED, and LOCKED. 
It should have the following transitions: 
- OPEN->CLOSE, puts us in state CLOSED	

- CLOSE->LOCK, puts us in state LOCKED
- LOCK->UNLOCK, puts us in state CLOSED
- CLOSE->OPEN, puts us in state OPENED 
- Transitions should be requested from the user to execute given in the following format [“OPEN”, “CLOSE”, “LOCK, “UNLOCK”]. 
If an invalid transition is given the program inform of this upon execution. 
`

const expressionParserTask = ` Create a simple expression parser in C to evaluate mathematical expressions.
 It should support basic operations: 
 - Addition 

 - Subtraction
 - Multiplication 
 - Division 
 - Parentheses 
 - It should follow the order of operations rules in mathematics.
 -  It should be able to support any number of operands and operators. 
 - 2 + 4 * 4 should evaluate to 18 and (2 + 4) * 4 should evaluate to 24
`
const navigationTask = ` Create a simple path-finding algorithm in c that finds the quickest path from one starting point to an endpoint in a grid. 
- If no path exists the program should notify of this

- The program should receive the grid by user input in the form of a 2D array
-  An example could look like this [[2,1,1], [0, 1, 1],[0, 0,2]] where 2 represents the end and starting point, 1 represents a blocked path and 0 represents a traversable path
-  This specific example should then give us a minimum path of 4.
`

const stackTests = [{name: 'test_initialize', status: 'FAIL', expected: -1}, 
                    {name: 'test_isFull_true', status: 'FAIL', expected: 1},
                    {name: 'test_isFull_false', status: 'FAIL', expected: 0},
                    {name: 'test_isEmpty_true', status: 'FAIL', expected: 1},
                    {name: 'test_isEmpty_false', status: 'FAIL', expected: 0},
                    {name: 'test_pop', status: 'FAIL', expected: 1},
                    {name: 'test_pop_top_index', status: 'FAIL', expected: -1},
                    {name: 'test_add', status: 'FAIL', expected: 50},
                    {name: 'test_sub', status: 'FAIL', expected: -10},
                    {name: 'test_tokenizeUserInputAndExecuteCommand_push', status: 'FAIL', expected: 30},
                    {name: 'test_tokenizeUserInputAndExecuteCommand_pop', status: 'FAIL', expected: 1},
                    {name: 'test_tokenizeUserInputAndExecuteCommand_add', status: 'FAIL', expected: 80},
                    {name: 'test_tokenizeUserInputAndExecuteCommand_sub', status: 'FAIL', expected: -20},
];

const stateMachineTests = [ {name: 'test_transition_lock', status: 'FAIL', expected: 2},
                            {name: 'test_transition_open', status: 'FAIL', expected: 0},
                            {name: 'test_transition_close', status: 'FAIL', expected: 1},
                            {name: 'test_transition_unlock', status: 'FAIL', expected: 1},
                            {name: 'test_extended_transitions', status: 'FAIL', expected: 2},

];

const expressionParserTests = [ {name: 'test_simple_addition', status: 'FAIL', expected: 4},
                                {name: 'test_advanced_addition', status: 'FAIL', expected: 22},
                                {name: 'test_simple_subtraction', status: 'FAIL', expected: 0},
                                {name: 'test_advanced_subtraction', status: 'FAIL', expected: -18},
                                {name: 'test_simple_multiplication', status: 'FAIL', expected: 9},
                                {name: 'test_advanced_multiplication', status: 'FAIL', expected: 600},
                                {name: 'test_simple_division', status: 'FAIL', expected: 1},
                                {name: 'test_advanced_divison', status: 'FAIL', expected: 1},
                                {name: 'test_order_of_operations', status: 'FAIL', expected: 8},
                                {name: 'test_parameters', status: 'FAIL', expected: 12},
];

const navigationTests = [   {name: 'test_path_on_3x3_grid', status: 'FAIL', expected: 4},
                            {name: 'test_path_on_4x4_grid', status: 'FAIL', expected: 9},
                            {name: 'test_path_on_4x3_grid', status: 'FAIL', expected: 8},
                            {name: 'test_path_on_3x4_grid', status: 'FAIL', expected: 7},
];

let taskIds = [0,1,2,3]; 
let testDetailsArray = [stackTests, stateMachineTests, expressionParserTests, navigationTests];
let taskTexts = [stackTask, stateMachineTask, expressionParserTask, navigationTask];
let code_description = ["stack", "state", "expression", "nav"];
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
            body: JSON.stringify({ message: messageToSend})
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
                if(frictionIds[currentTask] == 1)
                {
                    codeElement.style.color = 'transparent';
                    codeElement.style.textShadow = '0px 0px 5px rgba(0,0,0,0.5)';
                }
                
                if(codeLength < 30){
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
        const displayMessagesElement = document.getElementById("displayMessages");
        let taskId = getTaskId(currentTask);
        chatCache[taskId] += displayMessagesElement.innerHTML + "CHAT WAS RESET";
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
    code_description = adjustthisList(shuffledIds);
    taskIds = shuffledIds;
    assignFrictions(frictionIds);
    selectTask(0);
    setAIBehaviour(0);
    showTests(0);
}

function setAIBehaviour(taskIndex){
    fetch('/set_ai_behaviour', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ friction: frictionIds[currentTask]})
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); 
            localStorage.clear();
            const displayMessagesElement = document.getElementById("displayMessages");
            let prevTaskId = getTaskId(taskIndex-1);
            chatCache[prevTaskId] += displayMessagesElement.innerHTML;
            resetChat();
        })
        .catch(error => {
            console.error('Error:', error);
        });
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

function adjustthisList(idList) {
    let adjustedTaskList = [];
    let i = 0;

    code_description.forEach((task) => {
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
    frictionIds = randomiser(frictions);
}

function selectTask(taskIndex){
    toggleTasksCode('tasks');
    changeTaskText(taskIndex);
    resetCode(taskIndex);
    countdown(45/4*60*1000);
    setAIBehaviour(taskIndex);
    showTests(taskIndex);
}

function nextTask() {
    if(currentTask == (taskIds.length - 1) || currentFriction == (frictionIds.length -1)) {
        //End experiment
        stopCountdown(counter);
        //Blur
        const beginTaskContainer = document.getElementById('begin-task-container');
        beginTaskContainer.classList.add('active');
        const beginTaskPromptContainer = document.getElementsByClassName('beginTaskPrompt')[0];
        beginTaskPromptContainer.classList.remove('active');

        //Cache
        const code = document.getElementById("code");
        let taskId = getTaskId(currentTask);
        const displayMessagesElement = document.getElementById('displayMessages');
        codeCache[taskId] = code.value;
        chatCache[taskId] += displayMessagesElement.innerHTML;
        
        fetch('/write_to_file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codeArray: codeCache, chatArray: chatCache, frictionArray: frictionIds })
        })
            .then(response => response.json())
            .then(data => {
                
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    if((currentTask + 1) < taskIds.length && (currentFriction + 1) < frictionIds.length) {
        stopCountdown(counter);
        //Pause, make them click begin task
        const beginTaskContainer = document.getElementById("begin-task-container");
        beginTaskContainer.classList.add('active');
    }
}

function beginTask() {
    selectTask(++currentTask);
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

function showTests(taskIndex) {
    let taskId = getTaskId(taskIndex);
    let testDetails = testDetailsArray[taskId];

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
    });
    testResultItemsElement.scrollTop = testResultItemsElement.scrollHeight;
}

function resetCode(taskIndex){
    const code = document.getElementById("code");
    let prevTaskId = getTaskId(taskIndex-1);
    codeCache[prevTaskId] = code.value;
    code.value = "";
    updateLineNumbers();
}

function countdown(startTime){
    let currentTime = startTime;

    var minutes = Math.floor((currentTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((currentTime % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = minutes + "m " + seconds + "s ";

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
        axios.post(url, { code: submittedCode, testsToRun: code_description[currentTask] })
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

