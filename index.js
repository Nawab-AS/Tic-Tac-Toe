const { createApp, ref } = Vue;

const table = document.getElementById('board').children;
var board = ref([]); // set empty board
let winner = null;
let actionMessage = ref("");

let currentPlayer = "X";

function resetBoard(size) {
    board.value = Array.from({ length: size }, () => Array(size).fill(""))
    actionMessage.value = "Start as O";
}
resetBoard(3); // initialize board

function makeMove(row, col) {
    if (winner) return;

    actionMessage.value = "Reset Board";

    if (board.value[row][col] == "") {
        board.value[row][col] = currentPlayer;
        currentPlayer = currentPlayer == "X" ? "O" : "X";
    }

    winner = checkWin();
    if (winner) onWin();
}

function checkWin() {
    for (let i = 0; i < 3; i++) {
        if (board.value[i][0] && board.value[i][0] == board.value[i][1] && board.value[i][1] == board.value[i][2]) {
            return board.value[i][0];
        }
        if (board.value[0][i] && board.value[0][i] == board.value[1][i] && board.value[1][i] == board.value[2][i]) {
            return board.value[0][i];
        }
    }
    if (board.value[0][0] && board.value[0][0] == board.value[1][1] && board.value[1][1] == board.value[2][2]) {
        return board.value[0][0];
    }
    if (board.value[0][2] && board.value[0][2] == board.value[1][1] && board.value[1][1] == board.value[2][0]) {
        return board.value[0][2];
    }

    return null;
}


function action() {
    if (actionMessage.value.startsWith("Start as")) {
        currentPlayer = actionMessage.value.endsWith("X") ? "X" : "O";
        actionMessage.value = "Start as " + (currentPlayer == "X" ? "O" : "X");
        return;
    }

    if ( (actionMessage.value == "Reset Board" && !winner) || actionMessage.value == "Play Again") {
        resetBoard(3);
    }
}


function onWin() {
    setTimeout(() => {
        alert(winner + " wins!");
        actionMessage.value = "Play Again";
        resetBoard(3);
        winner = null;
    }, 1000);
}

// Mount Vue
createApp({
    setup() {
        return {
            board,
            makeMove,
            action,
            actionMessage,
        }
    }
}).mount("#app");
