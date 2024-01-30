// HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];       // snake start position
let food = generateFood();         // create random position for food
let highScore = 0;
let direction = 'right';           // default direction => right
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// draw game map
function draw() {
    board.innerHTML = '';   // everytime we draw board is empty
    drawSnake();
    drawFood();
    updateScore();
}

// draw snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');     // create a div with snake class
        setPosition(snakeElement, segment);         // set position of snake element (10, 10) initially
        board.appendChild(snakeElement);
    });
}

// create a snake or food as a div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// set the position of snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// // testing draw function
// draw();

// generate random position for food between 1 and 20
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};      // return a random coordinate of food
}

// draw food function
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');    // create div of class food
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// moving the snake
function move() {
    const head = { ...snake[0] }      // use snake variable coordinates without altering the original
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }
    snake.unshift(head);     // unshift adds a head object to the beginning of the snake array
    // adds new object at 0 index with new coordinates

    // snake.pop();            // pops the last element of the snake array, remove the last position
    // without pop, the snake would continue to grow without food

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();      // generate new food once consumed
        increaseSpeed();
        clearInterval(gameInterval);            // clear past interval
        gameInterval = setInterval(() => {
            draw();
            move();
            checkCollision();
        }, gameSpeedDelay);
        // here we skip snake.pop(); since food adds length to snake
    } else {
        snake.pop();
    }
}

// test moving
// setInterval(() => {
//     move();      // move first
//     draw();      // then draw again the new position
// }, 200);


// start game function 
function startGame() {
    gameStarted = true;     // keep track of the running game
    instructionText.style.display = 'none';      // hide instruction text
    logo.style.display = 'none';                 // hide logo when game starts
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

document.addEventListener('keydown', handleKeyPress);

// keypress event listener for spacebar and ArrowKeys
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')) {
        startGame();
    } else {        
        switch(event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}


function increaseSpeed() {
    // console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {   // for wall collision
        resetGame();
    }

    // for self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');   
    // turns into string and make it triple digit number
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = "block";
    logo.style.display = 'block';
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}

// Was fun!