const express = require("express");
const http = require("http");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const initializeSocket = require("./sockets/socket");

const app = express();
const httpServer = http.createServer(app);
const io = initializeSocket(httpServer);
app.set("io", io);

app.use(cors());
app.use(express.json());
app.use("/api/students", studentRoutes);
app.use("/api/performances", performanceRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exitCode = 1;
  }
}

startServer();