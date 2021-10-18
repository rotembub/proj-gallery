'use strict'

var gBoard;

var gMine = '💣';
var gFlag = '🚩';

var gLives = 3;
var gMarkedCorrectly = 0;

var gIsManual = false;
var gManuallyPlaced = 0;

var gIdx = 0;
var gSevenBoom = false;

var gOld = {
    boards: [],
    elboards: [],
    games: [],
    markeds: [],
    firstclicks: []
};

var gHints = 3;
var gHintIsPressed = false;

var gFirstClick = true;

var gMinesCoords;

var gTime;
var gTimerInterval;

var gSounds = {
    right: new Audio('sounds/sfx-pop3.mp3'),
    wrong: new Audio('sounds/incorrect.swf.mp3')
};

var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

//get back to it later:
const noContext = document.getElementById('noContextMenu');

noContext.addEventListener('contextmenu', e => {
    e.preventDefault();
});
// watchout

//This is called when page loads 

//huge i know, but u kept asking for more things xD
function init() {

    gIsManual = false;
    gManuallyPlaced = 0;
    gIdx = 0;
    gSevenBoom = false;

    gOld = {
        boards: [],
        elboards: [],
        games: [],
        markeds: [],
        firstclicks: []
    };

    gLives = 3;
    updateLives();
    updateSmiley();
    gMarkedCorrectly = 0;
    gHints = 3;
    gHintIsPressed = false;
    gFirstClick = true;
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gBoard = buildBoard();
    renderBoard(gBoard);
}

// Builds the board 
// Set mines at random locations
// Call setMinesNegsCount()
// Return the created board

function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        idx: gIdx++
    };
    return cell;
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = createCell();
            board[i][j] = cell;
        }
    }
    return board;
}

function placeMinesRandomly(num, board, firstCellI, firstCellJ) {

    for (var i = 0; i < num; i++) {
        var currCell = board[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)];
        while (currCell.isMine || currCell === board[firstCellI][firstCellJ]) {
            currCell = board[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)];
        }
        currCell.isMine = true;
    }
}

// Count mines around each cell 
// and set the cell's 
// minesAroundCount.

function setMinesNegsCount(cellI, cellJ, mat) {
    var minesAroundCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine) minesAroundCount++;
        }
    }
    return minesAroundCount;
}

function firstClickSetup(coordI, coordJ) {
    if (gManuallyPlaced !== gLevel.MINES && !gSevenBoom) {  //WATCHOUT
        placeMinesRandomly(gLevel.MINES, gBoard, coordI, coordJ);
    }
    gMinesCoords = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) gMinesCoords.push({ i: i, j: j });
            gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard);
        }
    }
    // console.log(gMinesCoords);
}

// Render the board as a <table> 
// to the page

function renderBoard(board) {
    var strHTML = '<table>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var cellStartTag = `<td id="cell-${i}-${j}" oncontextmenu="cellMarked(this,${i},${j})" onclick="cellClicked(this,${i},${j})">`;
            if (cell.isMine) strHTML += cellStartTag + `<span>${gMine}</span></td>`;
            else {
                if (cell.minesAroundCount === 0) {
                    strHTML += cellStartTag + `<span></span></td>`;
                } else {
                    strHTML += cellStartTag + `<span>${cell.minesAroundCount}</span></td>`;
                }
            }
        }
        strHTML += '</tr>';
    }
    strHTML += '</table>';
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Called when a cell (td) is 
// clicked

