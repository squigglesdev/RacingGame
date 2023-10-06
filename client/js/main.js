const socket = new WebSocket("ws://longhope.ddns.net:8080")

let player;
let camera;
let dt;
let bgSprite;
let carSprite;
let playerName;

let otherPlayers = [];

///////////////////////////
// SOCKET EVENT HANDLERS //
///////////////////////////

// Set up a listener for the 'message' event
socket.addEventListener('message', function (event) {
  // Parse the received JSON data
  const data = JSON.parse(event.data);
  //console.log(data);

  if (data.name !== playerName) {
    if (data.type === 'newPlayer') {
      handleNewPlayer(data);
    } else if (data.type === 'updatePlayer') {
      handleUpdatePlayer(data);
    } else if (data.type === 'playerDisconnect') {
      handlePlayerDisconnect(data);
    }
  }
});

function handleNewPlayer(data) {
  // Create a new player object for the new player
  otherPlayers[data.name] = new Client(data.pos.x, data.pos.y, 40, 800, 800, 300, 0.01, 1, data.name);
  console.log(otherPlayers);
}

function handleUpdatePlayer(data) {
  // Update the position and angle of an existing player
  if (otherPlayers[data.name]) {
    otherPlayers[data.name].pos.x = data.pos.x;
    otherPlayers[data.name].pos.y = data.pos.y;
    otherPlayers[data.name].angle = data.angle;
  } else {
    handleNewPlayer(data);
  }
}

function handlePlayerDisconnect(data) {
  // Remove the disconnected player from the local game state
  if (otherPlayers[data.name]) {
      delete otherPlayers[data.name];
  }
}

window.addEventListener('beforeunload', function (event) {
  // Send a disconnect message to the server
  const disconnectMessage = {
    type: 'disconnect',
    name: player.name // Assuming 'player' is your local player object
  };
  socket.send(JSON.stringify(disconnectMessage));

  // Note: The actual message sent and the format may vary based on your server-side implementation.
  // Ensure that the server understands and handles the 'disconnect' message correctly.
});

/////////////////////
// MAIN GAME LOOP //
////////////////////

function preload() {
  bgSprite = loadImage("sprites/road.svg");
  carSprite = loadImage("sprites/car.svg");
}

function setup() {
  frameRate(165);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("game");

  playerName = prompt("Enter your name: ");

  player = new Client(0, 0, 40, 800, 800, 300, 0.01, 1, playerName);
  camera = new Camera(0.2);

  player.broadcastData(true);
}

let gridSpacing = 40;

function draw() {
  dt = deltaTime / 1000;
  background(220);

  player.handleInput();
  camera.follow(player);

  translate(width / 2 - camera.pos.x, height / 2 - camera.pos.y);

  //image(bgSprite, -width / 2, -height / 2, 2000, 3000);

  drawGrid(camera.pos.x, camera.pos.y, width, height, 40);
  
  player.display();

  for (let otherPlayer in otherPlayers) {
    otherPlayers[otherPlayer].display();
  }
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
