let board = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let ai = "O";
let gameOver = false;

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");

// Draw cells
function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.innerText = cell;
    div.addEventListener("click", () => humanMove(i));
    boardEl.appendChild(div);
  });
}

// Human move
function humanMove(index) {
  if (board[index] === "" && !gameOver) {
    board[index] = human;
    if (checkWinner(board, human)) {
      statusEl.innerHTML = "You win! <span class='celebrate'>🎉</span>";
      boardEl.classList.add('win-effect');
      gameOver = true;
      return;
    } else if (isDraw()) {
      statusEl.innerText = "It's a draw!";
      return;
    }
    renderBoard();
    setTimeout(aiMove, 200); // let AI make move
  }
}

// AI move using Minimax
function aiMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  board[move] = ai;
  if (checkWinner(board, ai)) {
    statusEl.innerHTML = "AI wins! <span class='celebrate'>🤖</span>";
    boardEl.classList.add('win-effect');
    gameOver = true;
  } else if (isDraw()) {
    statusEl.innerText = "It's a draw!";
  }
  renderBoard();
}

// Minimax algorithm
function minimax(newBoard, depth, isMaximizing) {
  if (checkWinner(newBoard, ai)) return 10 - depth;
  if (checkWinner(newBoard, human)) return depth - 10;
  if (isDraw()) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = ai;
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = human;
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Check for win
function checkWinner(b, player) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winCombos.some(combo => combo.every(i => b[i] === player));
}

// Check for draw
function isDraw() {
  return board.every(cell => cell !== "") && !checkWinner(board, human) && !checkWinner(board, ai);
}

// Reset
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  statusEl.innerText = "";
  boardEl.classList.remove('win-effect');
  renderBoard();
}

// Init
renderBoard();
