import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import connectDB from "./config/db.js";
import config from "./config/config.js";

import resumeRoute from "./routes/resumeRoute.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import authRoute from "./routes/authRoute.js";

import { Message } from "./models/MessageModel.js";

const app = express();
const httpServer = createServer(app);
const port = config.port;

/* ===================================== */
/* ✅ SIMPLE PRODUCTION CORS (NO COOKIES) */
/* ===================================== */
app.use(cors({
  origin: "https://skillsync-steel.vercel.app"
}));

/* ===================================== */
/* ✅ BODY PARSER */
/* ===================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================================== */
/* ✅ SOCKET.IO WITH CORS */
/* ===================================== */
const io = new Server(httpServer, {
  cors: {
    origin: "https://skillsync-steel.vercel.app",
    methods: ["GET", "POST"]
  }
});

/* ===================================== */
/* ✅ SOCKET EVENTS */
/* ===================================== */
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join_user", (userId) => {
    socket.join(userId.toString());
  });

  socket.on("join_admin", (adminId) => {
    socket.join(adminId.toString());
  });

  socket.on("send_message_to_admin", async (data) => {
    try {
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
      console.error("Error sending message:", error);
    }
  });

  socket.on("send_message_to_user", async (data) => {
    try {
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
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

/* ===================================== */
/* ✅ ROUTES */
/* ===================================== */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/resume", resumeRoute);

/* ===================================== */
/* ✅ START SERVER */
/* ===================================== */
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    httpServer.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
};

startServer();