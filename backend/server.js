const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const textRoutes = require("./routes/text");
const imageRoutes = require("./routes/image");
const audioRoutes = require("./routes/audio");
const authRoutes = require("./auth/auth");
const contentRoutes = require("./routes/content"); // New
const userRoutes = require("./routes/user"); // New
const errorHandler = require("./middleware/errorHandler");
const validateEnv = require("./utils/validateEnv");

dotenv.config();

// Validate environment variables
validateEnv();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later" }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit AI requests to 10 per minute
  message: { error: "AI request limit exceeded, please try again later" }
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files
app.use('/images', express.static('images'));
app.use('/audio', express.static('audio'));

// Routes
app.use("/api/text", aiLimiter, textRoutes);
app.use("/api/image", aiLimiter, imageRoutes);
app.use("/api/audio", aiLimiter, audioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes); // New
app.use("/api/user", userRoutes); // New


// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});