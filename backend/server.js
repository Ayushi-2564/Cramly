import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import socketHandler from "./sockets/socketHandler.js";

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Global middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🎓 Cramly API is running!",
  });
});

// API health route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cramly backend health check passed",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Socket handler
socketHandler(io);

// Error middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});