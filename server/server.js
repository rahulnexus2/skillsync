import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import session from "express-session";
import passport from "passport";

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

/* ============================= */
/* ✅ ALLOWED ORIGINS */
/* ============================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://skillsync-steel.vercel.app"
];

/* ============================= */
/* ✅ EXPRESS CORS */
/* ============================= */
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

/* ============================= */
/* ✅ BODY PARSER */
/* ============================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ============================= */
/* ✅ SESSION (CROSS ORIGIN SAFE) */
/* ============================= */
app.use(session({
  secret: "mysecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // required for cross-site cookies (HTTPS)
    sameSite: "none"     // required for Vercel <-> Render
  }
}));

app.use(passport.initialize());
app.use(passport.session());

/* ============================= */
/* ✅ SOCKET.IO CORS */
/* ============================= */
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

/* ============================= */
/* ✅ SOCKET EVENTS */
/* ============================= */
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join_user", (userId) => {
    socket.join(userId.toString());
  });

  socket.on("join_admin", (adminId) => {
    socket.join(adminId.toString());
  });

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

      io.to(receiverId.toString()).emit("receive_message", newMessage);
      io.to(senderId.toString()).emit("receive_message", newMessage);

    } catch (error) {
      console.error("Error sending message to admin:", error);
    }
  });

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

      io.to(receiverId.toString()).emit("receive_message", newMessage);
      io.to(senderId.toString()).emit("receive_message", newMessage);

    } catch (error) {
      console.error("Error sending message to user:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

/* ============================= */
/* ✅ ROUTES */
/* ============================= */
app.get("/", (req, res) => {
  res.send("Welcome to home page 🚀");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/resume", resumeRoute);

/* ============================= */
/* ✅ START SERVER */
/* ============================= */
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