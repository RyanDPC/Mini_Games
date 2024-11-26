// Variables
const columns = 7;
const rows = 6;
let Player = 1;
let board = [];
let GameEnd = false;

function Board() {
    board = Array.from({ length: rows }, () => Array(columns).fill(0));
    GameEnd = false;
    const gameDiv = document.getElementById("game");
    gameDiv.innerHTML = '';
    document.getElementById("message").textContent = '';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gameDiv.appendChild(cell);
        }
    }
    updateBoard();
}
function updateBoard() {

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.classList.remove('player1', 'player2');
            if (board[row][col] === 1) {
                cell.classList.add('player1');
            } else if (board[row][col] === 2) {
                cell.classList.add('player2');
            }
        }
    }
}
function Token(col) {
    if (GameEnd) return;
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            board[row][col] = Player;
            updateBoard();
            if (Win(row, col)) {
                endGame(`Le Joueur ${Player} a WIN !`);
                return;
            } else if (isBoardFull()) {
                endGame("DRAW!");
            }
            Player = Player === 1 ? 2 : 1;
            return;
        }
    }
    alert("Cette colonne est pleine !");
}
function Win(row, col) {
    const directions = [
        { dr: 1, dc: 0 },
        { dr: 0, dc: 1 },
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 }
    ];

    for (const { dr, dc } of directions) {
        let count = 1;
        count += countDirection(row, col, dr, dc);
        count += countDirection(row, col, -dr, -dc);
        if (count === 4) return true;
    }
    return false;
}
function endGame(message) {
    GameEnd = true;
    document.getElementById("message").textContent = message;
}
function isBoardFull() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col] === 0) return false;
        }
    }
    return true;
}
function countDirection(row, col, dr, dc) {
    let count = 0;
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < rows && c >= 0 && c < columns && board[r][c] === Player) {
        count++;
        r += dr;
        c += dc;
    }
    return count;
}

function handleCellClick(event) {
    const col = event.target.dataset.col;
    Token(parseInt(col));
    const row = event.target.dataset.row;
}

document.getElementById('resetButton').addEventListener('click', () => {
    Player = 1;
    Board();
});

window.onload = Board;