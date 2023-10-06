const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const clients = {};

io.on('connection', (socket) => {
    socket.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(data);

        if (data.type === 'newPlayer') {
            // Handle new player connection
            clients[data.name] = socket;

            // Send existing player data to the new player
            for (let playerName in clients) {
                if (playerName !== data.name) {
                    // Send the existing player's data to the new player
                    socket.emit('message', JSON.stringify({ type: 'newPlayer', name: playerName }));
                }
            }

            // Broadcast the new player information to all clients except the sender
            broadcastNewPlayer(data);
        } else if (data.type === 'updatePlayer') {
            // Handle player position and angle updates
            broadcastUpdatePlayer(data);
        } else if (data.type === 'disconnect') {
            // Handle player disconnection
            broadcastPlayerDisconnect(data);
            delete clients[data.name];
        }
    });
});

function broadcastNewPlayer(data) {
    // Broadcast new player information to all clients except the sender
    console.log("New player: " + data.name);
    for (let playerName in clients) {
        if (playerName !== data.name) {
            clients[playerName].emit('message', JSON.stringify({ type: 'newPlayer', name: data.name, pos: data.pos, angle: data.angle }));
        }
    }
}

function broadcastUpdatePlayer(data) {
    // Broadcast player position and angle updates to all clients except the sender
    console.log("Update player: " + data.name);
    for (let playerName in clients) {
        if (playerName !== data.name) {
            clients[playerName].emit('message', JSON.stringify({ type: 'updatePlayer', name: data.name, pos: data.pos, angle: data.angle }));
        }
    }
}

function broadcastPlayerDisconnect(data) {
    // Broadcast player disconnection to all clients except the sender
    console.log("Disconnect player: " + data.name);
    for (let playerName in clients) {
        if (playerName !== data.name) {
            clients[playerName].emit('message', JSON.stringify({ type: 'playerDisconnect', name: data.name }));
        }
    }
}

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
