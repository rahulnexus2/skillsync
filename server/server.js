import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";

import session from "express-session";
import passport from "passport";
import {Oauth} from "./Oauth/Oauth.js"

import config from "./config/config.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js"

const app = express();
const port = config.port;

app.use(session({ secret: "mysecret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session())


app.use(cors());
app.use(express.json());




Oauth();

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.send("Login Successful! Welcome " + req.user.displayName)
);


app.get("/auth/failure", (req, res) => {
  res.status(400).send(`
    <h2>OAuth Login Failed</h2>
    <p>There was a problem logging in with Google. Please check your credentials or try again.</p>
    <a href="/auth/google">Try Again</a>
  `);
});

app.get("/", (req, res) => {
  res.send("Welcome to home page 🚀");
});

app.use("/api/v1/users", userRoute);

app.use("/api/v1/admin",adminRoute);



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
