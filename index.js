var W = 20, H = 20;                             // Board width and height (20x20 grid)
var TICK_MS = 120;                              // Game speed (milliseconds per move)

var boardEl = document.getElementById("board"); //Referencing the board element in the html
var scoreEl = document.getElementById("score"); // Reference the score

var snake, dir, food, score, timerId; // declaring varaibles 
var nextDir = null;

var directions = [];
var current_direction = [];

function idx(x, y) { return y * W + x; }
function rnd(n) { return Math.floor(Math.random() * n); }

function placeFood() {                          // Places food at a random empty cell
  do { food = { x: rnd(W), y: rnd(H) }; }
  while (containsSnake(food.x, food.y));        // Avoid placing food on the snake
  console.log ("new food placed!");
}

function containsSnake(x, y) {
  var i;
  for (i = 0; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) return true;
  }
  return false;
}

function resetGame() {                        // Resets all game state to start a new round
  snake = [{ x: 10, y: 10 }];                 // Start snake at center
  dir   = { x: 1, y: 0 };                     // Moving right by default
  score = 0;                                  // Reset score
  placeFood();                                // Spawn initial food
  if (timerId) { clearInterval(timerId); }
  timerId = setInterval(tick, TICK_MS);
  render();
  updateScore();
}

function updateScore(text) {                                // Updates score text on the screen
  scoreEl.textContent = text ? text : ("Score: " + score);
}

function setDirection(nx, ny) {                                            // Controls the movement 
  if ((nx !== 0 && dir.x === -nx) || (ny !== 0 && dir.y === -ny)) return;  // Allows the snake not to collide with itself
  dir = { x: nx, y: ny };
}

function tick() {

  //if theres a queued direction, set it
  if (nextDir !== null) {
  setDirection(nextDir.x, nextDir.y); //call a solid value for setDirection depending on variable set in keylistener
  nextDir = null; //we then clear next dir for the next entry
 }
  var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  var hitWall = (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H);   // Wall collision
  var hitSelf = containsSnake(head.x, head.y);                              // Self collision
  if (hitWall || hitSelf) {                                                 // End game on collision
    clearInterval(timerId);
    updateScore("Game over! Final score: " + score);                       //dates score until Game over     
  return;
  }

  snake.unshift(head);                                        // Add new head to snake
  if (head.x === food.x && head.y === food.y) {               // Check if food eaten
    score++;
    updateScore();
    placeFood();                                              // Spawn new food
  } else {
    snake.pop();
  }



  render();
}

function render() {                       // Creates the visual for the game
  var cells = [];
  var total = W * H;
  var i;
  for (i = 0; i < total; i++) cells.push('<div class=\"cell\"></div>');

  for (i = 0; i < snake.length; i++) {    // Creates the snake and updates it when neccesary
    var s = snake[i];
    cells[idx(s.x, s.y)] = '<div class=\"cell snake\"></div>';
  }
  cells[idx(food.x, food.y)] = '<div class=\"cell food\"></div>';   // Creates the food for the snake

  boardEl.innerHTML = cells.join("");


}

document.addEventListener("keydown", function (e) {
  var k = e.key.toLowerCase(); //any uppercase letter will be shrunk to lowercase
  // sets direction of snake based on input of WASD control scheme
  if (k === "w") {
    nextDir = {x:0, y:-1}; //setting next direction into queue to define direction
    console.log("snake move up"); //logging in console each direction movement
   } 
    else if (k === "s") {
    nextDir = {x: 0, y: 1};
    console.log("snake move down");
   } 
    else if (k === "a") {
    nextDir = {x: -1, y:0};
    console.log("snake move left");
   } 
    else if (k === "d") {
    nextDir = {x: 1, y:0};
    console.log("snake move right");
  } 
    else if (k === "r") {
    resetGame();// R to resetgame
    console.log("reset!");
  }

});