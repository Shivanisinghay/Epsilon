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
const contentRoutes = require("./routes/content");
const userRoutes = require("./routes/user");
const statsRoutes = require("./routes/stats"); // 1. Import the new stats route
const errorHandler = require("./middleware/errorHandler");
const validateEnv = require("./utils/validateEnv");

dotenv.config();
validateEnv();

const app = express();

// ... (all middleware like helmet, cors, etc. remains the same)
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
app.use(express.json({ limit: '10mb' }));


// ... (database connection remains the same)
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


// ... (static file serving remains the same)
app.use('/images', express.static('images'));
app.use('/audio', express.static('audio'));


// API Routes
app.use("/api/text", textRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stats", statsRoutes); // 2. Tell the app to USE the stats route

// ... (error handler and server start logic remains the same)
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));