const { createApp, ref } = Vue;

const table = document.getElementById('board').children;
var board = ref(Array.from({ length: 3 }, () => Array(3).fill(""))); // set empty board

let currentPlayer = "X";

function makeMove(row, col) {
    if (board.value[row][col] == "") {
        board.value[row][col] = currentPlayer;
        currentPlayer = currentPlayer == "X" ? "O" : "X";
    }
}

// Mount Vue
createApp({
    setup() {
        return {
            board,
            makeMove
        }
    }
}).mount("body");
