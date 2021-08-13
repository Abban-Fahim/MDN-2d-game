const canvas = document.getElementById("main-screen");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const rightBtn = document.getElementById("right-btn");
const leftBtn = document.getElementById("left-btn");

function playAudio(audioName) {
  let audio = new Audio(`${audioName}.wav`);
  audio.play();
}

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];

let score = 0;
let lives = 3;

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, broken: false };
  }
  console.log(bricks);
}

let isRightPressed = false,
  isLeftpressed = false;

leftBtn.addEventListener("click", () => {
  isLeftpressed = true;
  setTimeout(() => (isLeftpressed = false), 10);
});

rightBtn.addEventListener("click", () => {
  isRightPressed = true;
  setTimeout(() => (isRightPressed = false), 10);
});

document.addEventListener(
  "mousemove",
  (e) => {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
  },
  false
);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    isRightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    isLeftpressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    isRightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    isLeftpressed = false;
  }
}

function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let brick = bricks[c][r];
      if (
        x > brick.x &&
        x < brick.x + brickWidth &&
        y > brick.y &&
        y < brick.y + brickHeight
      ) {
        if (!brick.broken) {
          dy = -dy;
          playAudio("collision");
          brick.broken = true;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("Congrats! You Won!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = getRandomColor();
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = getRandomColor();
  ctx.fill();
  ctx.closePath();
}

function darwBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (!bricks[c][r].broken) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = getRandomColor();
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawLives() {
  ctx.font = "16px serif";
  ctx.fillStyle = "#eeeeee";
  ctx.fillText(lives.toString(), 10, 18);
  let heart = new Image(20, 20);
  heart.src = "./heart.png";
  ctx.drawImage(heart, 20, 3, 20, 20);
}

function drawScore() {
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#eeeeee";
  ctx.fillText(`Score: ${score}`, canvas.width - 70, 18);
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  darwBricks();
  collisionDetection();
  drawLives();
  drawScore();
  x += dx;
  y += dy;
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    playAudio("collision");
  }
  if (y + dy < ballRadius) {
    dy = -dy;
    playAudio("collision");
  } else if (y + dy > canvas.height - ballRadius) {
    if (x + ballRadius > paddleX && x < paddleX + paddleWidth) {
      playAudio("paddle-hit");
      dy = -dy;
      if (x + ballRadius < paddleX + paddleWidth / 2) {
        dx = -dx;
      }
    } else {
      lives--;
      if (!lives) {
        alert("Game Over!");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  if (isRightPressed && paddleX + paddleWidth < canvas.width) {
    paddleX += 7;
  }
  if (isLeftpressed && paddleX > 0) {
    paddleX -= 7;
  }
  requestAnimationFrame(drawScene);
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

requestAnimationFrame(drawScene);