function cellClicked(elCell, i, j) {
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return;
    if (!gGame.isOn && gGame.shownCount !== 0) return;

    //watchout
    if (gIsManual) {
        placingManually(i, j);
        return;
    }

    if (!gGame.isOn) startTimer();

    if (gFirstClick) { // watchout

        firstClickSetup(i, j);
        gFirstClick = false;
        saveLastMove();
    } else saveLastMove();

    if (gHintIsPressed) {
        revealHintedCell(elCell, i, j);
        gHintIsPressed = false;
        return;
    }
    gGame.shownCount++;

    gBoard[i][j].isShown = true;
    elCell.classList.add('shown');

    var elSpanInCell = elCell.querySelector('span');
    if (gBoard[i][j].isMine) {
        elSpanInCell.innerText = gMine;
        elSpanInCell.classList.add('shown');
        gLives--;
        // to give support for lives counting this as a markedCorrectly so the player could win the game:
        gMarkedCorrectly++;
        gGame.shownCount--;
        // ^^^^^^^^^^^ i'm aware of the showncount not being precise at the end but i calculate victory differently.
        gSounds.wrong.play();
        updateSmiley('hurt');
        updateLives()
        checkGameOver();
        return;
    }
    else if (gBoard[i][j].minesAroundCount !== 0) elSpanInCell.innerText = gBoard[i][j].minesAroundCount;
    else {
        expandShown(gBoard, elCell, i, j)
        updateSmiley();
        checkGameOver();
    }
    gSounds.right.play();
    var elSpanInCell = elCell.querySelector('span');
    elSpanInCell.classList.add('shown');

    updateSmiley();
    checkGameOver();
}

// Called on right click to mark a 
// cell (suspected to be a mine)
// Search the web (and 
// implement) how to hide the 
// context menu on right click

function cellMarked(elCell, i, j) {
    if (gBoard[i][j].isShown) return;
    if (!gGame.isOn && gGame.shownCount !== 0) return;

    if (!gGame.isOn) startTimer();
    saveLastMove();

    gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
    elCell.classList.toggle('marked'); 
    var elSpanInCell = elCell.querySelector('span');
    elSpanInCell.classList.toggle('marked');

    if (!gBoard[i][j].isMarked && gBoard[i][j].minesAroundCount !== 0) {
        elSpanInCell.innerText = gBoard[i][j].minesAroundCount;
    } else if (gBoard[i][j].isMarked) elSpanInCell.innerText = gFlag;
    else elSpanInCell.innerText = '';

    if (gBoard[i][j].isMine && gBoard[i][j].isMarked) gMarkedCorrectly++;
    if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) gMarkedCorrectly--;

    checkGameOver();
}

// Game ends when all mines are 
// marked, and all the other cells 
// are shown

function checkGameOver() {
    var totalCells = ((gLevel.SIZE ** 2) - gLevel.MINES);
    if (gLives === 0) {
        updateSmiley('dead');
        showMines();
        stopTimer();
        showModal(false);
    } else if (gGame.shownCount === totalCells && gMarkedCorrectly === gLevel.MINES) {
        updateSmiley('win');
        stopTimer();
        if (gTime < localStorage.getItem(`BestScore-${gLevel.SIZE}X${gLevel.SIZE}`) || localStorage.getItem(`BestScore-${gLevel.SIZE}X${gLevel.SIZE}`) === null) {
            localStorage.setItem(`BestScore-${gLevel.SIZE}X${gLevel.SIZE}`, gTime);
        }
        showModal(true);
    }
    return;
}

function showModal(isWin) {
    var elModal = document.querySelector('.modal');

    if (isWin) {
        var elSpan = document.querySelector('.modal .win');
        elModal.style.display = 'block';
        elSpan.style.display = 'inline';
    } else {
        var elSpan = document.querySelector('.modal .lose');
        elModal.style.display = 'block';
        elSpan.style.display = 'inline';
    }
}

// When user clicks a cell with no 
// mines around, we need to open 
// not only that cell, but also its 
// neighbors. 
// NOTE: start with a basic 
// implementation that only opens 
// the non-mine 1st degree 
// neighbors
// BONUS: if you have the time 
// later, try to work more like the 
// real algorithm (see description 
// at the Bonuses section below)

function expandShown(board, elCell, cellI, cellJ) {
    if (board[cellI][cellJ].isMine) return;
    if (board[cellI][cellJ].isMarked) return;
    if (board[cellI][cellJ].minesAroundCount !== 0) {
        renderCell(board[cellI][cellJ], cellI, cellJ);
        gGame.shownCount++;
        return;
    }
    if (!board[cellI][cellJ].isShown) {
        board[cellI][cellJ].isShown = true;
        elCell.classList.add('shown');
        gGame.shownCount++;
    }
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;

            if (board[i][j].isMine) continue;
            if (board[i][j].isMarked) continue;
            if (board[i][j].isShown) continue;

            var elCurrCell = document.querySelector(`#cell-${i}-${j}`);
            // console.log(elCurrCell);
            expandShown(board, elCurrCell, i, j);
        }
    }
    return;
}

