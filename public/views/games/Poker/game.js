
document.addEventListener('DOMContentLoaded', () => {
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