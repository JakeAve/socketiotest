const express = require('express');
const app = express();

const PORT = 5000;

const server = app.listen(PORT, () => console.log(`Running on ${PORT}`));

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const dbInterface = require('./db/ghettodb');

const db = new dbInterface('./db/rooms');

io.on('connection', (socket) => {
  console.log(`Nice to meet you (shake hand awkwardly), ${socket.id}`);
  let cr, u;

  socket.on('join', (user, chatroom) => {
    console.log(`${user} has joined ${chatroom}`);
    socket.join(chatroom);
    if (cr && cr !== chatroom) leaveChatroom(user, cr);
    const message = {
      sender: 'system',
      text: `{${user}} joined the chat`,
      time: new Date().toISOString(),
    };
    db.storeMessage(message, chatroom).then(() =>
      io.in(chatroom).emit('receive-message', message),
    );
    cr = chatroom;
    u = user;
  });
  socket.on('disconnect', () => leaveChatroom(u, cr));
  socket.on('logout', () => leaveChatroom(u, cr));
  socket.on('new-chatroom', (chatroom, user) => {
    db.createChatroom(chatroom, [user])
      .then(() => db.getChatrooms())
      .then((chatrooms) => io.emit('chatrooms', chatrooms));
  });
  socket.on('send-message', (message, chatroom) => {
    socket.to(chatroom).emit('receive-message', message);
    db.storeMessage(message, chatroom);
  });
  socket.on('get-chatrooms', () => updateChatrooms(socket));
  socket.on('get-messages', (chatroom) => {
    db.getMessages(chatroom)
      .then((messages) => {
        socket.emit('all-messages', messages);
      })
      .catch((err) => console.error(err));
  });
});

const updateChatrooms = (socket) => {
  db.getChatrooms()
    .then((chatrooms) => {
      socket.emit('chatrooms', chatrooms);
    })
    .catch((err) => console.error(err));
};

const leaveChatroom = (user, chatroom) => {
  if (user && chatroom) {
    const userLeft = {
      sender: 'system',
      text: `{${user}} left the chat`,
      time: new Date().toISOString(),
    };
    io.in(chatroom).emit('receive-message', userLeft);
    db.storeMessage(userLeft, chatroom);
  }
};
