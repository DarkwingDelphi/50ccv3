
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: canvas.width/2, y: canvas.height-50, size:20 };
let obstacles = [];
let score = 0;
let speed = 2;

function spawnObstacle() {
  obstacles.push({
    x: Math.random() * canvas.width,
    y: -20,
    size: 20 + Math.random()*20,
    color: `hsl(${Math.random()*360},80%,60%)`
  });
}

function update() {
  for (let o of obstacles) o.y += speed;
  obstacles = obstacles.filter(o => o.y < canvas.height+o.size);
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "20px monospace";
  ctx.fillText("c50c", player.x, player.y);

  for (let o of obstacles) {
    ctx.fillStyle = o.color;
    ctx.fillText("d00r", o.x, o.y);
  }
}

function loop() {
  update();
  draw();
  score += 0.05;
  document.getElementById("score").innerText = `Score: ${Math.floor(score)} miles`;
  if (Math.random() < 0.02) spawnObstacle();
  requestAnimationFrame(loop);
}

window.addEventListener("touchmove", e=>{
  player.x = e.touches[0].clientX;
  player.y = e.touches[0].clientY;
});
window.addEventListener("resize", ()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

loop();
