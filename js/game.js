'use strict'

var gBoard;
const MINE = '💣'
const FLAG = '⛳'
var gBoardSize = 8
var gGameIsOn = false
var gStopper;
var mineCount = 0
const elHappy = document.querySelector('.happy')
const elHeart = document.querySelector('.hearts')
const elHeart1 = document.querySelector('.hearts1')
const elHeart2 = document.querySelector('.hearts2')




function init() {
    console.log('hello')
    gBoard = buildBoard(gBoardSize)
    console.table(gBoard)
    addMines(gBoard, 2)
    updateValuesOfMinesAround(gBoard)
    renderBoard(gBoard)
    gGameIsOn = true
}

function buildBoard(boardSize) {
    var board = [];
    for (var i = 0; i < boardSize; i++) {
        board[i] = []

        for (var j = 0; j < boardSize; j++) {
            board[i][j] = { value: 0, isShown: false, isFlag: false };
        }
    }


    return board
}



function cellClicked(elCell, event) {
    if (!gGameIsOn) return
    startTimer()

    var cellLocation = getCellCoord(elCell.id)
    // if (gBoard[cellLocation.i][cellLocation.j].value !== MINE && event.which === 1 && gBoard[cellLocation.i][cellLocation.j].isShown === false) {
    //     counterNumsValue++
    // }

    // reveals selected cell
    gBoard[cellLocation.i][cellLocation.j].isShown = true

    // right click puts a flag
    if (event.which === 3) {
        gBoard[cellLocation.i][cellLocation.j].isFlag = true;
        // console.log('look if it changed :',gBoard[cellLocation.i][cellLocation.j])
    }

    // if mine was clicked 
    if (gBoard[cellLocation.i][cellLocation.j].value === MINE && event.which === 1) {
        mineCount++

        if (mineCount === 1) {
            elHeart.style.visibility = 'hidden'
            elHeart1.style.visibility = 'visible'
            elHeart2.style.visibility = 'visible'

        }
        if (mineCount === 2) {
            elHeart.style.visibility = 'hidden'
            elHeart1.style.visibility = 'hidden'
            elHeart2.style.visibility = 'visible'

        }
        if (mineCount === 3) {
            elHeart.style.visibility = 'hidden'
            elHeart1.style.visibility = 'hidden'
            elHeart2.style.visibility = 'hidden'
            elHappy.innerText = '😭'
            gameOver();

        }

    }

    // if not a mine
    if (gBoard[cellLocation.i][cellLocation.j].value !== MINE && event.which === 1) {
        expandsZerosAround(cellLocation)

        if (isVictory(cellLocation)) {
            userWon()
        }
    }

    renderBoard(gBoard)
}

function expandsZerosAround(location) {
    for (var row = location.i - 1; row <= location.i + 1; row++) {
        for (var cols = location.j - 1; cols <= location.j + 1; cols++) {
            //eliminate cell itself
            if (cols === location.j && row === location.i) {
                continue;
            }
            // eliminate presses out of matrix (not needed)
            if (row < 0 || cols < 0 || row >= gBoard.length || cols >= gBoard.length) {
                continue;
            }
            if (gBoard[row][cols].value === 0) {
                // console.log('revealing neighboring zeros')
                gBoard[row][cols].isShown = true;
                renderCell({ i: row, j: cols }, gBoard[row][cols].value)
            }


        }
    }

}

function addMines(board, minesAmount) {
    for (var i = 0; i < minesAmount; i++) {
        board[getRandomIntInclusive(0, board.length - 1)][getRandomIntInclusive(0, board.length - 1)].value = MINE
    }
}

function updateValuesOfMinesAround(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].value !== MINE) {
                // console.log('board[i][j].value:', board[i][j].value)
                board[i][j].value = countingMinesAround(board, i, j)
            }
        }

    }
}

function countingMinesAround(board, i, j) {
    var mineCounter = 0;
    for (var row = i - 1; row <= i + 1; row++) {

        for (var cols = j - 1; cols <= j + 1; cols++) {
            if (cols === j && row === i) {
                continue;
            }
            if (row < 0 || cols < 0 || row >= board.length || cols >= board.length) {
                continue;
            }
            if (board[row][cols].value === MINE) {
                mineCounter++
            }
        }
    }
    return mineCounter
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    coord.i = +strCellId.substring(5, strCellId.lastIndexOf('-'));
    coord.j = +strCellId.substring(strCellId.lastIndexOf('-') + 1);
    // console.log('coord', coord);
    return coord;
}


function startStopper() {
    var outputSeconds = document.getElementById("seconds")
    var outputMinutes = document.getElementById("minutes")
    // console.log('outputSeconds:', outputSeconds)

    gSeconds++;
    if (gSeconds <= 9) {
        outputSeconds.innerText = "0" + gSeconds;
    }

    if (gSeconds > 9) {
        outputSeconds.innerText = gSeconds;
    }

    if (gSeconds > 59) {
        gMinutes++;
        gSeconds = 0
    }

    if (gMinutes < 9) {
        outputMinutes.innerText = "0" + gMinutes;
        outputMinutes.innerText = "0" + 0;
    }

    if (gMinutes > 9) {
        outputSeconds.innerText = gMinutes;

    }
}

function gameOver() {
    gGameIsOn = false
    //stopping time
    clearInterval(gStopper)

    // revealing all mines
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].value === MINE)
                gBoard[i][j].isShown = true
        }
    }
    renderBoard(gBoard)
}


function isVictory(currentCell) {
    // console.log('currentCell:', currentCell)
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.value !== MINE && currCell.value !== FLAG && !currCell.isShown && i !== currentCell.i && j !== currentCell.j) {
                console.log('i,j:', i, j)
                console.log('currCell:', currCell)
                return false
            }
        }
    }

    return true
}

function userWon() {

    clearInterval(gStopper)
    gGameIsOn = false
    alert('you won!')
}

function playAgain() {
    mineCount = 0
    elHeart.style.visibility = 'visible'
    elHeart1.style.visibility = 'visible'
    elHeart2.style.visibility = 'visible'
    init()
}