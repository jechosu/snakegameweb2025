var W = 20, H = 20;
var TICK_MS = 120;

var boardEl = document.getElementById("board");
var scoreEl = document.getElementById("score");

var snake, dir, food, score, timerId;

function idx(x, y) { return y * W + x; }
function rnd(n) { return Math.floor(Math.random() * n); }

function placeFood() {
  do { food = { x: rnd(W), y: rnd(H) }; }
  while (containsSnake(food.x, food.y));
}

function containsSnake(x, y) {
  var i;
  for (i = 0; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) return true;
  }
  return false;
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  dir   = { x: 1, y: 0 };
  score = 0;
  placeFood();
  if (timerId) { clearInterval(timerId); }
  timerId = setInterval(tick, TICK_MS);
  render();
  updateScore();
}

function updateScore(text) {
  scoreEl.textContent = text ? text : ("Score: " + score);
}

function setDirection(nx, ny) {
  if ((nx !== 0 && dir.x === -nx) || (ny !== 0 && dir.y === -ny)) return;
  dir = { x: nx, y: ny };
}

function tick() {
  var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  var hitWall = (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H);
  var hitSelf = containsSnake(head.x, head.y);
  if (hitWall || hitSelf) {
    clearInterval(timerId);
    updateScore("Game over! Final score: " + score);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    placeFood();
  } else {
    snake.pop();
  }

  render();
}

function render() {
  var cells = [];
  var total = W * H;
  var i;
  for (i = 0; i < total; i++) cells.push('<div class=\"cell\"></div>');

  for (i = 0; i < snake.length; i++) {
    var s = snake[i];
    cells[idx(s.x, s.y)] = '<div class=\"cell snake\"></div>';
  }
  cells[idx(food.x, food.y)] = '<div class=\"cell food\"></div>';

  boardEl.innerHTML = cells.join("");
}

// --- WASD keys
document.addEventListener("keydown", function (e) {
  var k = e.key;
  if (k === "w" || k === "W") setDirection(0, -1);
  else if (k === "s" || k === "S") setDirection(0,  1);
  else if (k === "a" || k === "A") setDirection(-1, 0);
  else if (k === "d" || k === "D") setDirection(1,  0);
  else if (k === "r" || k === "R") resetGame();
});