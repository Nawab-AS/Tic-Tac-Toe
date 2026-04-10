const { createApp, ref } = Vue;

const table = document.getElementById('board').children;
var board = ref([]); // set empty board
let winner = ref(null);
let winningCells = ref([]);
let actionMessage = ref("");
let difficulty = ref("two-player");

let currentPlayer = "X";
let aiPlayer = "O";

function resetBoard(size) {
    board.value = Array.from({ length: size }, () => Array(size).fill(""))
    actionMessage.value = "Start as O";
}
resetBoard(3); // initialize board

function makeMove(row, col, isAiMove = false) {
    if (winner.value) return;
    if (board.value[row][col] != "") return;

    // In AI modes, block manual clicks when it's AI's turn.
    if (difficulty.value != "two-player" && currentPlayer == aiPlayer && !isAiMove) return;

    actionMessage.value = "Reset Board";

    board.value[row][col] = currentPlayer;
    currentPlayer = currentPlayer == "X" ? "O" : "X";

    winner.value = checkWin();
    if (winner.value) {
        onWin();
        return;
    }

    // delay AI move
    if (difficulty.value != "two-player" && currentPlayer == aiPlayer) {
        setTimeout(aiMove, 100 + Math.random() * 200); // 100-300ms
    }
}

function checkWin() {
    for (let i = 0; i < 3; i++) {
        if (board.value[i][0] && board.value[i][0] == board.value[i][1] && board.value[i][1] == board.value[i][2]) {
            winningCells.value = [[i, 0], [i, 1], [i, 2]];
            return board.value[i][0];
        }
        if (board.value[0][i] && board.value[0][i] == board.value[1][i] && board.value[1][i] == board.value[2][i]) {
            winningCells.value = [[0, i], [1, i], [2, i]];
            return board.value[0][i];
        }
    }
    if (board.value[0][0] && board.value[0][0] == board.value[1][1] && board.value[1][1] == board.value[2][2]) {
        winningCells.value = [[0, 0], [1, 1], [2, 2]];
        return board.value[0][0];
    }
    if (board.value[0][2] && board.value[0][2] == board.value[1][1] && board.value[1][1] == board.value[2][0]) {
        winningCells.value = [[0, 2], [1, 1], [2, 0]];
        return board.value[0][2];
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
        resetBoard(3);
        winner.value = null;
        currentPlayer = "X";
        if (difficulty.value != "two-player" && currentPlayer == aiPlayer) aiMove();
        
        winningCells.value = [];
    }
}

function changeDifficulty() {
    resetBoard(3);
    winner.value = null;
    winningCells.value = [];
}


function onWin() {
    setTimeout(() => {
        // alert(winner.value + " wins!");
        actionMessage.value = "Play Again";
    }, 500);
}

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
        }
    }
}).mount("#app");
