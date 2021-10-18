'use strict'
const WALL = '🌲';
const FOOD = '◽';
const EMPTY = ' ';
const POWERFOOD = '🍺';
const CHERRY = '🍒';


var gBoard;
var gGame = {
    score: 0,
    isOn: false
}
var gTotalfood;
var gFoodCollected;
var gCherryInterval;
var gGhostsColors;

// var gCopyGghosts; /// tryning to figure out a bug


function init() {
    console.log('hello')
    gBoard = buildBoard()
    gTotalfood = GetTotalFoodCount(gBoard);
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container')
    renderCell(gPacman.location, gPacmanImg);
    gFoodCollected = 0;
    gCherryInterval = setInterval(spawnCherry, 15 * 1000)
    gGame.isOn = true
    countGhosts(gBoard);
}

function buildBoard() {
    var SIZE = 10;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;
            // gTotalfood++;
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL;
                // gTotalfood--;
            }
            if ((i === 1 && j === SIZE - 2) || (i === 1 && j === 1) || (i === SIZE - 2 && j === 1) || (i === SIZE - 2 && j === SIZE - 2)) {
                board[i][j] = POWERFOOD;
            }
        }
    }
    return board;
}



function updateScore(diff) {
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score
}

function gameOver() {
    console.log('Game Over');
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    clearInterval(gCherryInterval);

    var elModal = document.querySelector('.modal');
    var elSpan = document.querySelector('.modal .lose');
    elModal.style.display = 'block';
    elSpan.style.display = 'inline';

}

function gameWon() {

    if (gFoodCollected === gTotalfood) {
        gGame.isOn = false;
        clearInterval(gIntervalGhosts);
        clearInterval(gCherryInterval);

        var elModal = document.querySelector('.modal');
        var elSpan = document.querySelector('.modal .win');
        elModal.style.display = 'block';
        elSpan.style.display = 'inline';


    }
}

function playAgain() {
    gGame.score = 0;
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
    var elSpanWin = document.querySelector('.modal .win');
    var elSpanLose = document.querySelector('.modal .lose');
    elSpanWin.style.display = 'none';
    elSpanLose.style.display = 'none';
    init();
}

// function checkWin() {
//     if (gFoodCollected === gTotalfood)
//         gameWon();
// }

function GetTotalFoodCount(board) {
    var foodCount = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            // console.log('cell:', cell);
            if (cell === FOOD) foodCount++;
            // console.log('foodcount:', foodCount);
        }
    }
    return --foodCount; // not ideal but pacman spawn ruins the true count
}

function superPacman() {
    var ghost;
    gGhostsColors = [];

    for (var i = 0; i < gGhosts.length; i++) {
        ghost = gGhosts[i];
        gGhostsColors.push(ghost.color);
        ghost.color = '#ccccff';
        renderCell(ghost.location, getGhostHTML(ghost));
    }
    countGhosts(gBoard);
    console.log(gGhostsColors);
    gSuperInterval = setTimeout(() => {
        gPacman.isSuper = false;
        bringBackGhosts(gRemovedGhosts);
        for (var i = 0; i < gGhostsColors.length; i++) {
            ghost = gGhosts[i];
            ghost.color = gGhostsColors[i];
            renderCell(ghost.location, getGhostHTML(ghost));
        }
    }, 5000);
}

function findGhostByLocation(location) {
    console.log('location', location);
    console.log('gGhosts in find:', gGhosts);
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        console.log('ghost:', ghost);
        if (ghost.location.i === location.i && ghost.location.j === location.j) {
            console.log(ghost);
            return ghost;
        }
    }
}

function spawnCherry() {
    var emptyCellsLocations = GetEmptyCellsLocations(gBoard);
    var idx = getRandomIntInt(0, emptyCellsLocations.length);
    if (!idx) return;
    var emptyCellLocation = emptyCellsLocations[idx];
    gBoard[emptyCellLocation.i][emptyCellLocation.j] = CHERRY;
    renderCell(emptyCellLocation, CHERRY);

}

