// === GAME VARIABLES ===
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let timer;
let timeLeft = 30; // seconds per question
const timerDisplay = document.createElement("p");
timerDisplay.id = "timer";
document.getElementById("hud").appendChild(timerDisplay);

// Example question set (replace with your real ones)
let questions = [
  {
    question: "Quem escreveu 'Os Lusíadas'?",
    choice1: "Fernando Pessoa",
    choice2: "Camões",
    choice3: "Eça de Queirós",
    choice4: "Padre António Vieira",
    answer: 2,
  },
  {
    question: "Qual é o rio mais longo do mundo?",
    choice1: "Amazonas",
    choice2: "Nilo",
    choice3: "Tejo",
    choice4: "Danúbio",
    answer: 1,
  },
  // Add more...
];

const SCORE_POINTS = 10;
const MAX_QUESTIONS = questions.length;

// === START GAME ===
function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
}

// === LOAD NEW QUESTION ===
function getNewQuestion() {
  clearInterval(timer); // stop previous timer
  timeLeft = 30;

  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("end.html"); // redirect to end screen
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;

  startTimer();
}

// === TIMER ===
function startTimer() {
  timerDisplay.textContent = `⏱️ Tempo: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏱️ Tempo: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

// === HANDLE CHOICE ===
choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;

    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(SCORE_POINTS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      nextQuestion();
    }, 1000);
  });
});

// === NEXT QUESTION ===
function nextQuestion() {
  getNewQuestion();
}

// === INCREMENT SCORE ===
function incrementScore(num) {
  score += num;
  scoreText.innerText = score;
}

startGame();
