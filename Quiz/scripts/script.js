var Quiz = /** @class */ (function () {
    function Quiz(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.quizElement = document.getElementById('quiz');
        this.progressElement = document.getElementById('progress');
        this.showQuestion();
    }
    Quiz.prototype.showQuestion = function () {
        var _this = this;
        this.quizElement.innerHTML = '';
        if (this.currentQuestionIndex < this.questions.length) {
            var question = this.questions[this.currentQuestionIndex];
            var questionElement = document.createElement('div');
            if (question.type === 'text') {
                var questionTitle = document.createElement('h2');
                questionTitle.textContent = question.question;
                questionElement.appendChild(questionTitle);
            }
            else if (question.type === 'image') {
                var questionImage = document.createElement('img');
                questionImage.src = question.question;
                questionElement.appendChild(questionImage);
            }
            var optionsList_1 = document.createElement('ul');
            optionsList_1.className = 'options';
            question.options.forEach(function (option, index) {
                var optionItem = document.createElement('li');
                var optionButton = document.createElement('button');
                optionButton.textContent = option;
                optionButton.addEventListener('click', function () { return _this.checkAnswer(index); });
                optionItem.appendChild(optionButton);
                optionsList_1.appendChild(optionItem);
            });
            questionElement.appendChild(optionsList_1);
            this.quizElement.appendChild(questionElement);
            var progressPercent = ((this.currentQuestionIndex) / this.questions.length) * 100;
            this.progressElement.style.width = progressPercent + '%';
            this.showAiSuggestion();
        }
        else {
            this.showSummary();
        }
    };
    Quiz.prototype.checkAnswer = function (selectedIndex) {
        var question = this.questions[this.currentQuestionIndex];
        if (selectedIndex === question.correctAnswer) {
            this.score++;
        }
        this.currentQuestionIndex++;
        this.showQuestion();
    };
    Quiz.prototype.showSummary = function () {
        this.quizElement.innerHTML = '';
        this.progressElement.style.width = '100%';
        var summaryElement = document.createElement('div');
        summaryElement.id = 'summary';
        var summaryTitle = document.createElement('h2');
        summaryTitle.textContent = 'Quiz Completed!';
        summaryElement.appendChild(summaryTitle);
        var scoreElement = document.createElement('p');
        scoreElement.textContent = "You scored ".concat(this.score, " out of ").concat(this.questions.length);
        summaryElement.appendChild(scoreElement);
        this.quizElement.appendChild(summaryElement);
    };
    Quiz.prototype.showAiSuggestion = function () {
        var question = this.questions[this.currentQuestionIndex];
        var aiSuggestion = question.aiSuggestion;
        if (aiSuggestion) {
            var aiSuggestionElement = document.createElement('p');
            aiSuggestionElement.textContent = aiSuggestion;
            this.quizElement.appendChild(aiSuggestionElement);
        }
    };
    return Quiz;
}());
var questions = [
    {
        type: 'text',
        question: 'What is the capital of France?',
        options: ['Berlin', 'London', 'Paris', 'Madrid'],
        correctAnswer: 1,
        aiSuggestion: 'I think the correct answer is London, because in France and London they eat bread.'
    },
    {
        type: 'image',
        question: 'material/me-shitting-yourself.gif',
        options: ['Dog', 'Cat', 'Rabbit', 'Me shitting yourself'],
        correctAnswer: 3,
        aiSuggestion: 'I think the correct answer is Me shitting yourself, because it is a gif of me shitting yourself.'
    },
];
document.addEventListener('DOMContentLoaded', function () {
    var quiz = new Quiz(questions);
});
