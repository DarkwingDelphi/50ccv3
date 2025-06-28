const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: canvas.width/2, y: canvas.height-60, size:24, speed:5 };
let obstacles = [];
let score = 0;
let gameOver = false;
let bgColor = {r:0,g:0,b:0};
let targetColor = {r:0,g:0,b:0};
let movingLeft = false;
let movingRight = false;

function spawnObstacle() {
  const x = Math.random() * (canvas.width - 40);
  obstacles.push({ x, y: -30, width:40, height:24 });
}

function resetGame() {
  obstacles = [];
  score = 0;
  gameOver = false;
  bgColor = {r:0,g:0,b:0};
  targetColor = {r:0,g:0,b:0};
  player.x = canvas.width/2;
  document.getElementById('gameOver').style.display = 'none';
}

function update() {
  if (gameOver) return;

  if (movingLeft) player.x -= player.speed;
  if (movingRight) player.x += player.speed;

  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;

  score += 0.1;

  if (Math.random() < 0.02) spawnObstacle();

  for (let obs of obstacles) {
    obs.y += 4;

    const hitboxPadding = 8;
    if (
      obs.x < player.x + player.size - hitboxPadding &&
      obs.x + obs.width > player.x + hitboxPadding &&
      obs.y < player.y + player.size - hitboxPadding &&
      obs.y + obs.height > player.y + hitboxPadding
    ) {
      document.getElementById('gameOver').style.display = 'block';
      gameOver = true;
    }
  }

  obstacles = obstacles.filter(o => o.y < canvas.height + 50);

  if (Math.floor(score) % 100 === 0 && Math.floor(score) !== 0) {
    targetColor = {
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255)
    };
  }

  bgColor.r += (targetColor.r - bgColor.r) * 0.01;
  bgColor.g += (targetColor.g - bgColor.g) * 0.01;
  bgColor.b += (targetColor.b - bgColor.b) * 0.01;
}

function draw() {
  ctx.fillStyle = `rgb(${bgColor.r},${bgColor.g},${bgColor.b})`;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = 'white';
  ctx.font = '24px monospace';
  ctx.fillText("c50c", player.x, player.y);

  ctx.fillStyle = 'red';
  for (let obs of obstacles) {
    ctx.fillText("d00r", obs.x, obs.y);
  }
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

setInterval(() => {
  if (!gameOver) {
    document.getElementById('score').textContent = `Score: ${Math.floor(score)} miles`;
  }
}, 200);

window.addEventListener('touchstart', e => {
  if (gameOver) {
    resetGame();
    return;
  }
  const x = e.touches[0].clientX;
  if (x < canvas.width/2) movingLeft = true;
  else movingRight = true;
});

window.addEventListener('touchend', () => {
  movingLeft = false;
  movingRight = false;
});

window.addEventListener('keydown', e => {
  if (gameOver && e.key === 'r') resetGame();
  if (!gameOver) {
    if (e.key === 'ArrowLeft') movingLeft = true;
    if (e.key === 'ArrowRight') movingRight = true;
  }
});

window.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft') movingLeft = false;
  if (e.key === 'ArrowRight') movingRight = false;
});

gameLoop();
