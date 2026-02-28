import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import cors from "cors";

import session from "express-session";
import passport from "passport";

import resumeRoute from "./routes/resumeRoute.js";


import config from "./config/config.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js"
import authRoute from "./routes/authRoute.js";


const app = express();
const httpServer = createServer(app);
const port = config.port;

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

import { Message } from "./models/MessageModel.js";

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // ===============================
  // USER JOINS THEIR ROOM
  // ===============================
  socket.on("join_user", (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined room ${userId}`);
  });

  // ===============================
  // ADMIN JOINS THEIR OWN PRIVATE ROOM
  // ===============================
  socket.on("join_admin", (adminId) => {
    socket.join(adminId.toString());
    console.log(`Admin ${adminId} joined their private room`);
  });

  // ===============================
  // USER → ADMIN (Private)
  // ===============================
  socket.on("send_message_to_admin", async (data) => {
    const { senderId, receiverId, message } = data;

    try {
      const newMessage = await Message.create({
        senderId,
        receiverId,
        senderModel: "User",
        receiverModel: "Admin",
        message,
      });

      // Send only to assigned admin
      io.to(receiverId.toString()).emit("receive_message", newMessage);

      // Send back to user
      io.to(senderId.toString()).emit("receive_message", newMessage);

    } catch (error) {
      console.error("Error sending message to admin:", error);
    }
  });

  // ===============================
  // ADMIN → USER (Private)
  // ===============================
  socket.on("send_message_to_user", async (data) => {
    const { senderId, receiverId, message } = data;

    try {
      const newMessage = await Message.create({
        senderId,
        receiverId,
        senderModel: "Admin",
        receiverModel: "User",
        message,
      });

      // Send only to that user
      io.to(receiverId.toString()).emit("receive_message", newMessage);

      // Send back to admin
      io.to(senderId.toString()).emit("receive_message", newMessage);

    } catch (error) {
      console.error("Error sending message to user:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});




app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));


app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

app.use(session({ secret: "mysecret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session())

app.use(express.json());
app.use("/api/v1/auth", authRoute);







app.get("/", (req, res) => {
  res.send("Welcome to home page 🚀");
});

app.get("/api/v1/resume/test", (req, res) => {
  res.send("Resume route working");
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/admin", adminRoute);


app.use("/api/v1/resume", resumeRoute);



const startServer = async () => {
  console.log("Starting server with updated CORS config...");
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
