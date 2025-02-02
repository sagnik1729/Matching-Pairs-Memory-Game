// script.js
const themes = {
    numbers: [1, 2, 3, 4, 5, 6, 7, 8],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
    fruits: ['🍎', '🍌', '🍇', '🍓', '🍉', '🍍', '🍑', '🍒'],
    emojis: ['😀', '😎', '🤩', '😍', '🥳', '😜', '🤔', '😴']
};

let cards = [];
let flippedCards = [];
let attempts = 0;
let matchedPairs = 0;
let timer = 0;
let timerInterval;

const gameBoard = document.querySelector('.game-board');
const attemptsDisplay = document.getElementById('attempts');
const timerDisplay = document.getElementById('timer');
const winMessage = document.getElementById('win-message');
const totalAttemptsDisplay = document.getElementById('total-attempts');
const totalTimeDisplay = document.getElementById('total-time');
const themeSelector = document.getElementById('theme');
const restartButton = document.getElementById('restart');
const flipSound = document.getElementById('flip-sound');
const matchSound = document.getElementById('match-sound');
const winSound = document.getElementById('win-sound');

// Initialize the game
function initGame() {
    const selectedTheme = themeSelector.value;
    cards = [...themes[selectedTheme], ...themes[selectedTheme]];
    shuffleCards();
    renderGame();
    resetStats();
    startTimer();
}

// Shuffle cards using Fisher-Yates algorithm
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

// Render the game board
function renderGame() {
    gameBoard.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.dataset.value = card;
        cardElement.textContent = '';
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

// Flip a card
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        flipSound.play();
        this.classList.add('flipped');
        this.textContent = this.dataset.value;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            attempts++;
            attemptsDisplay.textContent = attempts;
            checkForMatch();
        }
    }
}

// Check if flipped cards match
function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        matchSound.play();
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        if (matchedPairs === cards.length / 2) {
            stopTimer();
            showWinMessage();
            saveHighScore();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
        }, 1000);
    }
    flippedCards = [];
}

// Show win message
function showWinMessage() {
    winSound.play();
    totalAttemptsDisplay.textContent = attempts;
    totalTimeDisplay.textContent = timer;
    winMessage.classList.remove('hidden');
}

// Reset game stats
function resetStats() {
    attempts = 0;
    matchedPairs = 0;
    timer = 0;
    flippedCards = [];
    attemptsDisplay.textContent = attempts;
    timerDisplay.textContent = timer;
    winMessage.classList.add('hidden');
    stopTimer();
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Save high score locally
function saveHighScore() {
    const selectedTheme = themeSelector.value;
    const highScoreKey = `highScore_${selectedTheme}`;
    const highScore = localStorage.getItem(highScoreKey);
    if (!highScore || timer < highScore) {
        localStorage.setItem(highScoreKey, timer);
    }
}

// Event listeners
themeSelector.addEventListener('change', initGame);
restartButton.addEventListener('click', initGame);

// Start the game
initGame();