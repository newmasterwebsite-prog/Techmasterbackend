import dotenv from "dotenv";
// 1. Load environment variables at the very beginning
dotenv.config();

import app from "./app";
import { connectDB } from "./config/database";
import { configureCloudinary } from "./config/cloudinary";

// Handle uncaught exceptions globally
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Initialize database connection
connectDB();

// Initialize Cloudinary
configureCloudinary();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

// Handle unhandled promise rejections globally
process.on("unhandledRejection", (err: any) => {
  console.error("UNHANDLED REJECTION! Shutting down gracefully...");
  console.error(err.name || "Error", err.message || err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle termination signals
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully...");
  server.close(() => {
    console.log("💥 Process terminated.");
  });
});
