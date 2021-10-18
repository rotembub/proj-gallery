'use strict'
const PACMAN = '😎';
var gPacmanImg = '<img src="/img/pacman.png">'

var gPacman;
var gSuperInterval;
var gSide;

function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 6
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN;

}
function movePacman(ev) {

    if (!gGame.isOn) return;
    // console.log('ev', ev);
    var nextLocation = getNextLocation(ev)

    if (!nextLocation) return;

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('NEXT CELL', nextCell);

    if (nextCell === WALL) return;
    if (nextCell === CHERRY) updateScore(10);
    if (nextCell === FOOD) {
        updateScore(1);
        gFoodCollected++;
        gameWon();
    } else if (nextCell === POWERFOOD) {
        if (gPacman.isSuper) return;
        gPacman.isSuper = true;
        superPacman();

    } else if (nextCell === GHOST) {
        if (!gPacman.isSuper) {
            gameOver();
            renderCell(gPacman.location, EMPTY)
            return;
        } else {
            var ghost = findGhostByLocation(nextLocation);
            removeGhost(ghost);

            //trying something:
        }
    }

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;

    // update the dom
    renderCell(gPacman.location, EMPTY);

    gPacman.location = nextLocation;

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
    // update the dom
    // renderCell(gPacman.location, PACMAN);
    renderCell(gPacman.location, gPacmanImg);
    changeDirection(gSide);


}


function getNextLocation(eventKeyboard) {

    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            gSide = 'up';
            nextLocation.i--;
            break;
        case 'ArrowDown':
            gSide = 'down';
            nextLocation.i++;
            break;
        case 'ArrowLeft':
            gSide = 'left';
            nextLocation.j--;
            break;
        case 'ArrowRight':
            gSide = 'right';
            nextLocation.j++;
            break;
        default:
            return null;
    }
    return nextLocation;
}

function changeDirection(side) {
    var elImg = document.querySelector('img');
    elImg.classList.add(side);

}