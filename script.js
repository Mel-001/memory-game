// JavaScript logic for the memory game

const cards = Array.from(document.querySelectorAll('.card'));
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let starCount = 3;
let matchedCount = 0;
let timer = null;
let startTime;

const movesDisplay = document.querySelector('.moves');
const starCountDisplay = document.querySelector('.star-count');
const restartBtn = document.querySelector('.restart');
const timerDisplay = document.querySelector('.time');

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
  updateMoves();
  updateStars();
}

function checkMatch() {
  let isMatch = firstCard.dataset.id === secondCard.dataset.id;
  isMatch ? handleMatch() : handleMismatch();
}

function handleMatch() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  matchedCount += 2;
  if (matchedCount === cards.length) {
    clearInterval(timer);
    const endTime = new Date().getTime();
    const timeTaken = new Date(endTime - startTime);
    setTimeout(() => {
      alert(`Congratulations! You won in ${moves} moves and ${timeTaken.getMinutes()}m ${timeTaken.getSeconds()}s.`);
    }, 500);
  }
  resetBoard();
}

function handleMismatch() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

function updateMoves() {
  moves++;
  movesDisplay.textContent = `Moves: ${moves}`;
}

function updateStars() {
  if (moves === 12 || moves === 18) {
    starCount--;
    starCountDisplay.textContent = starCount;
  }
}

function startTimer() {
  startTime = new Date().getTime();
  timer = setInterval(() => {
    const currentTime = new Date().getTime();
    const timeDiff = new Date(currentTime - startTime);
    const minutes = timeDiff.getMinutes().toString().padStart(2, '0');
    const seconds = timeDiff.getSeconds().toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function restartGame() {
  cards.forEach(card => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });
  moves = 0;
  matchedCount = 0;
  starCount = 3;
  movesDisplay.textContent = 'Moves: 0';
  starCountDisplay.textContent = '3';
  clearInterval(timer);
  timerDisplay.textContent = '00:00';
  startTimer();
  shuffleCards();
}

function shuffleCards() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
}

cards.forEach(card => card.addEventListener('click', flipCard));
restartBtn.addEventListener('click', restartGame);

startTimer();
shuffleCards();