function startTimer() {
    if (clearInterval) stopTimer;
    gGame.isOn = true;
    var elTimer = document.querySelector('.timer');
    var start = Date.now();
    gTimerInterval = setInterval(() => {
        gTime = ((Date.now() - start) / 1000);
        elTimer.innerText = ((Date.now() - start) / 1000).toFixed(2);
    }, 100);
}

function stopTimer() {
    clearInterval(gTimerInterval);
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '';
    gGame.isOn = false;
}

function showMines() {
    for (var i = 0; i < gMinesCoords.length; i++) {
        var coords = gMinesCoords[i];
        var elCell = document.querySelector(`#cell-${coords.i}-${coords.j}`);
        var elSpan = elCell.querySelector('span');
        elSpan.innerText = gMine;
        elCell.classList.add('shown');
        elSpan.classList.add('shown');
    }
}

function changeDifficulty(elBtn, size, mines) {

    gLevel.MINES = mines;
    gLevel.SIZE = size;

    elBtn.classList.add('shown');
    var elBtns = document.querySelectorAll('button')
    for (var i = 0; i < elBtns.length; i++) {
        var currBtn = elBtns[i];
        if (currBtn === elBtn) continue;
        currBtn.classList.remove('shown');
    }
    restart();
}

function updateLives() {

    var elSpan = document.querySelector('.lives span');
    elSpan.innerText = '';
    for (var i = 0; i < gLives; i++) {
        elSpan.innerText += '💖';
    }

}

function updateSmiley(status) {
    var elH3 = document.querySelector('h3');
    var elSpanInH3 = elH3.querySelector('span');
    switch (status) {
        case 'dead':
            elSpanInH3.innerText = '💀';
            break;
        case 'win':
            elSpanInH3.innerText = '😎';
            break;
        case 'hurt':
            elSpanInH3.innerText = '😥';
            break;
        default:
            elSpanInH3.innerText = '😀';
    }
}

function restart() {
    hideModal();
    stopTimer();
    displayHints();
    displaySafePicks();
    init();
}

function hideModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
    var elSpanWin = document.querySelector('.modal .win');
    var elSpanLose = document.querySelector('.modal .lose');
    elSpanWin.style.display = 'none';
    elSpanLose.style.display = 'none';
}

function showHint(elHint) {
    if (gHints === 0) return;
    elHint.style.display = 'none';
    gHintIsPressed = true;
    gHints--;
}

function revealHintedCell(elCell, cellI, cellJ) {
    var shownCells = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].isShown) continue;
            if (gBoard[i][j].isMarked) continue;
            shownCells.push({ i: i, j: j })
            renderCell(gBoard[i][j], i, j);
        }
    }
    setTimeout(() => {
        for (var i = 0; i < shownCells.length; i++) {
            gBoard[shownCells[i].i][shownCells[i].j].isShown = false;
            var elCell = document.querySelector(`#cell-${shownCells[i].i}-${shownCells[i].j}`);
            var elSpan = elCell.querySelector('span');
            elCell.classList.remove('shown');
            elSpan.classList.remove('shown');
        }
    }, 1000);
}

function displayHints() {
    var hints = document.querySelectorAll('.hints span');
    for (var i = 0; i < hints.length; i++) {
        hints[i].style.display = 'inline';
    }
}

function showSafe(elSpan) {
    elSpan.style.display = 'none';
    var safePicks = [];
    var elCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isMine && !currCell.isShown) {
                safePicks.push(currCell);
                var elCell = document.querySelector(`#cell-${i}-${j}`);
                elCells.push(elCell);
            }
        }
    }
    var idx = getRandomInt(0, safePicks.length);
    if (elCells.length === 0) return;
    elCells[idx].classList.add('bolded');
    setTimeout(() => {
        elCells[idx].classList.remove('bolded');
    }, 1500);
}
function displaySafePicks() {
    var safePicks = document.querySelectorAll('.safeClicks span');
    for (var i = 0; i < safePicks.length; i++) {
        safePicks[i].style.display = 'inline';
    }
}

