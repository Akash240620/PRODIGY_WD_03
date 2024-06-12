const gameBoard = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const gameResult = document.getElementById('game-result');
const xWinsDisplay = document.getElementById('x-wins');
const oWinsDisplay = document.getElementById('o-wins');
const tiesDisplay = document.getElementById('ties');
const winLine = document.getElementById('win-line');

let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let xWins = 0;
let oWins = 0;
let ties = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute('data-index');

    if (gameState[cellIndex] !== null || checkWinner()) {
        return;
    }

    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWinner()) {
        gameResult.textContent = `${currentPlayer} wins!`;
        updateWinCount(currentPlayer);
        drawWinLine();
    } else if (gameState.every(cell => cell !== null)) {
        gameResult.textContent = 'It\'s a tie!';
        ties++;
        tiesDisplay.textContent = `Ties: ${ties}`;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWinner() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameState[a] !== null && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
}

function drawWinLine() {
    const winningCombination = winningCombinations.find(combination => {
        const [a, b, c] = combination;
        return gameState[a] !== null && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });

    if (winningCombination) {
        const [a, b, c] = winningCombination;
        const start = cells[a].getBoundingClientRect();
        const end = cells[c].getBoundingClientRect();
        const gameBoardRect = gameBoard.getBoundingClientRect();
        
        const x1 = start.left + (start.width / 2) - gameBoardRect.left;
        const y1 = start.top + (start.height / 2) - gameBoardRect.top;
        const x2 = end.left + (end.width / 2) - gameBoardRect.left;
        const y2 = end.top + (end.height / 2) - gameBoardRect.top;

        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

        winLine.style.width = `${length}px`;
        winLine.style.transform = `rotate(${angle}deg)`;
        winLine.style.top = `${y1}px`;
        winLine.style.left = `${x1}px`;
        winLine.style.display = 'block';
    }
}

function updateWinCount(player) {
    if (player === 'X') {
        xWins++;
        xWinsDisplay.textContent = `X Wins: ${xWins}`;
    } else {
        oWins++;
        oWinsDisplay.textContent = `O Wins: ${oWins}`;
    }
}

function resetGame() {
    gameState.fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    gameResult.textContent = '';
    winLine.style.display = 'none';
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
