const WebSocket = require('ws');
const PORT = process.env.PORT || 8080; // Use Railway's assigned port

const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server running on port ${PORT}`);

let waitingUser = null;

wss.on('connection', (ws) => {
    console.log('User connected.');

    if (waitingUser) {
        ws.partner = waitingUser;
        waitingUser.partner = ws;

        ws.send("You are now connected!");
        waitingUser.send("You are now connected!");

        waitingUser = null;
    } else {
        waitingUser = ws;
        ws.send("Waiting for a partner to connect...");
    }

    ws.on('message', (message) => {
        if (ws.partner) {
            ws.partner.send(message);
        } else {
            ws.send("No partner connected.");
        }
    });

    ws.on('close', () => {
        console.log('User disconnected.');
        if (ws.partner) {
            ws.partner.send("Your partner has disconnected.");
            ws.partner.partner = null;
        } else if (waitingUser === ws) {
            waitingUser = null;
        }
    });
});
