const suits = ['diamonds', 'hearts', 'spades', 'clubs'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let playerHand = [];
let dealerHand = [];
let deck = [];

const playerHandElement = document.getElementById('player-hand');
const dealerHandElement = document.getElementById('dealer-hand');
const playerScoreElement = document.getElementById('player-score');
const dealerScoreElement = document.getElementById('dealer-score');
const startButton = document.getElementById('start');
const hitButton = document.getElementById('hit');
const doubleButton = document.getElementById('double');
const splitButton = document.getElementById('split');
const insuranceButton = document.getElementById('insurance');
const standButton = document.getElementById('stand');
const autoCheckbox = document.getElementById('auto');
const feedbackZone = document.getElementById('feedback-zone');

document.addEventListener('DOMContentLoaded', () => {
  startButton.addEventListener('click', startNewGame);
  hitButton.addEventListener('click', playerHit);
  standButton.addEventListener('click', playerStand);
  doubleButton.addEventListener('click', playerDouble);
  splitButton.addEventListener('click', playerSplit);
  insuranceButton.addEventListener('click', playerInsurance);
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
  playerElement.classList.add('shift-card');
  hand.push(card);
  playerElement.addEventListener('animationend', () => {
    playerElement.classList.remove('shift-card');
  });   
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
  deck = shuffle(createDeck());
  playerHandElement.innerHTML = '';
  dealerHandElement.innerHTML = '';

  updateScore(playerHand, playerScoreElement);
  updateScore(dealerHand, dealerScoreElement);

  dealCard(playerHand, playerHandElement);
  dealCard(playerHand, playerHandElement);
  dealCard(dealerHand, dealerHandElement);
  dealCard(dealerHand, dealerHandElement, false);

  startButton.style.display = 'none';
  hitButton.style.display = 'block';
  standButton.style.display = 'block';

  if (calculateScore(playerHand) == 9 || calculateScore(playerHand) == 10 || calculateScore(playerHand) == 11) {
    doubleButton.style.display = 'block';
  } else {
    doubleButton.style.display = 'none';
  }

  if (parseInt(playerHand[0].value, 10) === parseInt(playerHand[1].value, 10)) {
    splitButton.style.display = 'block';
  } else {
    splitButton.style.display = 'none';
  }

  if (dealerHand[0].value === "A") {
    insuranceButton.style.display = 'block';
  } else {
    insuranceButton.style.display = 'none';
  }
}

function revealDealerCards() {
  dealerHand.forEach((card, index) => {
    if (!card.faceUp) {
      card.faceUp = true;

      const cardElement = dealerHandElement.children[index] || document.createElement('div');
      cardElement.classList.add('cards');
      cardElement.classList.add('flip');

      setTimeout(() => {  
        cardElement.style.backgroundImage = `url('cards/${card.suit}/${convertCardValueToNumber(card.value)}.png')`;

        if (!dealerHandElement.contains(cardElement)) {
          dealerHandElement.appendChild(cardElement);
        }
      }, 150);
    }
  });

  updateScore(dealerHand, dealerScoreElement);
}

function playerDouble() {
  dealCard(playerHand, playerHandElement);
  hitButton.style.display = 'none';
  standButton.style.display = 'none';
  doubleButton.style.display = 'none';
  splitButton.style.display = 'none';
  insuranceButton.style.display = 'none';

  setTimeout(() => {  
    playerStand()
  }, 500);
}

function playerSplit() { // Work in progress

}

function playerInsurance() { // Work in progress

}

function playerStand() {
  hitButton.style.display = 'none';
  standButton.style.display = 'none';
  doubleButton.style.display = 'none';
  splitButton.style.display = 'none';
  insuranceButton.style.display = 'none';

  revealDealerCards(); 

  setTimeout(() => {
    dealerHit();
  }, 500);
}

function playerHit() {
  dealCard(playerHand, playerHandElement);
  doubleButton.style.display = 'none';
  splitButton.style.display = 'none';

  const playerScore = calculateScore(playerHand);
  if (playerScore > 21) {
    endGame();
  }
}

function dealerHit() {
  const dealerScore = calculateScore(dealerHand);
  const playerScore = calculateScore(playerHand);
  if (dealerScore < 17 && dealerScore < playerScore) {
    dealCard(dealerHand, dealerHandElement);
    setTimeout(() => {
      dealerHit();
    }, 500);
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

  scoreElement.textContent = `${score}`;
}

function endGame() {
  if (autoCheckbox.checked) {
    setTimeout(() => {
      startNewGame();
    }, 500);
  } else {
    startButton.style.display = 'block'; 
  }
  hitButton.style.display = 'none';
  standButton.style.display = 'none';
  doubleButton.style.display = 'none';
  splitButton.style.display = 'none';
  insuranceButton.style.display = 'none';
}