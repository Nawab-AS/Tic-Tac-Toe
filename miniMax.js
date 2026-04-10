function minimax(board, depth, player, aiPlayer, alpha = -Infinity, beta = Infinity) {
    const winner = checkWinner(board);

    if (winner === aiPlayer) return 10 - depth; // win
    if (winner && winner !== aiPlayer) return depth - 10; // loss
    if (board.every(row => row.every(cell => cell))) return 0; // draw

    const enemy = player === "X" ? "O" : "X";
    const isMaxTurn = player === aiPlayer;

    if (isMaxTurn) {
        let bestScore = -Infinity;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    board[i][j] = player;
                    const score = minimax(board, depth + 1, enemy, aiPlayer, alpha, beta);
                    board[i][j] = "";

                    bestScore = Math.max(bestScore, score);
                    alpha = Math.max(alpha, bestScore);

                    if (beta <= alpha) return bestScore;
                }
            }
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === "") {
                board[i][j] = player;
                const score = minimax(board, depth + 1, enemy, aiPlayer, alpha, beta);
                board[i][j] = "";

                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, bestScore);

                if (beta <= alpha) return bestScore;
            }
        }
    }

    return bestScore;
}

function checkWinner(board) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0];
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return board[0][i];
    }

    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[0][2];

    return null;
}

function findBestMove(board, aiPlayer, stupidity = 0) {
    const humanPlayer = aiPlayer === "X" ? "O" : "X";
    let moves = {};

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == "") {
                board[i][j] = aiPlayer;
                const score = minimax(board, 0, humanPlayer, aiPlayer);
                board[i][j] = "";

                moves[`${i},${j}`] = score;
            }
        }
    }

    moves = Object.entries(moves).sort((a, b) => b[1] - a[1]); // sort scores from best to worst

    // get the 1-<stupidity>th unique best moves
    const uniqueScores = moves.map(entry => entry[1]).filter((score, index, self) => self.indexOf(score) === index);
    const selectedDifficulty = uniqueScores[Math.min(stupidity, uniqueScores.length - 1)];
    moves = moves.filter(entry => entry[1] === selectedDifficulty); // filter moves that match the selected difficulty score

    moves = moves.map(entry => entry[0].split(",").map(Number)). // convert "i,j" back to [i, j]
        map(move => ({ row: move[0], col: move[1] })); // convert to {row, col} format

    return moves[Math.floor(Math.random() * moves.length)]; // randomly pick one of the allowed moves
}