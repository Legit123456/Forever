import "dotenv/config"; // ✅ MUST be first
import "./config/validateEnv.js";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";

// App Config
const app = express();
const PORT = process.env.PORT || 4000;
connectCloudinary()

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// 🚀 Bootstrap Server
const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// DB Lifecycle Guards
mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 MongoDB error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("🟠 MongoDB disconnected");
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});