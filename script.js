import { soundCorrect, soundWrong, soundTick, endtimeTick, toggleMute, playSound } from './src/audio.js';
import { categoryThemes, getScoreMessage, decodeHTML } from './src/config.js';
import { renderLeaderboard, saveHighScore } from './src/leaderboard.js';
import { fetchQuestionsFromAPI } from './src/questions.js';
import { initAuthListener, loginUser, registerUser, logoutUser, currentUser } from './src/auth.js';


const authToggleBtn = document.getElementById('auth-toggle-btn');
const authUserText = document.getElementById('auth-user-text');
const authModal = document.getElementById('auth-modal');
const authEmailInput = document.getElementById('auth-email');
const authPasswordInput = document.getElementById('auth-password');
const authSubmitLogin = document.getElementById('auth-submit-login');
const authSubmitRegister = document.getElementById('auth-submit-register');
const authCloseModal = document.getElementById('auth-close-modal');
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');
const reviewScreen = document.getElementById('review-screen');

const startBtn = document.getElementById('start-btn');
const viewHighscoresBtn = document.getElementById('view-highscores-btn');
const homeBtn = document.getElementById('home-btn');
const saveScoreBtn = document.getElementById('save-score-btn');
const gameOverBtn = document.getElementById('game-over-btn');
const backToEndBtn = document.getElementById('back-to-end-btn');
const muteBtn = document.getElementById('mute-btn');
const leaderboardFilter = document.getElementById('leaderboard-filter');
const gameOverContainer = document.getElementById('game-over-container');
const saveScoreContainer = document.getElementById('save-score-container');

const categorySelect = document.getElementById('category-select');
const difficultySelect = document.getElementById('difficulty-select');
const typeSelect = document.getElementById('type-select');
const quizErrorBtn = document.getElementById('quiz-error-btn');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress');
const timeLeftSpan = document.getElementById('time-left');
const currentScoreSpan = document.getElementById('current-score');
const questionText = document.getElementById('question-text');
const answerContainers = document.getElementById('answer-containers');
const finalScoreSpan = document.getElementById('final-score');
const scoreMessage = document.getElementById('score-message');
const usernameInput = document.getElementById('username');
const highScoresList = document.getElementById('high-scores-list');
const reviewList = document.getElementById('review-list');

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 15;
let userSelections = [];



function showScreen(screenToShow) {
    welcomeScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    reviewScreen.classList.add('hidden');
    screenToShow.classList.remove('hidden');
}

initAuthListener((user) => {
    if (user) {
        authUserText.innerHTML = `Playing as: <strong class="text-emerald-400">${user.email.split('@')[0].toUpperCase()}</strong>`;
        authToggleBtn.innerText = "Log Out";
        authToggleBtn.className = "px-2.5 py-1 bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/40 rounded font-semibold transition";
    } else {
        authUserText.innerHTML = `Playing as: <strong class="text-blue-400">Guest Mode</strong>`;
        authToggleBtn.innerText = "Log In";
        authToggleBtn.className = "px-2.5 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold transition";
    }
});
function updateBackground() {
    const imageUrl = categoryThemes[categorySelect.value];
    document.body.style.backgroundImage = imageUrl 
        ? `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.6)), url('${imageUrl}')` 
        : 'none';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
}

