'use strict'

// • Minesweeper 
// • In-Picture Game
// • Touch Nums
// • Ball Board
// • Chess
// • Todos
// • Books Shop

const gProjs = [
    {
        id: "minesweeper",
        name: "Minesweeper",
        title: "Check this out!",
        desc: "A minesweeper game i made not so long ago",
        url: "projs/minesweeper/index.html",
        publishedAt: 1448693940000,
        labels: ["Matrixes", "mouse-click events"],
    },
    {
        id: "inpictures",
        name: "In Pictures",
        title: "Go Ahead I dare ya!",
        desc: "A simple whats in the photo game",
        url: "projs/in-picture/main.html",
        publishedAt: 1448693940000,
        labels: ["Matrixes", "mouse-click events"],
    },
    {
        id: "touchnums",
        name: "Touch-nums",
        title: "Memory checkups",
        desc: "A matrix filled with nums randomly which you need to press in order",
        url: "projs/touch-nums/index.html",
        publishedAt: 1448693940000,
        labels: ["Matrixes", "mouse-click events"],
    },
    {
        id: "ballboard",
        name: "Ball-board",
        title: "Only for the quickest",
        desc: "Catch the balls as fast as you can",
        url: "projs/ball-board/index.html",
        publishedAt: 1448693940000,
        labels: ["Matrixes", "mouse-keyboard events"],
    },
    {
        id: "chess",
        name: "Mister-chess",
        title: "Chess game",
        desc: "Working out functionalities for chess pieces",
        url: "projs/mister-chess/index.html",
        publishedAt: 1448693940000,
        labels: ["Matrixes", "mouse-click events"],
    },
    {
        id: "pacman",
        name: "pacman-starter",
        title: "Dont let those ghosts catch ya",
        desc: "A pacman like game",
        url: "projs/pacman-starter/index.html",
        publishedAt: 1448693940000,
        labels: ["Matrixes", "mouse-keyboard events"],
    },
];

function getProjects() {
    return gProjs;
}

function getProjByID(projId) {
    return gProjs.find(project => project.id === projId);
}