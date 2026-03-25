import mongoose from "mongoose";
import config from "./config.js";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    logger.info("MongoDB connected");
  });

  await mongoose.connect(`${config.mongoURI}`);
};

export default connectDB;
