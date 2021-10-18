'use strict'


// In this game, the player sees an image and some options that 
// describe the image, the user picks the right option and moves to 
// the next question if correct.
// 1. gQuests = [
//     {id: 1, opts:[], correctOptIndex:1 }
//     {id: 2, opts:[], correctOptIndex:0 }
//     {…}…
//     ]
//     gCurrQuestIdx = 0
//     2. Note: It is convenient to have the images named by the quest
//     id (e.g. : 1.jpg)
//     3. If the player is correct, move on to next quest
//     4. After last question – show a 'Victorious' msg to the user and a 
//     restart button
//     5. Some more functions:
//     a. initGame()
//     b. createQuests() – return an hard-coded (ready made)
//     array for now with at least 3 questions
//     c. renderQuest()
//     d. checkAnswer(optIdx)


var gQuestsBank = [
    { id: 1, opts: ['Animal', 'Flower', 'Mountain'], correctOptIndex: 1 },
    { id: 2, opts: ['Dog', 'Plant', 'Snow'], correctOptIndex: 0 },
    { id: 3, opts: ['Toy', 'Cat', 'Tree'], correctOptIndex: 2 },
];
var gCount = 0;
var gQuests;
var gCurrQuestIdx = 0

// var gQuests = [
//     { id: 1, opts: ['Animal', 'Flower', 'Mountain'], correctOptIndex: 1 },
//     { id: 2, opts: ['Dog', 'Plant', 'Snow'], correctOptIndex: 0 },
//     { id: 3, opts: ['Toy', 'Cat', 'Tree'], correctOptIndex: 2 }
// ];


function initGame() {
    gQuests = createQuests()
    // var questions = createQuests(3);
    // for (var i = 0; i < questions.length; i++)
    // var currQuest = gQuests.pop();// not nessecary
    renderQuest();
}

//START HERE!!!!



function playAgain(elBtn) {

    var elH2 = document.querySelector('h2');
    elH2.innerText = '';
    elBtn.style.display = 'none';
    gCount = 0;
    initGame();
}

function createQuests() {
    return gQuestsBank.slice();
}

function renderQuest() {
    var elBoard = document.querySelector('.board');
    // var currQuest = gQuests[gCurrQuestIdx];
    var currQuest = gQuests.pop();
    var strHTML = `<img src="pics/${currQuest.id}.jpg">`;
    for (var i = 0; i < currQuest.opts.length; i++) {
        var currOpt = currQuest.opts[i];
        strHTML += `<div class="answers answer${i}" onclick="checkAnswer(${i})">${currOpt}</div>`;
    }
    elBoard.innerHTML = strHTML;
    gCurrQuestIdx = currQuest.correctOptIndex;
}

function renderResult() {
    var elButton = document.querySelector('.playBtn');
    var elBoard = document.querySelector('.board');
    var elH2 = document.querySelector('h2');
    if (gCount === 3) {
        elButton.style.display = 'block';
        elBoard.innerHTML = '<img src="pics/winner.jpg">';;
        elH2.innerText = 'WINNER!';
    } else {
        gCount = 0;
        elButton.style.display = 'block';
        elBoard.innerHTML = '<img src="pics/loser.jpg">';
        elH2.innerText = 'LOSER!';
    }
}

function checkAnswer(optIdx) {
    if (optIdx === gCurrQuestIdx) { // move to render function
        gCount++;
        if (gCount === 3) {
            renderResult(true);
        } else {
            renderQuest(gQuests);
        }
    } else {
        renderResult(false);
    }
}


//util.js:
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

/*
1. change the names of the variables
2. use the render function in order to present the elements to the user
*/


// my original checkAnaswer function:

// function checkAnswer(optIdx) {
//     var elButton = document.querySelector('.playBtn');
//     var elBoard = document.querySelector('.board');
//     var elH2 = document.querySelector('h2');
//     if (optIdx === gCurrQuestIdx) { // move to render function
//         gCount++;

//         if (gCount === 3) {
//             elButton.style.display = 'block';
//             elBoard.innerHTML = '<img src="pics/winner.jpg">';;
//             elH2.innerText = 'WINNER!';
//             alert('You are Victrious!');

//         } else {
//             renderQuest(gQuest[gCount])
//             renderQuest(gQuests);
//         }
//     } else {

//         gCount = 0;
//         elButton.style.display = 'block';
//         elBoard.innerHTML = '<img src="pics/loser.jpg">';
//         elH2.innerText = 'LOSER!';
//         alert('Wrong answer! you lost!');
//     }

// }