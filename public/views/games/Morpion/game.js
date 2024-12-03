// Variables pour le jeu
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
const statusDisplay = document.querySelector('.status');

// Combinaisons gagnantes
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
    [0, 4, 8], [2, 4, 6] // diagonales
];

// Messages
const winningMessage = () => `Le joueur ${currentPlayer} a gagné !`;
const drawMessage = () => `Match nul !`;
const currentPlayerTurn = () => `C'est le tour du joueur ${currentPlayer}`;

// Initialisation du statut
statusDisplay.innerHTML = currentPlayerTurn();

// Fonction pour gérer les clics
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== "" || !isGameActive) {
        return;
    }

    // Mise à jour de la case et affichage
    board[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    // Vérification du résultat
    handleResultValidation();
}

// Vérifie si le jeu est gagné ou si c'est un nul
function handleResultValidation() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        isGameActive = false;
        return;
    }

    // Vérifie s'il y a un nul
    if (!board.includes("")) {
        statusDisplay.innerHTML = drawMessage();
        isGameActive = false;
        return;
    }

    // Changer de joueur
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

// Réinitialise le jeu
function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = "X";
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

// Ajoute l'événement de clic à chaque case
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
