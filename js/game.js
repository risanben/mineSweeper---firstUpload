'use strict'

var gBoard;
const MINE = '💣'
const FLAG = '⛳'
var gBoardSize = 4
var gGameIsOn = false
var mineCount = 0
var minesInGame = 2
var isMoreToExpand = false
var gCellSelected = null
var gPreviousCell = null
const elHappy = document.querySelector('.happy')
const elHeart = document.querySelector('.hearts')
const modal = document.querySelector(".modal");


function init() {
    gBoard = buildBoard(gBoardSize)
    console.table(gBoard)
    addMines(gBoard, minesInGame)
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
    var cellLocation = getCellCoord(elCell.id)
    //making sure user cant repeat a click 
    if (!gPreviousCell) {
        console.log('first num')
    } else {
        if (gPreviousCell.i === cellLocation.i && gPreviousCell.j === cellLocation.j && event.which === 1) {
            return
        }
    }
    gCellSelected = cellLocation
    startTimer()

    // reveals selected cell
    gBoard[cellLocation.i][cellLocation.j].isShown = true

    // right click puts / removes a flag
    if (event.which === 3) {
        if (!gBoard[cellLocation.i][cellLocation.j].isFlag) {
            gBoard[cellLocation.i][cellLocation.j].isFlag = true;
        } else {
            gBoard[cellLocation.i][cellLocation.j].isFlag = false
            gBoard[cellLocation.i][cellLocation.j].isShown = false
        }
    }

    // if mine was clicked 
    if (gBoard[cellLocation.i][cellLocation.j].value === MINE && event.which === 1) {
        mineCount++

        // if (mineCount === minesInGame) {
        //     gameOver()
        // }
        if (mineCount === 1) {
            elHeart.innerText = '👻👻'
        }
        if (mineCount === 2) {
            elHeart.innerText = '👻'
        }
        if (mineCount === 3) {
            elHeart.innerText = ''
            elHappy.innerText = '😭'
            gameOver();
        }
    }

    // if not a mine
    if (gBoard[cellLocation.i][cellLocation.j].value !== MINE && event.which === 1 &&
        gBoard[cellLocation.i][cellLocation.j].value !== FLAG) {
        if (gBoard[cellLocation.i][cellLocation.j].value === '-') {
            expandsZerosAround(cellLocation)
        }


        if (isVictory(cellLocation)) {
            // console.log('lastcellclicked:', cellLocation)
            renderBoard(gBoard)
            userWon()
        }
    }
    renderBoard(gBoard)
    gPreviousCell = gCellSelected
    gCellSelected = null
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
            if (gBoard[row][cols].value !== MINE && gBoard[row][cols].isShown === false) {
                gBoard[row][cols].isShown = true;
                if (gBoard[row][cols].value === '-') {

                    // TRIED TO MAKE THEM HIGHLIGHTED...NO GOOD
                    // var elcurrCellId = getTdId(row, cols)
                    // var elcurrCell = document.getElementById(elcurrCellId)
                    // elcurrCell.classList.add('highlighted')

                    isMoreToExpand = true
                    expandsZerosAround({ i: row, j: cols })
                }

                renderCell({ i: row, j: cols }, gBoard[row][cols].value)
            } else {
                isMoreToExpand = false
            }
        }
    }
}


function addMines(board, minesAmount) {
    for (var i = 0; i < minesAmount; i++) {
        board[getRandomIntInclusive(0, board.length - 1)][getRandomIntInclusive(0, board.length - 1)].value = MINE
    }
}

//putting the numbers (values) in each cell
function updateValuesOfMinesAround(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].value !== MINE) {
                board[i][j].value = countingMinesAround(board, i, j)
                if (board[i][j].value === 0) {
                    board[i][j].value = '-'
                }
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
    return coord;
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
            // console.log('currCell:', currCell)
            if ( currCell.isShown === false) {
                if(currCell.value !== MINE || currCell.isFlag === true) return false
            }
        }
    }

    return true
}

function userWon() {
    console.table(gBoard)

    // revealing all mines
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].value === MINE)
                gBoard[i][j].isShown = true
        }
    }
    renderBoard(gBoard)
    clearInterval(gStopper)
    gStopper = null
    gGameIsOn = false
    elHappy.innerText = '😎'
    modal.classList.add("show-modal");

}

function playAgain() {
    if (modal.classList.contains("show-modal")) {
        modal.classList.remove("show-modal");
    }
    mineCount = 0
    elHeart.innerText = '👻👻👻'
    elHappy.innerText = '😀'

    //for the safe clicks
    gClicksLeft = 3
    elClicksLeft.innerText = ''

    //for the recursion
    isMoreToExpand = false

    if (gStopper) {
        clearInterval(gStopper)
    }
    gStopper = null
    time_el.innerText = '00:00:00'
    gCellSelected = null
    gPreviousCell = null
    init()
}

/// TODO - make nicer with CASE SWITCH
function chooseLevel(elbtn) {

    if (gStopper) {
        clearInterval(gStopper)
    }

    if (elbtn.id === 'beginner') {
        minesInGame = 2
        gBoardSize = 4
    }

    if (elbtn.id === 'medium') {
        minesInGame = 12
        gBoardSize = 8
    }

    if (elbtn.id === 'expert') {
        minesInGame = 30
        gBoardSize = 12
    }

    if (elbtn.id === 'expertXL') {
        minesInGame = 60
        gBoardSize = 20
    }

    playAgain()
}