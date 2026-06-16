const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on("setup", (userId) => {
      if (!userId) return;

      socket.userId = userId;
      socket.join(`user:${userId}`);
      onlineUsers.set(String(userId), socket.id);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("joinConversation", (conversationId) => {
      if (!conversationId) return;

      socket.join(`conversation:${conversationId}`);
    });

    socket.on("leaveConversation", (conversationId) => {
      if (!conversationId) return;

      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("typing", ({ conversationId, userId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing", { userId });
    });

    socket.on("stopTyping", ({ conversationId, userId }) => {
      socket.to(`conversation:${conversationId}`).emit("stopTyping", { userId });
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);

      if (socket.userId) {
        onlineUsers.delete(String(socket.userId));
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      }
    });
  });
};

export default socketHandler;