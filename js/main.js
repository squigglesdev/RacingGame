let socket;

let player;
let camera;
let dt;
let bgSprite;
let carSprite;
let playerName;

let otherPlayers = [];

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

/////////////////////
// MAIN GAME LOOP //
////////////////////

function preload() {
  bgSprite = loadImage("sprites/road.svg");
  carSprite = loadImage("sprites/car.svg");

  socket = new WebSocket("wss://server.squiggles.dev");
  socket.addEventListener('open', function (event) {
    // WebSocket connection is open, call the initialization function
    initializeGame();
  });

  // Set up a listener for the 'message' event
  socket.addEventListener('message', function (event) {
    // Parse the received JSON data
    const data = JSON.parse(event.data);
    //console.log(data);

    if (data.id !== playerName) {
      if (data.type === 'newPlayer') {
        handleNewPlayer(data);
      } else if (data.type === 'updatePlayer') {
        handleUpdatePlayer(data);
      } else if (data.type === 'playerDisconnect') {
        handlePlayerDisconnect(data);
      } else if (data.type === 'serverDisconnect') {
        alert("You were kicked for inactivity.");
      }
    }
  });

  function handleNewPlayer(data) {
    // Create a new player object for the new player
    otherPlayers[data.id] = new Client(data.pos.x, data.pos.y, 40, 800, 800, 300, 2, 1, data.name, data.id);
    console.log(otherPlayers);
  }

  function handleUpdatePlayer(data) {
    // Update the position and angle of an existing player
    if (otherPlayers[data.id]) {
      otherPlayers[data.id].pos.x = data.pos.x;
      otherPlayers[data.id].pos.y = data.pos.y;
      otherPlayers[data.id].angle = data.angle;
    } else {
      handleNewPlayer(data);
    }
  }

  function handlePlayerDisconnect(data) {
    // Remove the disconnected player from the local game state
    if (otherPlayers[data.id]) {
        delete otherPlayers[data.id];
    }
  }

  window.addEventListener('beforeunload', function (event) {
    // Send a disconnect message to the server
    const disconnectMessage = {
      type: 'disconnect',
      id: player.id 
    };
    socket.send(JSON.stringify(disconnectMessage));
  });
}

function initializeGame() {
  playerName = prompt("Enter a username: ");
  playerid = makeid(20);
  player = new Client(0, 0, 40, 800, 800, 300, 2, 1, playerName, playerid);

  player.broadcastData(true);
}

function setup() {
  frameRate(165);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("game");
  player = new Client(0, 0, 40, 800, 800, 300, 2, 1, playerName, playerid);
  camera = new Camera(0.2);
}

let gridSpacing = 40;

function draw() {
  dt = deltaTime / 1000;
  background(220);

  player.handleInput();
  camera.follow(player);

  translate(width / 2 - camera.pos.x, height / 2 - camera.pos.y);
  scale(camera.zoom / 100);

  drawGrid(camera.pos.x, camera.pos.y, width, height, 40);

  image(bgSprite, -width / 2, -height / 2, 2000, 3000);

  
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
