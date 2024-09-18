interface Question {
    type: 'text' | 'image';
    question: string;
    options: string[];
    correctAnswer: number;
    aiSuggestion?: string;
}

class Quiz {
    private questions: Question[];
    private currentQuestionIndex: number;
    private score: number;
    private quizElement: HTMLElement;
    private progressElement: HTMLElement;

    constructor(questions: Question[]) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.quizElement = document.getElementById('quiz')!;
        this.progressElement = document.getElementById('progress')!;
        this.showQuestion();
    }

    private showQuestion() {
        this.quizElement.innerHTML = '';

        if (this.currentQuestionIndex < this.questions.length) {
            const question = this.questions[this.currentQuestionIndex];

            const questionElement = document.createElement('div');

            if (question.type === 'text') {
                const questionTitle = document.createElement('h2');
                questionTitle.textContent = question.question;
                questionElement.appendChild(questionTitle);
            } else if (question.type === 'image') {
                const questionImage = document.createElement('img');
                questionImage.src = question.question;
                questionElement.appendChild(questionImage);
            }

            const optionsList = document.createElement('ul');
            optionsList.className = 'options';

            question.options.forEach((option, index) => {
                const optionItem = document.createElement('li');
                const optionButton = document.createElement('button');
                optionButton.textContent = option;
                optionButton.addEventListener('click', () => this.checkAnswer(index));
                optionItem.appendChild(optionButton);
                optionsList.appendChild(optionItem);
            });

            questionElement.appendChild(optionsList);
            this.quizElement.appendChild(questionElement);

            const progressPercent = ((this.currentQuestionIndex) / this.questions.length) * 100;
            this.progressElement.style.width = progressPercent + '%';

        } else {
            this.showSummary();
        }
    }

    private checkAnswer(selectedIndex: number) {
        const question = this.questions[this.currentQuestionIndex];
        if (selectedIndex === question.correctAnswer) {
            this.score++;
        }
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    private showSummary() {
        this.quizElement.innerHTML = '';

        this.progressElement.style.width = '100%';

        const summaryElement = document.createElement('div');
        summaryElement.id = 'summary';

        const summaryTitle = document.createElement('h2');
        summaryTitle.textContent = 'Quiz Completed!';
        summaryElement.appendChild(summaryTitle);

        const scoreElement = document.createElement('p');
        scoreElement.textContent = `You scored ${this.score} out of ${this.questions.length}`;
        summaryElement.appendChild(scoreElement);

        this.quizElement.appendChild(summaryElement);
    }

    private showAiSuggestion() {
        const question = this.questions[this.currentQuestionIndex];
        const aiSuggestion = question.aiSuggestion;
        if (aiSuggestion) {
            const aiSuggestionElement = document.createElement('p');
            aiSuggestionElement.textContent = aiSuggestion;
            this.quizElement.appendChild(aiSuggestionElement);
        }
    }
}

const questions: Question[] = [
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

document.addEventListener('DOMContentLoaded', () => {
    const quiz = new Quiz(questions);
});
