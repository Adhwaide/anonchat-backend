const WebSocket = require('ws');
const port = process.env.PORT || 8080;
const server = require('http').createServer();
const wss = new WebSocket.Server({ server });
server.listen(port, () => console.log(`WebSocket server running on port ${port}`));


let waitingUser = null; // Store a user waiting to connect

wss.on('connection', (ws) => {
    console.log('User connected.');

    // Check if there's another user waiting for a connection
    if (waitingUser) {
        // Pair the users
        ws.partner = waitingUser;
        waitingUser.partner = ws;

        // Send a message to both users that they are connected
        ws.send("You are now connected!");
        waitingUser.send("You are now connected!");

        // Clear waiting user since they are now paired
        waitingUser = null;
    } else {
        // No one is waiting, so set this user as waiting
        waitingUser = ws;
        ws.send("Waiting for a partner to connect...");
    }

    // Listen for messages and send them to the partner
    ws.on('message', (message) => {
        if (ws.partner) {
            ws.partner.send(message);
        } else {
            ws.send("No partner connected.");
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('User disconnected.');

        // Notify the partner if they exist
        if (ws.partner) {
            ws.partner.send("Your partner has disconnected.");
            ws.partner.partner = null; // Remove the partner link
        } else if (waitingUser === ws) {
            // If the disconnected user was waiting, clear the waiting user
            waitingUser = null;
        }
    });
});
