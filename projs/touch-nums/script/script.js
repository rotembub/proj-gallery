'use strict'

// User sees a board with 16 cells, containing numbers 1..16, in a random order
//      o Hint: use an HTML table
//      o Hint: Nice technique for building the board: 
// place the 16 numbers in a simple array, shuffle it, then build the <table> by 
// popping a number from the nums array.
//      o Note: there is no need to use as matrix in this exercise
// • User should click the buttons in a sequence (1, 2, 3,… 16)
// • When user clicks the a button - call a function cellClicked(clickedNum)
//          o If right – the button changes its color
//          o When user clicks the wrong button noting happen
// • When user clicks the first number, game time starts and presented (3 digits after the 
// dot, like in: 12.086)
// • Add difficulties (larger boards: 25, 36)

var gNums = createNumsArr(16)
var gNextNum = 1;
var gTimerInterval;
var gRunning = false;
console.log(gNums);


function createNumsArr(length) {
    var nums = [];
    for (var i = 0; i < length; i++) {
        nums.push(i + 1);
    }
    return nums;
}

function initGame() {


    renderBoard();
}


function cellClicked(clickedNum, num) {
    if (num === gNextNum) {
        clickedNum.style.backgroundColor = 'yellow';
        gNextNum++;
        if (num === 1 & gRunning === false) {
            startTimer();
            gRunning = true;
        }
        if (num === gNums.length) clearInterval(gTimerInterval);
    }
}


function renderBoard() {
    var copyGnums = gNums.slice();
    var strHTML = '<table>';
    for (var i = 0; i < (gNums.length ** 0.5); i++) {
        strHTML += '<tr>';
        for (var j = 0; j < (gNums.length ** 0.5); j++) {
            var num = drawNum(copyGnums);
            strHTML += `<td onclick="cellClicked(this,${num})">${num}</td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</table>';
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;

}

function changeDiff(elBtn, size) {

    elBtn.classList.add('marked');
    var elBtns = document.querySelectorAll('.btns button')
    for (var i = 0; i < elBtns.length; i++) {
        var currBtn = elBtns[i];
        if (currBtn === elBtn) continue;
        currBtn.classList.remove('marked');
    }
    gNextNum = 1;
    stopTimer();
    gNums = createNumsArr(size);
    initGame();
}

function startTimer() {
    var elTimer = document.querySelector('.timer');
    var start = Date.now();
    gTimerInterval = setInterval(() => {
        elTimer.innerText = ((Date.now() - start) / 1000);
    }, 100);
}

function stopTimer() {
    clearInterval(gTimerInterval);
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '';
    gRunning = false;
}








//////////////////////////////////////////////////////////////////////////////
function drawNum(numsArr) {
    var idx = getRandomInt(0, numsArr.length);
    var num = numsArr[idx];
    numsArr.splice(idx, 1);
    return num;
}
///////////////////////////////////////////////////////////////////////////////////
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is inclusive and the minimum is inclusive 
}