async function fetchQuestions() {
    questionText.innerText = "Loading cosmic questions...";
    answerContainers.innerHTML = "";
    progressBarFill.style.width = "0%";
    if (quizErrorBtn) quizErrorBtn.classList.add('hidden');
    userSelections = []; 

    try {
        quizQuestions = await fetchQuestionsFromAPI(categorySelect.value, difficultySelect.value, typeSelect.value);
        
        if (quizQuestions.length > 0) {
            currentQuestionIndex = 0;
            score = 0;
            currentScoreSpan.innerText = score;
            loadQuestion();
        } else {
            questionText.innerText = "No questions found matching this exact combination! Modify configurations and try again.";
            if (quizErrorBtn) quizErrorBtn.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        questionText.innerText = "Failed to load questions. Check your internet connection!";
        if (quizErrorBtn) quizErrorBtn.classList.remove('hidden');
    }
}

function loadQuestion() {
    clearInterval(timerInterval);
    timeLeft = 15;
    timeLeftSpan.innerText = timeLeft;

    if (currentQuestionIndex >= quizQuestions.length) {
        return endGame();
    }

    progressText.innerText = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    progressBarFill.style.width = `${(currentQuestionIndex / quizQuestions.length) * 100}%`;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionText.innerText = decodeHTML(currentQuestion.question);

    let answers = [...currentQuestion.incorrect_answers];
    answers.splice(Math.floor(Math.random() * (answers.length + 1)), 0, currentQuestion.correct_answer);

    answerContainers.innerHTML = "";
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.className = "w-full text-left p-4 bg-slate-800/90 hover:bg-slate-700/90 border-2 border-slate-700 hover:border-blue-500 rounded-xl font-medium transition duration-200 text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed";
        button.innerText = decodeHTML(answer);
        button.addEventListener('click', () => handleAnswerSelection(button, currentQuestion.correct_answer));
        answerContainers.appendChild(button);
    });

    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftSpan.innerText = timeLeft;

        if (timeLeft > 0) {
            if (timeLeft < 4) {
                soundTick.pause();
                soundTick.currentTime = 0;
                playSound(endtimeTick);
            } else {
                playSound(soundTick);
            }
        }

        if (timeLeft <= 0) {
            endtimeTick.pause();
            endtimeTick.currentTime = 0;
            playSound(soundWrong);
            clearInterval(timerInterval);
            
            userSelections.push({
                question: quizQuestions[currentQuestionIndex].question,
                selected: "Skipped / Timeout Trigger",
                correct: quizQuestions[currentQuestionIndex].correct_answer,
                isCorrect: false
            });

            currentQuestionIndex++;
            loadQuestion();
        }
    }, 1000);
}

function handleAnswerSelection(selectedButton, correctAnswer) {
    clearInterval(timerInterval);
    soundTick.pause();
    endtimeTick.pause();

    const choice = selectedButton.innerText;
    const decodedCorrectAnswer = decodeHTML(correctAnswer);

    userSelections.push({
        question: quizQuestions[currentQuestionIndex].question,
        selected: choice,
        correct: decodedCorrectAnswer,
        isCorrect: choice === decodedCorrectAnswer
    });

    answerContainers.querySelectorAll('button').forEach(btn => btn.disabled = true);

    if (choice === decodedCorrectAnswer) {
        score += 10;
        currentScoreSpan.innerText = score;
        selectedButton.className = "w-full text-left p-4 bg-emerald-600 border-2 border-emerald-500 rounded-xl font-medium transition duration-200 text-white";
        playSound(soundCorrect);
    } else {
        selectedButton.className = "w-full text-left p-4 bg-red-600 border-2 border-red-500 rounded-xl font-medium transition duration-200 text-white";
        playSound(soundWrong);
        answerContainers.querySelectorAll('button').forEach(btn => {
            if (btn.innerText === decodedCorrectAnswer) {
                btn.className = "w-full text-left p-4 bg-emerald-600 border-2 border-emerald-500 rounded-xl font-medium transition duration-200 text-white";
            }
        });
    }

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1200);
}

// Make sure you add "async" right here!
async function endGame() {
    progressBarFill.style.width = "100%"; 
    gameOverContainer.classList.remove('hidden');
    gameOverBtn.classList.remove('hidden'); 
    
    showScreen(endScreen);
    finalScoreSpan.innerText = score;
    
    const currentDifficulty = difficultySelect.value || "any";
    scoreMessage.innerText = getScoreMessage(score, currentDifficulty);
    scoreMessage.className = "text-sm max-w-sm mx-auto font-semibold mt-1 " + (score >= 70 ? 'text-blue-400' : 'text-amber-500');
    
    if(leaderboardFilter) leaderboardFilter.value = currentDifficulty;

    // 🌟 THIS IS THE AUTOMATION CHECK THAT WAS MISSING
    if (currentUser && currentUser.email) {
        // Hide the initials input box entirely since they are logged in
        saveScoreContainer.classList.add('hidden');
        
        console.log("Logged in user detected. Auto-saving to cloud...");
        // Pass empty string; leaderboard.js will auto-fill the email prefix
        await saveHighScore("", score, currentDifficulty); 
        
    } else {
        // GUEST MODE: Show the initials input box
        saveScoreContainer.classList.remove('hidden');
    }
    
    renderLeaderboard(highScoresList, currentDifficulty);
}

