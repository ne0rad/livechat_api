const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4000;
const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    let time = new Date().toLocaleTimeString();

    console.log('\x1b[32m%s\x1b[0m', "[socket.io] Client connected. " + time);

    socket.on("disconnect", () => {
        console.log('\x1b[31m%s\x1b[0m', "[socket.io] Client disconnected. " + time);
    });

    socket.on('chat', (message) => {
        let date = new Date();
        io.emit('chat', {date: date, message: message});
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
