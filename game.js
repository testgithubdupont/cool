import drawIcon from "./canvas.js"
import fakeWait from "./fake.js";

const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const loader = document.getElementById('loader');
const game = document.getElementById('quizz');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 4;

async function getFromOpentdb() {
    try {

        const response = await fetch(
            'https://opentdb.com/api.php?amount=10&category=18&type=multiple');
            // 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple');
            //  'https://opentdb.com/api.php?amount=10&type=multiple');
        const loadedQuestions = await response.json();
        // wait 1s more
        await fakeWait(1000);
        //
        //  must be inside the fetch
        //

        console.log(loadedQuestions)
        startQuizz(loadedQuestions);


    } catch (error) {
        console.log(error);
    }


}




function formatQuestions(loadedQuestions){
    const fQuestions = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
            question: loadedQuestion.question,
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
        answerChoices.splice(
            formattedQuestion.answer - 1,
            0,
            loadedQuestion.correct_answer
        );

        answerChoices.forEach((choice, index) => {
            formattedQuestion['choice' + (index + 1)] = choice;
        });

        return formattedQuestion;
    });
    // console.log(fQuestions)
    return fQuestions;
}

const startQuizz = (questions) => {
    questionCounter = 0;
    score = 0;
    availableQuestions = formatQuestions(questions)
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

const getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        //go to the end page
        return window.location.assign('./game.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

     // add canvas
    drawIcon(`${(questionCounter / MAX_QUESTIONS) * 100}`, "#56a5eb")

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice, i) => {
        if (i==4) return; // Else answer
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

const incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};

getFromOpentdb() 