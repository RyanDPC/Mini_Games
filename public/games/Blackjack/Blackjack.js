const suits = ['carreau', 'coeur', 'pique', 'trefle'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let playerHand = [];
let dealerHand = [];
let deck = [];
let gameOver = false;

const playerHandElement = document.getElementById('player-hand');
const dealerHandElement = document.getElementById('dealer-hand');
const playerScoreElement = document.getElementById('player-score');
const dealerScoreElement = document.getElementById('dealer-score');
const startButton = document.getElementById('start');
const hitButton = document.getElementById('hit');
const standButton = document.getElementById('stand');
const feedbackZone = document.getElementById('feedback-zone');

document.addEventListener('DOMContentLoaded', () => {
  startButton.addEventListener('click', startNewGame);
  hitButton.addEventListener('click', playerHit);
  standButton.addEventListener('click', playerStand);
});

function createDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function convertCardValueToNumber(value) {
  if (value === 'A') return 1;
  if (value === 'K' || value === 'Q' || value === 'J') return 10;
  return parseInt(value, 10);
}

function dealCard(hand, playerElement, isFaceUp = true) {
  const card = deck.pop();
  hand.push(card);
  card.faceUp = isFaceUp;
  
  const cardElement = document.createElement('div');
  cardElement.classList.add('cards');
  cardElement.style.backgroundImage = isFaceUp
    ? `url('cards/${card.suit}/${convertCardValueToNumber(card.value)}.png')`
    : "url('cards/back.png')";
  
  playerElement.appendChild(cardElement);
  
  updateScore(hand, playerElement === playerHandElement ? playerScoreElement : dealerScoreElement);
}

function startNewGame() {
  playerHand = [];
  dealerHand = [];
  gameOver = false;
  deck = shuffle(createDeck());
  playerHandElement.innerHTML = '';
  dealerHandElement.innerHTML = '';

  updateScore(playerHand, playerScoreElement);
  updateScore(dealerHand, dealerScoreElement);

  dealCard(playerHand, playerHandElement);
  dealCard(playerHand, playerHandElement);

  dealCard(dealerHand, dealerHandElement);
  dealCard(dealerHand, dealerHandElement, false);

  hitButton.disabled = false;
  standButton.disabled = false;
  startButton.disabled = true;

  updateFeedback('La partie commence ! Bonne chance !');
}

function revealDealerCards() {
  dealerHandElement.innerHTML = '';
  dealerHand.forEach((card) => {
    if (!card.faceUp) {
      card.faceUp = true;
    }
    const cardElement = document.createElement('div');
    cardElement.classList.add('cards');
    cardElement.style.backgroundImage = `url('cards/${card.suit}/${convertCardValueToNumber(card.value)}.png')`;
    dealerHandElement.appendChild(cardElement);
  });

  updateScore(dealerHand, dealerScoreElement);
}

function playerStand() {
  if (gameOver) return;
  updateFeedback('Le croupier joue...', 'info');
  hitButton.disabled = true;
  standButton.disabled = true;

  revealDealerCards(); 

  setTimeout(() => {
    dealerHit();
  }, 500);
}

function playerHit() {
  if (gameOver) return;
  dealCard(playerHand, playerHandElement);

  const playerScore = calculateScore(playerHand);
  if (playerScore > 21) {
    updateFeedback('Vous avez dépassé 21 !', 'lose');
    endGame();
  }
}

function dealerHit() {
  const dealerScore = calculateScore(dealerHand);
  if (dealerScore < 17) {
    dealCard(dealerHand, dealerHandElement);
    setTimeout(() => {
      dealerHit();
    }, 1000);
  } else {
    endGame();
  }
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;
  hand.forEach(card => {
    if (card.value === 'A') {
      aces += 1;
      score += 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value, 10);
    }
  });
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }
  return score;
}

function updateScore(hand, scoreElement) {
  let score;

  if (scoreElement !== playerScoreElement) {
    if (hand[1] && !hand[1].faceUp) {
      score = calculateScore([hand[0]]);
    } else {
      score = calculateScore(hand);
    }
  } else {
    score = calculateScore(hand);
  }

  scoreElement.textContent = `Score: ${score}`;
}

function updateFeedback(message, type = '') {
  feedbackZone.textContent = message;
  feedbackZone.className = `feedback ${type}`;
}

function endGame() {
  gameOver = true;
  hitButton.disabled = true;
  standButton.disabled = true;
  startButton.disabled = false;

  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore > 21) {
    updateFeedback('Vous avez dépassé 21 !', 'lose');
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    updateFeedback('Vous avez gagné !', 'win');
  } else if (dealerScore === playerScore) {
    updateFeedback('Égalité', 'tie');
  } else {
    updateFeedback('Le croupier a gagné', 'lose');
  }
}