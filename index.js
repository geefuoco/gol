const canvas = document.getElementById("canvas")
const button = document.getElementById("toggle-start")
const stepButton = document.getElementById("step-through")
const resetButton = document.getElementById("reset")
const context = canvas.getContext("2d")
const CELL_SIZE = 40;
const FILL_COLOR = "#008299"
const ROWS = canvas.width / CELL_SIZE
const COLS = canvas.height / CELL_SIZE
const SPEED = 100

let state = make2dArray(COLS, ROWS)
let running = false
let animationFrameId = null
let stopPlaying = false

context.strokeStyle = "#FFF"
context.lineWidth = 1
// Randomly Initialize the starting state
// TODO make user be able to click cell to turn it on or off
fillRandomly(state)
const INIT_STATE = copyState(state)

function drawState(state) {
    for (let i=0; i < state.length; i++) {
        let y = i * CELL_SIZE
        for (let j=0; j < state[i].length; j++) {
            let x = j * CELL_SIZE
            context.fillStyle = state[i][j] == 1 ? "white" : "black"
            context.strokeRect(x, y, CELL_SIZE, CELL_SIZE)
            context.fillRect(x, y, CELL_SIZE, CELL_SIZE)
        }
    }
}

function make2dArray(cols, rows) {
    let arr = new Array(cols).fill(0)
    for (let i=0; i < arr.length; i++) {
        arr[i] = new Array(rows).fill(0)
    }
    return arr
}

function fillRandomly(arr) {
    for (let i=0; i < arr.length; i++) {
        for(let j=0; j < arr[i].length; j++){
            if (Math.random() > 0.75) {
                arr[i][j] = 1
            }
        }
    }
}

function copyState(state) {
    const newState = []
    for(let i=0; i < state.length; i++) {
        const row = state[i]
        const newRow = []
        for(let j=0; j < row.length; j++) {
            newRow[j] = row[j]
        }
        newState[i] = newRow
    }
    return newState
}

function countNeighbors(state, i, j) {
    let dirs = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, -1]
    ]
    let count = 0
    for(let k =0; k < dirs.length; k++) {
        const dir = dirs[k]
        if((j + dir[0] >= 0) && 
           (j + dir[0] < state[0].length) && 
           (i + dir[1] >= 0) && 
           (i + dir[1] < state.length)
         ) {
            count += state[i + dir[1]][j + dir[0]]
        }
    }
    return count
}

function updateState(state) {
    const newState = make2dArray(COLS, ROWS)

    for (let i=0; i < state.length; i++) {
        for(let j=0; j < state[i].length; j++) {
            let count = countNeighbors(state, i, j)
            if (count < 2 || count > 3) {
                newState[i][j] = 0
            } else if (count === 3) {
                newState[i][j] = 1
            } else {
                newState[i][j] = state[i][j]
            }
        }
    }
    return newState
}

function stepThroughGame(state) {
    const newState = updateState(state)
    drawState(newState)
    return newState
}

function playGame(state) {
    if (stopPlaying) {
        return
    }
    drawState(state)
    const newState = updateState(state)
    setTimeout(function() {
        requestAnimationFrame(() => playGame(newState))
    }, SPEED)
}

function handleToggleStart() {
    if (!running) {
        running = true
        stopPlaying = false
        console.log("starting game")
        animationFrameId = requestAnimationFrame(() => playGame(state))
    } else {
        console.log("stopping game")
        if(animationFrameId) {
            cancelAnimationFrame(animationFrameId)
        }
        stopPlaying = true
        running = false
    }
}

button.addEventListener("click", handleToggleStart)
stepButton.addEventListener("click", function() {
    console.log("stepping through game")
    state = stepThroughGame(state)
})
resetButton.addEventListener("click", function() {
    console.log("resetting to initial state")
    state = INIT_STATE
    drawState(state)
})

drawState(state)
