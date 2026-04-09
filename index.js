const table = document.getElementById('board').children;
var board = new Array(3).fill(new Array(3))



function buttonPressed(event) {
    const [buttonX, buttonY] = event.srcElement.pos
    console.log(`button pressed: row #${buttonY+1}, column#${buttonX+1}`)
}

// initialize board buttons
for (let buttonY = 0; buttonY < table.length; buttonY++) {
    // console.log(table[buttonX])
    for (let buttonX = 0; buttonX < table[buttonY].children.length; buttonX++) {
        let button = table[buttonY].children[buttonX];
        // console.log(button)
        button.pos = [buttonX, buttonY]
        button.onclick = buttonPressed;
    }
}