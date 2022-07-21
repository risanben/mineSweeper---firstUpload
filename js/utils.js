


function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            // figure class name

            var tdId = `cell-${i}-${j}`;
            var cellValue = ""
            if (cell.isFlag) {
                cellValue = FLAG
            } else
                if (cell.isShown) {
                    cellValue = cell.value
                }


            strHtml += `<td id="${tdId}" class="${tdId}" onmousedown="cellClicked(this,event)" oncontextmenu="return false">
                            ${cellValue}
                        </td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}
// gets i,j returns 'cel-3-5'
function getTdId(i, j) {
    var tdId = `cell-${i}-${j}`
    return tdId
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const elClicksLeft = document.querySelector('.clicksLeft')
var gClicksLeft = 3

function safeClick() {
    if (gClicksLeft <= 0) return
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].value !== MINE && gBoard[i][j].value !== FLAG && !gBoard[i][j].isShown) {
                var elCell = document.getElementById(getTdId(i, j))
                elCell.classList.add('highlighted')
                setTimeout(() => elCell.classList.remove('highlighted'), 500)
                gClicksLeft--
                elClicksLeft.innerText = `${gClicksLeft} left`
                return
            }
        }
    }
}