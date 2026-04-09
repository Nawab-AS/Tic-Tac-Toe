const table = document.getElementById('board').children;
var rawBoard = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
const boardHandler = {
    get(target, prop) {
        const [x, y] = prop.split(",");
        return target[y][x];
    },
    set(target, prop, value) {
        const [x, y] = prop.split(",");
        target[y][x] = value;
        table[y].children[x].innerText = value;
        return true;
    }
}
const board = new Proxy(rawBoard, boardHandler);

currentPlayer = "X";

function buttonPressed(event) {
    const [buttonX, buttonY] = event.srcElement.pos
    console.log(`button pressed: row #${buttonY+1}, column#${buttonX+1}`)
    board[`${buttonX},${buttonY}`] = currentPlayer;
    
    // Switch players
    currentPlayer = currentPlayer === "X" ? "O" : "X";
}

// initialize board buttons
for (let buttonY = 0; buttonY < table.length; buttonY++) {
    for (let buttonX = 0; buttonX < table[buttonY].children.length; buttonX++) {
        let button = table[buttonY].children[buttonX];
        button.pos = [buttonX, buttonY];
        button.onclick = buttonPressed;
    }
}
