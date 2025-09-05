import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";

import config from "./config/config.js";
import userRoute from "./routes/userRoute.js";

const app = express();
const port = config.port;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to home page 🚀");
});

app.use("/api/v1/users", userRoute);

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
};

startServer();
