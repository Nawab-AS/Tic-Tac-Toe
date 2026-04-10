const { createApp, ref, watch } = Vue;

const board = ref([]); // set empty board
const winner = ref(null);
const winningCells = ref([]);
const actionMessage = ref("");
const difficulty = ref("two-player");
const gridSize = ref(3);

let currentPlayer = "X";
let aiPlayer = "O";

function resetBoard() {
    board.value = Array.from({ length: gridSize.value }, () => Array(gridSize.value).fill(""))
    actionMessage.value = "Start as O";
    winningCells.value = [];
    winner.value = null;

    if (currentPlayer == aiPlayer) {
        setTimeout(aiMove, 100 + Math.random() * 200); // 100-300ms
    }
}
resetBoard(); // initialize board

function makeMove(row, col, isAiMove = false) {
    if (winner.value) return;
    if (board.value[row][col] != "") return;

    // In AI modes, block manual clicks when it's AI's turn.
    if (difficulty.value != "two-player" && currentPlayer == aiPlayer && !isAiMove) return;

    actionMessage.value = "Reset Board";

    board.value[row][col] = currentPlayer;
    currentPlayer = currentPlayer == "X" ? "O" : "X";

    winner.value = checkWin(board.value, true);
    if (winner.value) {
        onWin();
        return;
    }

    // delay AI move
    if (difficulty.value != "two-player" && currentPlayer == aiPlayer) {
        setTimeout(aiMove, 100 + Math.random() * 200); // 100-300ms
    }
}

cache = {};
function checkWin(board, move) {
    let cells, win;
    for (let i = 0; i < board.length; i++) {
        
        // horizontal
        win = true;
        start = board[i][0];
        cells = [];
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] != start) {
                win = false;
                break;
            }
            cells.push([i, j]);
        }
        if (win && start) {
            if (move) winningCells.value = cells;
            return start;
        }


        // vertical
        win = true;
        start = board[0][i];
        cells = [];
        for (let j = 0; j < board[i].length; j++) {
            if (board[j][i] != start) {
                win = false;
                break;
            }
            cells.push([j, i]);
        }
        if (start && win) {
            if (move) winningCells.value = cells;
            return board[0][i];
        }
    }

    // diagonal top-left to bottom-right
    win = true;
    cells = [];
    for (let i = 0; i < board.length; i++) {
        cells.push([i, i]);
        if (board[i][i] != board[0][0]) {
            win = false;
            break;
        }
    }
    if (win && board[0][0]) {
        if (move) winningCells.value = cells;
        return board[0][0];
    }


    // diagonal top-right to bottom-left
    win = true;
    cells = [];
    for (let i = 0; i < board.length; i++) {
        cells.push([i, board.length - 1 - i]);
        if (board[i][board.length - 1 - i] != board[0][board.length - 1]) {
            win = false;
            break;
        }
    }
    if (win && board[0][board.length - 1]) {
        if (move) winningCells.value = cells;
        return board[0][board.length - 1];
    }

    return null;
}


function aiMove() {
    if (difficulty.value == "two-player" || winner.value || currentPlayer != aiPlayer) return;

    // randomly picks the 1-<stupidity>th best move
    let stupidity = 0; // hard
    if (difficulty.value == "medium") stupidity = 1;
    if (difficulty.value == "easy") stupidity = 3;

    const move = findBestMove(board.value, aiPlayer, stupidity);
    if (move) {
        makeMove(move.row, move.col, true);
    }
}


function action() {
    if (actionMessage.value.startsWith("Start as")) {
        currentPlayer = actionMessage.value.endsWith("X") ? "X" : "O";
        actionMessage.value = "Start as " + (currentPlayer == "X" ? "O" : "X");
        
        if (currentPlayer == "O") aiMove();
        return;
    }

    if ( (actionMessage.value == "Reset Board" && !winner.value) || actionMessage.value == "Play Again") {
        resetBoard();
        winner.value = null;
        currentPlayer = "X";
        if (difficulty.value != "two-player" && currentPlayer == aiPlayer) aiMove();
        
        winningCells.value = [];
    }
}

function changeDifficulty() {
    resetBoard();
    winner.value = null;
    winningCells.value = [];
}


function onWin() {
    setTimeout(() => {
        // alert(winner.value + " wins!");
        actionMessage.value = "Play Again";
    }, 500);
}

const boardLength = ref(170);
watch(gridSize, async () => {
    await (new Promise(resolve => setTimeout(resolve, 100))); // apparently the nextTick is too fast for DOM updates?!
    const boardElement = document.getElementById("board");
    boardLength.value = boardElement.clientWidth;
    console.log("Board length updated:", boardLength.value);
}, { immediate: true });


// Mount Vue
createApp({
    setup() {
        return {
            board,
            makeMove,
            action,
            actionMessage,
            winningCells,
            winner,
            difficulty,
            changeDifficulty,
            gridSize,
            resetBoard,
            boardLength
        }
    }
}).mount("#app");
