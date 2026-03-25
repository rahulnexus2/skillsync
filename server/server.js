import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";

import connectDB from "./config/db.js";
import config from "./config/config.js";
import { logger } from "./utils/logger.js";

import resumeRoute from "./routes/resumeRoute.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import authRoute from "./routes/authRoute.js";

import { Message } from "./models/MessageModel.js";

const app = express();
app.set("trust proxy", 1);
const httpServer = createServer(app);
const port = config.port;

const clientOrigins = process.env.CLIENT_ORIGINS
  ? process.env.CLIENT_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : ["http://localhost:5173", "https://skillsync-steel.vercel.app"];

app.use(cors({ origin: clientOrigins }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(httpServer, {
  cors: {
    origin: clientOrigins,
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("unauthorized"));
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.id?.toString();
    socket.role = payload.role;
    return next();
  } catch {
    return next(new Error("unauthorized"));
  }
});

io.on("connection", (socket) => {
  logger.info("socket connected:", socket.id);

  socket.on("join_user", (userId) => {
    if (socket.role !== "user") return;
    if (String(socket.userId) !== String(userId)) return;
    socket.join(userId.toString());
  });

  socket.on("join_admin", (adminId) => {
    if (socket.role !== "admin") return;
    if (String(socket.userId) !== String(adminId)) return;
    socket.join(adminId.toString());
  });

  socket.on("send_message_to_admin", async (data) => {
    try {
      if (socket.role !== "user") return;
      if (!data || String(data.senderId) !== String(socket.userId)) return;

      const newMessage = await Message.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        senderModel: "User",
        receiverModel: "Admin",
        message: data.message,
      });

      io.to(data.receiverId.toString()).emit("receive_message", newMessage);
      io.to(data.senderId.toString()).emit("receive_message", newMessage);
    } catch (error) {
      logger.error("Error sending message (user→admin):", error.message);
    }
  });

  socket.on("send_message_to_user", async (data) => {
    try {
      if (socket.role !== "admin") return;
      if (!data || String(data.senderId) !== String(socket.userId)) return;

      const newMessage = await Message.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        senderModel: "Admin",
        receiverModel: "User",
        message: data.message,
      });

      io.to(data.receiverId.toString()).emit("receive_message", newMessage);
      io.to(data.senderId.toString()).emit("receive_message", newMessage);
    } catch (error) {
      logger.error("Error sending message (admin→user):", error.message);
    }
  });

  socket.on("disconnect", () => {
    logger.info("socket disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/resume", resumeRoute);

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(port, () => {
      logger.info(`Server listening on port ${port}`);
    });
  } catch (err) {
    logger.error("Failed to connect to MongoDB:", err);
  }
};

startServer();