//didnt think i would need it at first, but as stuff got more complicated i just had to
function renderCell(cell, cellI, cellJ) {
    if (cell.isShown) return;
    cell.isShown = true;
    var elCell = document.querySelector(`#cell-${cellI}-${cellJ}`);
    var elSpan = elCell.querySelector('span');
    elCell.classList.add('shown');
    elSpan.classList.add('shown');
    if (cell.isMine) elSpan.innerText = gMine;
    else if (cell.minesAroundCount !== 0) elSpan.innerText = cell.minesAroundCount;
    else elSpan.innerText = '';
}

function manuallyCreate() {
    if (gGame.isOn || gSevenBoom) return;
    // var minesLeft = gLevel.MINES;
    gIsManual = true;
    // alert('place: ' + minesLeft + ' mines in the locations you wish');
    manualModal();
}

function placingManually(cellI, cellJ) {

    if (gBoard[cellI][cellJ].isMine) return;

    gManuallyPlaced++;
    gBoard[cellI][cellJ].isMine = true;
    var elCell = document.querySelector(`#cell-${cellI}-${cellJ}`);
    elCell.classList.add('bordered');
    setTimeout(() => {
        elCell.classList.remove('bordered');
    }, 500);

    if (gManuallyPlaced === gLevel.MINES) {
        gIsManual = false;
        showDoneModal();
        // alert('All mines have been placed!');
    }
}

function sevenBoom() {
    if (gGame.isOn || gManuallyPlaced !== 0) return;

    // alert('Mines are placed according to the 7Boom! logic');
    sevenBoomModal();
    gSevenBoom = true;
    var counter = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (i === 0 && j === 0) continue;
            var cell = gBoard[i][j];
            var idx = '' + cell.idx;
            if (idx.includes('7') || +idx % 7 === 0) {
                cell.isMine = true;
                counter++;
            }
        }
    }
    gLevel.MINES = counter;
}


function manualModal(){
    var elModal = document.querySelector('.modalManual');
    elModal.style.display = 'block';
    var elSpan = elModal.querySelector('span');
    elSpan.innerText = gLevel.MINES;
}

function showDoneModal(){
    var elModal = document.querySelector('.done');
    elModal.style.display = 'block';
}

function sevenBoomModal(){
    var elModal = document.querySelector('.modalSevenBoom');
    elModal.style.display = 'block';
}
function closeWindow(elBtn){
    elBtn.parentElement.style.display = 'none';
}

// Undo does not give lives/hints/picks back and does not reset the timer (cause thats cheating!)

function undo() {
    if (gOld.elboards.length === 0) return;
    console.log('Undoing');
    gBoard = gOld.boards.pop();

    gGame = JSON.parse(JSON.stringify(gOld.games.pop()));
    gMarkedCorrectly = gOld.markeds.pop();

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = gOld.elboards.pop();
    gFirstClick = gOld.firstclicks.pop();
}

function saveLastMove() {
    //saving gboard
    var oldgBoard = [];
    for (var i = 0; i < gBoard.length; i++) {
        oldgBoard[i] = [];
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            var copiedCell = JSON.parse(JSON.stringify(cell));
            oldgBoard[i].push(copiedCell);
        }
    }
    gOld.boards.push(oldgBoard);

    //saving innerhtml
    var elBoard = document.querySelector('.board');
    var oldElBoard = elBoard.innerHTML;
    gOld.elboards.push(oldElBoard);

    //saving other stuff;
    var oldgGame = JSON.parse(JSON.stringify(gGame));
    gOld.games.push(oldgGame);
    var oldMarked = gMarkedCorrectly;
    gOld.markeds.push(oldMarked);
    var oldFirstClick = gFirstClick;
    gOld.firstclicks.push(oldFirstClick);
}