'use strict'
const GHOST = '&#128123;';

var gGhosts = []
var gIntervalGhosts;
var gIdx = 0;
var gRemovedGhosts = [];

// var gEatenCounter = 0; // trying

function createGhost(board) {
    var ghost = {
        idx: gIdx++,
        location: {
            i: gIdx + 2,
            j: gIdx + 2
        },
        currCellContent: FOOD,
        color: getRandomColor(),
        isDead: false //trying to figure out location bug!!!!
    }

    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = getGhostHTML(ghost);
}

function createGhosts(board) {
    gIdx = 0;
    gGhosts = [];
    createGhost(board)
    createGhost(board)
    createGhost(board)

    gIntervalGhosts = setInterval(moveGhosts, 1000);
}

function moveGhosts() {
    if (gGhosts.length === 0) return; //WATCH OUT
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        if (ghost.isDead) continue;
        moveGhost(ghost);
    }
}
function moveGhost(ghost) {
    if (ghost.isDead) return; //trying to figure out location bug!!!!
    var moveDiff = getMoveDiff();

    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    if (nextCell === WALL) return;
    if (nextCell === GHOST) return;
    if (nextCell === PACMAN) {
        if (!gPacman.isSuper) {
            renderCell(gPacman.location, EMPTY)
            gameOver();
            return;
        } else {
            ghost.isDead = true;
            console.log(ghost);
            console.log('currCellContent', ghost.currCellContent);
            removeGhost(ghost);
            // TRYING TO FIGURE OUT A BUG:
            // changing model and dom of old location:
            gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
            renderCell(ghost.location, ghost.currCellContent);
            //changing gboard and ghost.location :
            ghost.location = nextLocation;
            ghost.currCellContent = EMPTY;
            return; // WATCH OUT HERE
        }
    }


    // model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // dom
    renderCell(ghost.location, ghost.currCellContent)

    // model
    ghost.location = nextLocation;
    ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j]
    gBoard[ghost.location.i][ghost.location.j] = GHOST;
    // dom
    renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
    var randNum = getRandomIntInt(0, 100);
    if (randNum < 25) {
        return { i: 0, j: 1 }
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}


function getGhostHTML(ghost) {
    // console.log('ghost.color', ghost.color);
    return `<span id=${ghost.idx} style="color: transparent; text-shadow:0 0 0 ${ghost.color}">${GHOST}</span>`
}

function removeGhost(ghost) {

    var remGhost;
    remGhost = gGhosts.splice(ghost.idx, 1);
    var remGhostColor = gGhostsColors.splice(ghost.idx, 1);
    remGhost[0].color = remGhostColor[0];
    console.log(remGhostColor);
    updateIdx(); // new idx now for all ghosts

    gRemovedGhosts.push(remGhost[0]);
}

function bringBackGhosts(ghosts) {
    if (ghosts.length === 0) return;
    console.log('gRemovedGhosts:', gRemovedGhosts);
    for (var i = 0; i < ghosts.length; i++) {
        var ghost = ghosts[i];
        // if (ghost === undefined) continue; //trying something! awful i know, but cant find out why random ghosts are being placed.
        if (ghost.isDead) ghost.isDead = false;
        gGhosts.push(ghost);
    }
    updateIdx();
    // gGhosts.sort((a, b) => (a.idx > b.idx) ? 1 : -1)
    gRemovedGhosts = [];
}

function countGhosts(board) {
    var ghostsCounter = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            // console.log('cell:', cell);
            if (cell === GHOST) ghostsCounter++;
            // console.log('foodcount:', foodCount);
        }
    }
    console.log('Number of ghosts in the Board:', ghostsCounter);
}

function updateIdx() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        ghost.idx = i;
    }
    console.log(gGhosts);
}