function renderReviewReport() {
    reviewList.innerHTML = userSelections.map((item, index) => {
        const itemCardBorder = item.isCorrect ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-red-500/30 bg-red-950/20';
        const labelSelectionColor = item.isCorrect ? 'text-emerald-400' : 'text-red-400';
        return `
            <div class="p-4 border rounded-xl flex flex-col gap-1.5 transition duration-150 ${itemCardBorder}">
                <h4 class="font-bold text-slate-200">Q${index + 1}: ${decodeHTML(item.question)}</h4>
                <p class="text-xs font-semibold mt-0.5">Your choice: <span class="${labelSelectionColor}">${decodeHTML(item.selected)}</span></p>
                ${!item.isCorrect ? `<p class="text-xs text-slate-400 font-medium">Correct choice: <span class="text-emerald-400">${decodeHTML(item.correct)}</span></p>` : ''}
            </div>`;
    }).join('');
}


muteBtn.addEventListener('click', () => toggleMute(muteBtn));
startBtn.addEventListener('click', () => { showScreen(quizScreen); fetchQuestions(); });
homeBtn.addEventListener('click', () => showScreen(welcomeScreen));
backToEndBtn.addEventListener('click', () => showScreen(endScreen));
gameOverBtn.addEventListener('click', () => { renderReviewReport(); showScreen(reviewScreen); });
quizErrorBtn.addEventListener('click', () => showScreen(welcomeScreen));
categorySelect.addEventListener('change', updateBackground);
leaderboardFilter.addEventListener('change', (e) => renderLeaderboard(highScoresList, e.target.value));

authToggleBtn.addEventListener('click', async () => {
    if (currentUser) {
        await logoutUser();
        alert("Logged out successfully! Switched to Guest Mode.");
    } else {
        authModal.classList.remove('hidden');
    }
});

authCloseModal.addEventListener('click', () => authModal.classList.add('hidden'));

authSubmitLogin.addEventListener('click', async () => {
    const email = authEmailInput.value.trim();
    const pass = authPasswordInput.value.trim();
    if(!email || !pass) return alert("Fill in credentials!");
    try {
        await loginUser(email, pass);
        authModal.classList.add('hidden');
        authEmailInput.value = ""; authPasswordInput.value = "";
    } catch(e) { alert(e.message); }
});

authSubmitRegister.addEventListener('click', async () => {
    const email = authEmailInput.value.trim();
    const pass = authPasswordInput.value.trim();
    if(!email || !pass) return alert("Fill in credentials!");
    try {
        await registerUser(email, pass);
        authModal.classList.add('hidden');
        authEmailInput.value = ""; authPasswordInput.value = "";
        alert("Account Created successfully!");
    } catch(e) { alert(e.message); }
});
viewHighscoresBtn.addEventListener('click', () => {
    gameOverContainer.classList.add('hidden');
    saveScoreContainer.classList.add('hidden');
    const targetDiff = difficultySelect.value || "any";
    leaderboardFilter.value = targetDiff;
    renderLeaderboard(highScoresList, targetDiff);
    showScreen(endScreen);
});

saveScoreBtn.addEventListener('click', () => {
    // 🌟 Prevent logged-in users from accidentally using this button
    if (currentUser) return; 

    const username = usernameInput.value.trim().toUpperCase();
    if (!username) { alert("Please enter your initials to save your score!"); return; }
    
    const currentDifficulty = difficultySelect.value || "any";
    saveHighScore(username, score, currentDifficulty);
    usernameInput.value = "";
    saveScoreContainer.classList.add('hidden');
    renderLeaderboard(highScoresList, currentDifficulty);
});


renderLeaderboard(highScoresList, "any");
updateBackground();