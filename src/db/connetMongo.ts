import mongoose from "mongoose";
import { config } from "../config";
import logger from "../utils/logger";

const connectDB = async () => {
  try {
    logger.info("Connecting to DB");
    await mongoose.connect(config.MONGO_URI);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

export default connectDB;
