const socketIO = (io) => {
  let onlineUsers = [];

  const addNewUser = (userId, socketId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId, socketId });
    }
  };

  const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    return onlineUsers.find((user) => user.userId === userId);
  };

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('newUser', (userId) => {
      addNewUser(userId, socket.id);
      console.log('User registered:', userId);
    });

    socket.on('sendMessage', ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit('getMessage', {
          senderId,
          text,
        });
      }
    });

    socket.on('disconnect', () => {
      removeUser(socket.id);
      console.log('User disconnected');
    });
  });
};

module.exports = socketIO;
