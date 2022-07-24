// game parameters
const BALL_SPD = 0.5; // starting ball speed as a fraction of screen height per second
const BALL_SPD_MAX = 2; // max ball speed as a multiple of starting speed
const BALL_SPIN = 0.2; // ball deflection off the paddle (0 = no spin, 1 = high spin)
const BRICK_COLS = 14; // number of brick columns
const BRICK_GAP = 0.3; // brick gap as a fraction of wall width
const BRICK_ROWS = 8; // starting number of brick rows
const GAME_LIVES = 3; // starting number of game lives
const KEY_SCORE = "breakout_highscore"; // save key for local storage of high score
const MARGIN = 6; // number of empty rows above the bricks
const MAX_LEVEL = 10; // maximum game level (+2 rows of bricks per level)
const MIN_BOUNCE_ANGLE = 30; // minimum bounce angle from the horizontal in degrees
const PADDLE_SIZE = 1.5; // paddle size as a multiple of wall thickness
const PADDLE_SPD = 0.5; // fraction of screen width per second
const PADDLE_W = 0.1; // paddle width as a fraction of screen width
const PUP_BONUS = 50; // bonus points for collecting an extra powerup
const PUP_CHANCE = 0.1; // probability of a powerup per brick hit (between 0 and 1)
const PUP_SPD = 0.15; // powerup speed as a fraction of screen height per second
const WALL = 0.02; // wall/ball size as a fraction of the shortest screen dimension

// colours
const COLOR_BACKGROUND = "black";
const COLOR_BALL = "white";
const COLOR_PADDLE = "white";
const COLOR_TEXT = "white";
const COLOR_WALL = "grey";

// text
const TEXT_FONT = "Lucida Console";
const TEXT_GAME_OVER = "GAME OVER";
const TEXT_LEVEL = "Level";
const TEXT_LIVES = "Ball";
const TEXT_SCORE = "Score";
const TEXT_SCORE_HIGH = "BEST";
const TEXT_WIN = "!!! YOU WIN !!!";

// definitions
const Direction = {
    LEFT: 0,
    RIGHT: 1,
    STOP: 2
}

const PupType = {
    EXTENSION: {color: "dodgerblue", symbol: "="},
    LIFE: {color: "hotpink", symbol: "+"},
    STICKY: {color: "forestgreen", symbol: "~"},
    SUPER: {color: "magenta", symbol: "s"}
}

// set up the game canvas and context
var canv = document.createElement("canvas");
document.body.appendChild(canv);
var ctx = canv.getContext("2d");

// set up sound effects
var fxBrick = new Audio("sounds/brick.m4a");
var fxPaddle = new Audio("sounds/paddle.m4a");
var fxPowerup = new Audio("sounds/powerup.m4a");
var fxWall = new Audio("sounds/wall.m4a");

// game variables
var ball, bricks = [], paddle, pups = [];
var gameOver, pupExtension, pupSticky, pupSuper, win;
var level, lives, score, scoreHigh;
var numBricks, textSize, touchX;

// dimensions
var height, width, wall;
setDimensions();

// event listeners
canv.addEventListener("touchcancel", touchCancel);
canv.addEventListener("touchend", touchEnd);
canv.addEventListener("touchmove", touchMove);
canv.addEventListener("touchstart", touchStart);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
window.addEventListener("resize", setDimensions);

// set up the game loop
var timeDelta, timeLast;
requestAnimationFrame(loop);

function loop(timeNow) {
    if (!timeLast) {
        timeLast = timeNow;
    }

    // calculate the time difference
    timeDelta = (timeNow - timeLast) * 0.001; // seconds
    timeLast = timeNow;

    // update
    if (!gameOver) {
        updatePaddle(timeDelta);
        updateBall(timeDelta);
        updateBricks(timeDelta);
        updatePups(timeDelta);
    }

    // draw
    drawBackground();
    drawWalls();
    drawPups();
    drawPaddle();
    drawBricks();
    drawText();
    drawBall();

    // call the next loop
    requestAnimationFrame(loop);
}