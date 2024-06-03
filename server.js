import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import { saveUser, getCurrentUser, removeUser, getUsersByCode } from './utils/users.js';
import { timeNow } from './utils/time.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, "public")));

io.on('connection', socket => {
  socket.on('disconnect', () => handleDisconnect(io, socket));
  socket.on('clientChatMessage', msg => handleMessage(io, socket, msg));
  socket.on('joinsChat', data => handleJoin(io, socket, data));
});

function handleDisconnect(io, socket) {
  const user = removeUser(socket.id);
  if (user) {
    const code = user.code;
    io.to(code).emit('serverDisconnectMessage', `${user.username} user has left the chat`);
    io.to(code).emit('serverInfoMessage', { code, users: getUsersByCode(code) });
  }
}

function handleMessage(io, socket, msg) {
  const user = getCurrentUser(socket.id);
  if (user) {
    const code = user.code;
    io.to(code).emit('serverChatMessage', { username: user.username, message: msg, time: timeNow() });
  }
}

function handleJoin(io, socket, { username, code }) {
  const user = saveUser(socket.id, username, code);
  socket.join(code);
  socket.emit('serverWelcomeMessage', 'Welcome to ChatApp!');
  socket.broadcast.to(code).emit('serverBroadcastMessage', `${user.username} user has joined the chat`);
  io.to(code).emit('serverInfoMessage', { code, users: getUsersByCode(code) });
}

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
