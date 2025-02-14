const socket = new WebSocket('ws://localhost:8080');
let isConnected = false;

socket.onopen = () => {
    console.log('Connected to the WebSocket server.');
};

socket.onmessage = async (event) => {
    // Check if the received data is a Blob, and convert it to text if necessary
    const message = event.data instanceof Blob ? await event.data.text() : event.data;

    if (message === "You are now connected!") {
        isConnected = true;
        displayStatus("You are now connected!");
    } else if (message === "Waiting for a partner to connect...") {
        displayStatus("Waiting for a partner to connect...");
    } else if (message === "Your partner has disconnected.") {
        isConnected = false;
        displayStatus("Your partner has disconnected.");
    } else {
        displayMessage("Stranger", message);
    }
};

socket.onclose = () => {
    isConnected = false;
    displayStatus("Disconnected from the server.");
};

document.getElementById("sendButton").addEventListener("click", sendMessage);
document.getElementById("messageInput").addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

function sendMessage() {
    const messageInput = document.getElementById("messageInput");

    if (messageInput.value.trim() === "") return;

    socket.send(messageInput.value);
    displayMessage("You", messageInput.value);

    messageInput.value = "";
}

function displayMessage(sender, message) {
    const chatBox = document.getElementById("chatBox");
    const messageElement = document.createElement("p");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayStatus(statusMessage) {
    const chatBox = document.getElementById("chatBox");
    const statusElement = document.createElement("p");
    statusElement.innerHTML = `<em>${statusMessage}</em>`;
    chatBox.appendChild(statusElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Disconnect button functionality
const disconnectButton = document.createElement("button");
disconnectButton.innerText = "Disconnect";
disconnectButton.style.marginTop = "10px";
document.querySelector(".chat-container").appendChild(disconnectButton);

disconnectButton.addEventListener("click", () => {
    if (isConnected) {
        socket.close();
        disconnectButton.innerText = "Connect";
        displayStatus("You have disconnected.");
    } else {
        displayStatus("No connection to disconnect.");
    }
});


function displayMessage(sender, message) {
    const chatBox = document.getElementById("chatBox");
    const messageElement = document.createElement("p");

    if (sender === "You") {
        messageElement.className = "sent"; // Sent message class
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    } else {
        messageElement.className = "received"; // Received message class
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

