const express = require('express');
const app = express();

const PORT = 5000;

const server = app.listen(PORT, () => console.log(`Running on ${PORT}`));

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`Nice to meet you (shake hand awkwardly), ${socket.id}`);

  socket.emit('welcome', `Welcome to the jungle, ${socket.id}`);

  socket.on('join', () => socket.emit('welcome', `Second welcome message`));
});
