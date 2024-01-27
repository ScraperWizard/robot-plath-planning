const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const canvasObjects = {};

const cols = 1000;
const rows = 800;
const cellSize = 10;
const robotCoordinates = [0, 0];
const allObstacles = []
const allTrash = []

// Create 2D array
// let cells = new Array(cols);
// for (let i = 0; i < cols; i++) {
//     cells[i] = new Array(rows);
// }

// // Draw cells
// for (let i = 0; i < rows; i += cellSize) {
//     ctx.fillStyle = 'white';
//     ctx.fillRect(0, i, cols, 1);
//     console.log(i)
// }

// for (let i = 0; i < cols; i += cellSize) {
//     ctx.fillStyle = 'white';
//     ctx.fillRect(i, 0, 1, rows);
//     console.log(i)
// }

let img = new Image();
img.onload = function () {
    let imgWidth = 50;
    let imgHeight = 50;

    let x = Math.random() * (rows - imgWidth);
    let y = Math.random() * (cols - imgHeight);

    ctx.drawImage(img, x, y, imgWidth, imgHeight);

    // Add the robot to the canvasObjects object
    canvasObjects.robot = { id: 'robot', x, y, width: imgWidth, height: imgHeight };
};

img.src = 'robot.png';
generateRandomAmountOfObstacles()
generateRandomAmountOfTrash();

let trashImg = new Image();
trashImg.onload = function () {
    let imgWidth = 50;
    let imgHeight = 50;
    ctx.drawImage(trashImg, 5, 5, imgWidth, imgHeight);
    ctx.drawImage(trashImg, 950, 750, imgWidth, imgHeight);
};
trashImg.src = 'bin.png';

function generateRandomAmountOfObstacles() {
    let obstacleCount = Math.floor(Math.random() * 10);

    for (let i = 0; i < obstacleCount; i++) {
        let x = Math.floor(Math.random() * rows - 200);
        let y = Math.floor(Math.random() * cols - 200);

        allObstacles.push({ x, y });

        let img = new Image();
        img.onload = function () {
            ctx.drawImage(img, x, y, 50, 50);

            // Add the obstacle to the canvasObjects object
            canvasObjects['obstacle' + i] = { id: 'obstacle' + i, x, y, width: 50, height: 50 };
        };
        img.src = 'obstacle.png';
    }
}

function generateRandomAmountOfTrash() {
    let obstacleCount = Math.floor(Math.random() * 10);
    if(obstacleCount < 5 ) {
        obstacleCount = 5
    }

    for (let i = 0; i < obstacleCount; i++) {
        let x = Math.floor(Math.random() * rows - 200);
        let y = Math.floor(Math.random() * cols - 200);

        allObstacles.push({ x, y });

        let img = new Image();
        img.onload = function () {
            ctx.drawImage(img, x, y, 50, 50);

            // Add the trash to the canvasObjects object
            canvasObjects['trash' + i] = { id: 'trash' + i, x, y, width: 50, height: 50 };
        };
        img.src = 'trash.png';
    }
}

const socket = io("localhost:4000");
socket.on("connect", () => {
    socket.emit("test-astar-pathfinding", canvasObjects)
})

console.log('script.js loaded', canvas, canvasObjects);