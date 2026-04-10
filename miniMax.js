function getCandidateMoves(board) {
    const size = board.length;
    const center = (size - 1) / 2;
    const occupied = [];
    const empty = [];

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === "") empty.push({ row: i, col: j });
            else occupied.push([i, j]);
        }
    }

    // Prefer center-ish moves first to improve alpha-beta pruning.
    empty.sort((a, b) => {
        const da = Math.abs(a.row - center) + Math.abs(a.col - center);
        const db = Math.abs(b.row - center) + Math.abs(b.col - center);
        return da - db;
    });

    return empty;
}

function evaluateBoard(board, aiPlayer) {
    const humanPlayer = aiPlayer === "X" ? "O" : "X";
    const size = board.length;
    let score = 0;

    const lineScore = (aiCount, humanCount) => {
        if (aiCount > 0 && humanCount > 0) return 0;
        if (aiCount > 0) return Math.pow(4, aiCount);
        if (humanCount > 0) return -Math.pow(4, humanCount);
        return 0;
    };

    for (let i = 0; i < size; i++) {
        let rowAi = 0, rowHuman = 0;
        let colAi = 0, colHuman = 0;

        for (let j = 0; j < size; j++) {
            if (board[i][j] === aiPlayer) rowAi++;
            else if (board[i][j] === humanPlayer) rowHuman++;

            if (board[j][i] === aiPlayer) colAi++;
            else if (board[j][i] === humanPlayer) colHuman++;
        }

        score += lineScore(rowAi, rowHuman);
        score += lineScore(colAi, colHuman);
    }

    let diagAi = 0, diagHuman = 0;
    let antiDiagAi = 0, antiDiagHuman = 0;
    for (let i = 0; i < size; i++) {
        if (board[i][i] === aiPlayer) diagAi++;
        else if (board[i][i] === humanPlayer) diagHuman++;

        const j = size - 1 - i;
        if (board[i][j] === aiPlayer) antiDiagAi++;
        else if (board[i][j] === humanPlayer) antiDiagHuman++;
    }

    score += lineScore(diagAi, diagHuman);
    score += lineScore(antiDiagAi, antiDiagHuman);

    return score;
}

function minimax(board, depth, player, aiPlayer, alpha = -Infinity, beta = Infinity, maxDepth = Infinity, deadline = Infinity) {
    const winner = checkWin(board, false);

    if (winner === aiPlayer) return 10 - depth; // win
    if (winner && winner !== aiPlayer) return depth - 10; // loss
    if (board.every(row => row.every(cell => cell))) return 0; // draw
    if (depth >= maxDepth || Date.now() >= deadline) return evaluateBoard(board, aiPlayer);

    const enemy = player === "X" ? "O" : "X";
    const isMaxTurn = player === aiPlayer;
    const candidates = immediateWins(board, player).concat(getCandidateMoves(board));

    if (isMaxTurn) {
        let bestScore = -Infinity;

        for (const move of candidates) {
            board[move.row][move.col] = player;
            const score = minimax(board, depth + 1, enemy, aiPlayer, alpha, beta, maxDepth, deadline);
            board[move.row][move.col] = "";

            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, bestScore);

            if (beta <= alpha || Date.now() >= deadline) return bestScore;
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (const move of candidates) {
        board[move.row][move.col] = player;
        const score = minimax(board, depth + 1, enemy, aiPlayer, alpha, beta, maxDepth, deadline);
        board[move.row][move.col] = "";

        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, bestScore);

        if (beta <= alpha || Date.now() >= deadline) return bestScore;
    }

    return bestScore;
}

function immediateWins(board, player) {
    const candidates = getCandidateMoves(board);
    const winningMoves = [];

    for (const move of candidates) {
        board[move.row][move.col] = player;
        if (checkWin(board, false) === player) {
            winningMoves.push(move);
        }
        board[move.row][move.col] = "";
    }

    return winningMoves;
}

function findBestMove(board, aiPlayer, stupidity = 0) {
    const humanPlayer = aiPlayer === "X" ? "O" : "X";
    const size = board.length;
    const maxDepth = size <= 3 ? size * size : (size === 4 ? 6 : (size === 5 ? 4 : 3));
    const timeLimit = stupidity === 0 ? 1500 : (stupidity === 1 ? 900 : 450);
    const deadline = Date.now() + timeLimit;
    const candidates = getCandidateMoves(board);
    const immediateWinningMoves = immediateWins(board, aiPlayer);

    let moves = {};

    for (const move of immediateWinningMoves) {
        moves[`${move.row},${move.col}`] = Infinity;
    }

    for (const candidate of candidates) {
        const key = `${candidate.row},${candidate.col}`;
        if (moves[key] === Infinity) continue;

        board[candidate.row][candidate.col] = aiPlayer;
        const score = minimax(board, 0, humanPlayer, aiPlayer, -Infinity, Infinity, maxDepth, deadline);
        board[candidate.row][candidate.col] = "";

        moves[key] = score;

        if (Date.now() >= deadline) break;
    }

    if (Object.keys(moves).length === 0) {
        return candidates[0] || null;
    }

    moves = Object.entries(moves).sort((a, b) => b[1] - a[1]); // sort scores from best to worst

    // get the 1-<stupidity>th unique best moves
    const uniqueScores = moves.map(entry => entry[1]).filter((score, index, self) => self.indexOf(score) === index);
    const selectedDifficulty = uniqueScores[Math.min(stupidity, uniqueScores.length - 1)];
    moves = moves.filter(entry => entry[1] === selectedDifficulty);

    moves = moves.map(entry => entry[0].split(",").map(Number)). // convert "i,j" back to [i, j]
        map(move => ({ row: move[0], col: move[1] })); // convert to {row, col} format

    return moves[Math.floor(Math.random() * moves.length)]; // randomly pick one of the allowed moves
}