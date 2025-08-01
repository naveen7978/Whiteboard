require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectToDB = require("./config/db");
const { Server } = require("socket.io");
const http = require("http");
const Canvas = require("./models/canvasModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

const userRoutes = require("./routes/userRoutes");
const canvasRoutes = require("./routes/canvasRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to req BEFORE routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/canvas", canvasRoutes);

connectToDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Track active rooms per socket
const socketRooms = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Initialize room tracking for this socket
  socketRooms.set(socket.id, new Set());

  socket.on("joinCanvas", async ({ canvasId }) => {
    try {
      const rooms = socketRooms.get(socket.id);

      // Prevent duplicate joins
      if (rooms.has(canvasId)) {
        console.log(`User ${socket.id} already in canvas ${canvasId}`);
        return;
      }

      // Get token from query parameter
      const token = socket.handshake.query.token;
      if (!token) {
        console.log("No token provided");
        socket.emit("unauthorized", { message: "Access Denied: No Token" });
        return;
      }

      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.userId;
      console.log(`User ${userId} joining canvas ${canvasId}`);

      const canvas = await Canvas.findById(canvasId);
      if (!canvas) {
        console.log(`Canvas ${canvasId} not found`);
        socket.emit("unauthorized", { message: "Canvas not found" });
        return;
      }

      // Convert to string for reliable comparison
      const ownerStr = canvas.owner.toString();
      const userIdStr = userId.toString();
      const sharedUsers = canvas.shared.map((id) => id.toString());

      const isOwner = ownerStr === userIdStr;
      const isShared = sharedUsers.includes(userIdStr);

      if (!isOwner && !isShared) {
        console.log(`User ${userIdStr} not authorized for canvas ${canvasId}`);
        socket.emit("unauthorized", {
          message: "You are not authorized to join this canvas",
        });
        return;
      }

      // Join the room and track it
      socket.join(canvasId);
      rooms.add(canvasId);
      console.log(`User ${socket.id} joined canvas ${canvasId}`);

      // Send current canvas elements
      socket.emit("loadCanvas", canvas.elements);
    } catch (error) {
      console.error("Join canvas error:", error);
      if (error.name === "TokenExpiredError") {
        socket.emit("unauthorized", { message: "Token expired" });
      } else if (error.name === "JsonWebTokenError") {
        socket.emit("unauthorized", { message: "Invalid token" });
      } else {
        socket.emit("error", {
          message: "An error occurred while joining the canvas",
        });
      }
    }
  });

  socket.on("drawingUpdate", async ({ canvasId, elements }) => {
    try {
      // Broadcast to others in the room (except sender)
      socket.to(canvasId).emit("receiveDrawingUpdate", elements);

      // Update database
      await Canvas.findByIdAndUpdate(
        canvasId,
        { elements },
        { new: true, useFindAndModify: false }
      );
    } catch (error) {
      console.error("Drawing update error:", error);
    }
  });

  socket.on("leaveCanvas", ({ canvasId }) => {
    const rooms = socketRooms.get(socket.id);
    if (rooms && rooms.has(canvasId)) {
      socket.leave(canvasId);
      rooms.delete(canvasId);
      console.log(`User ${socket.id} left canvas ${canvasId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Cleanup all rooms for this socket
    const rooms = socketRooms.get(socket.id);
    if (rooms) {
      rooms.forEach((roomId) => {
        socket.leave(roomId);
      });
      socketRooms.delete(socket.id);
    }
  });
  socket.on("eraseUpdate", async ({ canvasId, elements }) => {
    try {
      // Broadcast erase to others
      socket.to(canvasId).emit("receiveEraseUpdate", elements);

      // Update database
      await Canvas.findByIdAndUpdate(
        canvasId,
        { elements },
        { new: true, useFindAndModify: false }
      );
    } catch (error) {
      console.error("Erase update error:", error);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
