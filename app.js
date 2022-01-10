const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4000;
const app = express();

const server = http.createServer(app);

const { createUser, removeUser, getUser } = require("./user");

const io = socketIo(server, {
    cors: {
        origin: "https://ne0rad.github.io",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    let time = new Date().toLocaleTimeString();
    console.log('\x1b[32m%s\x1b[0m', `[socket.io][${time}] Client connected.`);

    socket.on('join', ({ username, roomID }, callback) => {
        if (!username || !roomID) return callback("Username and RoomID can't be empty.");
        const user = createUser(username, roomID, socket.id);
        if (user.error) return callback(user.error);

        socket.join(roomID);
        socket.in(roomID).emit('notification', `${username} joined the room.`);
        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        let user = getUser(socket.id);
        if (user.error) return callback(user.error);
        socket.in(user.roomID).emit('message', { message: message, username: user.username });
        callback();
    })

    socket.on('disconnectUser', () => {
        console.log('\x1b[31m%s\x1b[0m', `[socket.io][${time}] Client disconnected.`);
        let user = getUser(socket.id);
        if (!user.error && user) {
            socket.in(user.roomID).emit('notification', `${user.username} left the room.`);
            removeUser(socket.id);
        }
    });

    socket.on("disconnect", () => {
        console.log('\x1b[31m%s\x1b[0m', `[socket.io][${time}] Client disconnected.`);
        let user = getUser(socket.id);
        if (!user.error && user) {
            socket.in(user.roomID).emit('notification', `${user.username} left the room.`);
            removeUser(socket.id);
        }
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
