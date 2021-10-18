'use strict'


// Start with the given ball-board project, add the following features:
// • Every few seconds a new ball is added in a random empty cell
// • Show how many balls were collected
// • When gamer collects all balls – game over - let the user 
// restart the game by clicking a Restart button
// • Play sound when collecting a ball
// • Add passages that take the gamer from left/right or 
// top/bottom:
// • Add support for gameElement GLUE, when user steps on 
// GLUE he cannot move for 3 seconds. GLUE is added to board 
// every 5 seconds and gone after 3 seconds

var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'X'; // vscode wouldnt recognize emojis for some odd reason
var gIsGlued = false;

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';

var gBoard;
var gGamerPos;
var gBallInterval;
var gBallsCollected;
var gBallsCreated;
var gGlueInterval;

var gAudio = new Audio('sound/sfx-pop3.mp3');

function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	gBallInterval = setInterval(generateRandomBalls, 2000);
	gGlueInterval = setInterval(addGlue, 3000);
	gBallsCollected = 0;
	gBallsCreated = 2;

}


function buildBoard() {
	// Create the Matrix
	var board = createMat(10, 12)


	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	//passages for the player:
	//passage top/buttom:
	board[5][0].type = FLOOR;
	board[5][0].gameElement = 'portal';

	board[5][11].type = FLOOR;
	board[5][11].gameElement = 'portal';
	// passage left/right:
	board[0][6].type = FLOOR;
	board[0][6].gameElement = 'portal';

	board[9][6].type = FLOOR;
	board[6][6].gameElement = 'portal';


	console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To template string
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	console.log('strHTML is:');
	console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

	if (i < 0 || i > gBoard.length - 1 || j < 0 || j > gBoard[0].length - 1) portalMove2(i, j); // trying some BS
	var targetCell = gBoard[i][j];


	if (targetCell.type === WALL || gIsGlued) return;


	// PORTAL TRY:
	// if (targetCell.gameElement === 'portal') {
	// 	portalMove(targetCell);
	// 	return;
	// }

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed

	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			console.log('Collecting!');
			gBallsCollected++;
			gAudio.play();
			var elH2 = document.querySelector('h2');
			elH2.innerText = `Balls Collected:${gBallsCollected}`;
			if (gBallsCollected === gBallsCreated) {
				clearInterval(gBallInterval);
				clearInterval(gGlueInterval);
				ShowBtn();
			}
		}
		if (targetCell.gameElement === GLUE) {
			gIsGlued = true;
			checkGlued();
			// setTimeout(isGlued = false, 3000);
		}

		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);
		// checkGlued(isGlued);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function generateRandomBalls() {
	var cellI = getRandomIntInclusive(1, 8);
	var cellJ = getRandomIntInclusive(1, 10);

	var cell = gBoard[cellI][cellJ];

	while (cell.gameElement) {
		cellI = getRandomIntInclusive(1, 8);
		cellJ = getRandomIntInclusive(1, 10);
		cell = gBoard[cellI][cellJ];
	}
	// console.log(cell);
	cell.gameElement = BALL;
	gBallsCreated++;
	var coord = { i: cellI, j: cellJ }
	renderCell(coord, BALL_IMG);

}

function ShowBtn() {
	var elBtn = document.querySelector('.btn');
	elBtn.style.display = 'block';
}

function newGame(elBtn) {

	elBtn.style.display = 'none';
	initGame();


}
// ABSOLUTE FAILURE! : 
function portalMove(targetCell) {
	var iIdx;
	var jIdx;
	if (targetCell === gBoard[5][0]) {
		iIdx = 5;
		jIdx = 11;
	} else if (targetCell === gBoard[5][11]) {
		iIdx = 5;
		jIdx = 0;
	} else if (targetCell === gBoard[0][6]) {
		iIdx = 9;
		jIdx = 6;
	} else if (targetCell === gBoard[9][6]) {
		iIdx = 0;
		jIdx = 6;
	}

	// MOVING from current position
	// Model:
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
	// Dom:
	renderCell(gGamerPos, '');

	// MOVING to selected position
	// Model:
	gGamerPos.i = iIdx;
	gGamerPos.j = jIdx;
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	// DOM:
	renderCell(gGamerPos, GAMER_IMG);
	console.log('gGamerPos: ', gGamerPos)
}
// END OF ABSOLUTE FAILURE!


function portalMove2(i, j) {
	var iIdx;
	var jIdx;
	if (i < 0 || i > gBoard.length - 1 || j < 0 || j > gBoard[0].length - 1) {
		if (i < 0) {
			iIdx = 9;
			jIdx = 6;
		} if (i > gBoard.length) {
			iIdx = 0;
			jIdx = 5;
		} if (j < 0) {
			iIdx = 5;
			jIdx = 11;
		} if (j > gBoard.length) {
			iIdx = 5;
			jIdx = 0;
		}
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		renderCell(gGamerPos, '');
		gGamerPos.i = iIdx;
		gGamerPos.j = jIdx;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		renderCell(gGamerPos, GAMER_IMG);
	}

}

// Add support for gameElement GLUE, when user steps on 
// GLUE he cannot move for 3 seconds. GLUE is added to board 
// every 5 seconds and gone after 3 seconds

function addGlue() {
	var cellI = getRandomIntInclusive(1, 8);
	var cellJ = getRandomIntInclusive(1, 10);

	var cell = gBoard[cellI][cellJ];

	while (cell.gameElement) {
		cellI = getRandomIntInclusive(1, 8);
		cellJ = getRandomIntInclusive(1, 10);
		cell = gBoard[cellI][cellJ];
	}
	// console.log(cell);

	cell.gameElement = GLUE;
	var coord = { i: cellI, j: cellJ }
	renderCell(coord, 'X');
	removeGlueFromBoard(cell, coord);
}

function checkGlued() {
	if (gIsGlued) {
		setTimeout(removeGlued, 3000);
	}
}

function removeGlued() {
	gIsGlued = false;
}

function removeGlueFromBoard(cell, coord) {
	setTimeout(() => {
		cell.gameElement = null;
		renderCell(coord, ''); // causes a bug.. if it sets out after the player has eaten it, the player icon is removed till it is moved

	}, 5000);
}