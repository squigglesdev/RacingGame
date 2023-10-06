const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = {};

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        //console.log(data);

        if (data.type === 'newPlayer') {
            // Handle new player connection
            clients[data.name] = ws;
            
            // Send existing player data to the new player
            for (let playerName in clients) {
                if (playerName !== data.name) {
                    // Send the existing player's data to the new player
                    ws.send(JSON.stringify({ type: 'newPlayer', name: playerName }));
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
    wss.clients.forEach((client) => {
        if (client !== clients[data.name] && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'newPlayer', name: data.name, pos: data.pos, angle: data.angle }));
        }
    });
}

function broadcastUpdatePlayer(data) {
    // Broadcast player position and angle updates to all clients except the sender
    console.log("Update player: " + data.name);
    wss.clients.forEach((client) => {
        if (client !== clients[data.name] && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'updatePlayer', name: data.name, pos: data.pos, angle: data.angle }));
        }
    });
}

function broadcastPlayerDisconnect(data) {
    // Broadcast player disconnection to all clients except the sender
    console.log("Disconnect player: " + data.name);
    wss.clients.forEach((client) => {
        if (client !== clients[data.name] && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'playerDisconnect', name: data.name }));
        }
    });
}
