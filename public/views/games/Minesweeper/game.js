const width = 10;
const height = 10;
const numMines = 15;
let board = [];
let gameOver = false;
let firstClick = true;

function initializeGame() {
  board = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      mine: false,
      revealed: false,
      flag: false,
      adjacentMines: 0
    }))
  );

  renderBoard();
}

function placeMinesAvoidingFirstClick(firstX, firstY) {
  let minesPlaced = 0;

  while (minesPlaced < numMines) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);

    if (!board[y][x].mine && (x !== firstX || y !== firstY) && !isAdjacent(x, y, firstX, firstY)) {
      board[y][x].mine = true;
      minesPlaced++;
    }
  }
}

function isAdjacent(x, y, firstX, firstY) {
  return Math.abs(x - firstX) <= 1 && Math.abs(y - firstY) <= 1;
}

function calculateAdjacentMines() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!board[y][x].mine) {
        board[y][x].adjacentMines = getAdjacentCells(x, y)
          .filter(cell => cell.mine)
          .length;
      }
    }
  }
}

function getAdjacentCells(x, y) {
  const cells = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const nx = x + i;
      const ny = y + j;
      if ((i !== 0 || j !== 0) && nx >= 0 && nx < width && ny >= 0 && ny < height) {
        cells.push({ ...board[ny][nx], x: nx, y: ny });
      }
    }
  }
  return cells;
}

function renderBoard() {
  const gameDiv = document.getElementById('game');
  gameDiv.innerHTML = '';
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      cellDiv.addEventListener('click', () => onClickCell(x, y));
      cellDiv.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        onRightClickCell(x, y);
      });

      if (cell.revealed) {
        cellDiv.classList.add('revealed');
        if (cell.mine) {
          const img = document.createElement('img');
          img.src = '../../Assets/images/mine.png';
          img.alt = 'Mine';
          img.classList.add('icon');
          cellDiv.appendChild(img);
        } else if (cell.adjacentMines > 0) {
          cellDiv.textContent = cell.adjacentMines;
        }
      } else if (cell.flag) {
        const img = document.createElement('img');
        img.src = '../../Assets/images/flag.png';
        img.alt = 'Flag';
        img.classList.add('icon');
        cellDiv.appendChild(img);
      }
      gameDiv.appendChild(cellDiv);
    });
  });
}

function onClickCell(x, y) {
  if (gameOver || board[y][x].revealed || board[y][x].flag) return;

  if (firstClick) {
    firstClick = false;
    placeMinesAvoidingFirstClick(x, y);
    calculateAdjacentMines();
  }

  if (board[y][x].mine) {
    gameOver = true;
    revealAllMines();
    alert("Game Over!");
  } else {
    revealCell(x, y);
    checkWinCondition();
  }
  renderBoard();
}

function revealCell(x, y) {
  if (board[y][x].revealed || board[y][x].flag) return;
  board[y][x].revealed = true;

  if (board[y][x].adjacentMines === 0) {
    getAdjacentCells(x, y).forEach((adjCell) => {
      revealCell(adjCell.x, adjCell.y);
    });
  }
}

function onRightClickCell(x, y) {
  if (gameOver || board[y][x].revealed) return;
  board[y][x].flag = !board[y][x].flag;
  renderBoard();
}

function revealAllMines() {
  board.forEach(row => row.forEach(cell => {
    if (cell.mine) cell.revealed = true;
  }));
}

function checkWinCondition() {
  const allCellsRevealed = board.flat().every(cell =>
    (cell.mine && !cell.revealed) || (!cell.mine && cell.revealed)
  );
  if (allCellsRevealed) {
    gameOver = true;
    alert("Bravo ! Vous avez gagné !");
  }
}

initializeGame();