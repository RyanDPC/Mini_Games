// Import necessary modules
const db = require('../../database');
const socket = io();

document.addEventListener("DOMContentLoaded", async function() {
    console.log("DOM content loaded.");

    let playerBalance = parseInt(document.getElementById('player-balance').dataset.tokens, 10);
    console.log("Initial player balance:", playerBalance);

    const playerHand = document.getElementById("player-hand");
    const dealerHand = document.getElementById("dealer-hand");
    const communityCards = document.getElementById("community-cards");
    const opponentHands = [
        document.getElementById("opponent-1-hand"),
        document.getElementById("opponent-2-hand"),
        document.getElementById("opponent-3-hand"),
        document.getElementById("opponent-4-hand"),
        document.getElementById("opponent-5-hand"),
        document.getElementById("opponent-6-hand"),
        document.getElementById("opponent-7-hand"),
        document.getElementById("opponent-8-hand")
    ].filter(hand => hand !== null); // Filtrer les éléments null

    const betButton = document.getElementById("bet-button");
    const foldButton = document.getElementById("fold-button");
    const callButton = document.getElementById("call-button");
    const checkButton = document.getElementById("check-button");
    const raiseButton = document.getElementById("raise-button");
    const allInButton = document.getElementById("all-in-button");
    const betAmountInput = document.getElementById("bet-amount");
    const playerBalanceDisplay = document.getElementById("player-balance");

    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    
    function getRandomCard() {
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const value = values[Math.floor(Math.random() * values.length)];
        console.log("Generated random card:", value, "of", suit);
        return { suit, value };
    }

    function getCardImageFileName(value) {
        switch (value) {
            case 'A':
                return '1.png';  // As
            case 'J':
                return '11.png'; // Valet
            case 'Q':
                return '12.png'; // Dame
            case 'K':
                return '13.png'; // Roi
            default:
                return `${value}.png`; // Les autres valeurs (2-10)
        }
    }

    function renderCard(card, container) {
        console.log("Rendering card:", card.value, "of", card.suit);
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'card-animation');

        const cardImage = document.createElement('img');
        const cardFileName = getCardImageFileName(card.value);
        cardImage.src = `images/cards/${card.suit}/${cardFileName}`;
        cardImage.alt = `${card.value} of ${card.suit}`;
        
        cardElement.appendChild(cardImage);
        container.appendChild(cardElement);
    }
    document.addEventListener("DOMContentLoaded", function() {
        // Show only the players that are in the game (max 8 players)
        const gamePlayers = <%= JSON.stringify(game.players) %>;
        gamePlayers.forEach((player, index) => {
            if (index < 8) {
                document.getElementById(`player-${index + 1}`).style.display = 'block';
            }
        });
        document.querySelector('.dealer-area').style.display = 'block';
        document.querySelector('.community-cards-area').style.display = 'block';

        // Help button functionality
        const helpButton = document.getElementById('help-button');
        const helpPopup = document.getElementById('help-popup');
        const closeHelp = document.getElementById('close-help');

        helpButton.addEventListener('click', function() {
            helpPopup.style.display = 'block';
        });

        closeHelp.addEventListener('click', function() {
            helpPopup.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === helpPopup) {
                helpPopup.style.display = 'none';
            }
        });

        // Rules button functionality
        const rulesButton = document.getElementById('rules-button');
        const rulesPopup = document.getElementById('rules-popup');
        const closeRules = document.getElementById('close-rules');

        rulesButton.addEventListener('click', function() {
            rulesPopup.style.display = 'block';
        });

        closeRules.addEventListener('click', function() {
            rulesPopup.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === rulesPopup) {
                rulesPopup.style.display = 'none';
            }
        });

        // Update current turn indicator
        function updateCurrentTurn(playerName) {
            document.getElementById('current-player').textContent = playerName;
        }

        // Add notifications for player actions
        function addNotification(message) {
            const notificationArea = document.getElementById('notifications-area');
            const notification = document.createElement('p');
            notification.textContent = message;
            notificationArea.appendChild(notification);
            setTimeout(() => {
                notificationArea.removeChild(notification);
            }, 5000); // Remove the notification after 5 seconds
        }

        // Example usage of notifications and current turn
        addNotification('<%= game.players[parseInt(RegExp.$1) - 1].username %> has raised by $2 tokens');
        updateCurrentTurn('<%= game.players[parseInt(RegExp.$1) - 1].username %>');

        // Update results after each hand
        function updateResults(results) {
            const resultsArea = document.getElementById('results-area');
            const resultsLog = document.getElementById('results-log');
            resultsLog.innerHTML = ''; // Clear previous results
            results.forEach(result => {
                const resultElement = document.createElement('p');
                resultElement.textContent = result;
                resultsLog.appendChild(resultElement);
            });
            resultsArea.style.display = 'block';
        }

        // Example usage of results update
        updateResults(['<%= game.players[parseInt(RegExp.$1) - 1].username %> won $2 tokens', '<%= game.players[parseInt(RegExp.$3) - 1].username %> lost $4 tokens']);
    });
    function startGame() {
        console.log("Starting game...");

        playerHand.innerHTML = "";
        dealerHand.innerHTML = "";
        communityCards.innerHTML = "";
        opponentHands.forEach(hand => hand.innerHTML = "");

        // Distribuer les cartes aux joueurs
        setTimeout(() => {
            const playerCard1 = getRandomCard();
            renderCard(playerCard1, playerHand);
        }, 500);
        setTimeout(() => {
            const playerCard2 = getRandomCard();
            renderCard(playerCard2, playerHand);
        }, 1000);

        opponentHands.forEach((hand, index) => {
            setTimeout(() => {
                const opponentCard1 = getRandomCard();
                renderCard(opponentCard1, hand);
            }, 1500 + index * 500);
            setTimeout(() => {
                const opponentCard2 = getRandomCard();
                renderCard(opponentCard2, hand);
            }, 2000 + index * 500);
        });

        // Distribuer les cartes du croupier
        setTimeout(() => {
            const dealerCard1 = getRandomCard();
            renderCard(dealerCard1, dealerHand);
        }, 2500);
        setTimeout(() => {
            const dealerCard2 = getRandomCard();
            renderCard(dealerCard2, dealerHand);
        }, 3000);

        // Distribuer les cartes communautaires
        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const communityCard = getRandomCard();
                    renderCard(communityCard, communityCards);
                }, i * 1000);
            }
        }, 3500);

        console.log("Game started. Player, opponents, and dealer have received cards.");
    }

    startGame();
});
