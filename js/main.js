let player;
let camera;
let dt;
let bg;

function preload() {
  bg = loadImage("sprites/road.svg");
}

function setup() {
  frameRate(165);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("game");

  player = new Client(0, 0, 40, 500, 500, 300, 0.02);
  camera = new Camera(0.1);
}

let gridSpacing = 40;

function draw() {
  dt = deltaTime / 1000;
  background(220);

  player.handleInput();
  camera.follow(player);

  translate(width / 2 - camera.pos.x, height / 2 - camera.pos.y);

  image(bg, -width / 2, -height / 2, 1000, 1000);

  //drawGrid(camera.pos.x, camera.pos.y, width, height, gridSpacing);
  
  player.display();
}

function drawGrid(x, y, canvasWidth, canvasHeight, spacing) {
  let startX = floor((x - canvasWidth / 2 - 2 * spacing) / spacing) * spacing;
  let startY = floor((y - canvasHeight / 2 - 2 * spacing) / spacing) * spacing;
  let endX = floor((x + canvasWidth / 2 + 2 * spacing) / spacing) * spacing;
  let endY = floor((y + canvasHeight / 2 + 2 * spacing) / spacing) * spacing;

  for (let i = startX; i <= endX; i += spacing) {
    line(i, startY, i, endY);
  }
  for (let j = startY; j <= endY; j += spacing) {
    line(startX, j, endX, j);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
