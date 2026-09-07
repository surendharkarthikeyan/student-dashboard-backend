const { Server } = require("socket.io");

function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || [
        "http://localhost:3000",
        "http://localhost:5173"
      ],
      methods: ["GET", "POST", "PUT"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initializeSocket;
