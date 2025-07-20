const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // More lenient for development
  message: { error: "Too many authentication attempts, please try again later" }
});

// ... (Validation middleware remains the same)
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];


// Register route remains the same
router.post("/register", authLimiter, registerValidation, async (req, res) => {
    // ... (This function's logic is unchanged)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Validation failed", details: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists with this email" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        const userResponse = { ...user._doc };
        delete userResponse.password;
        res.status(201).json({ success: true, message: "User registered successfully", user: userResponse });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: "Registration failed" });
    }
});


// Login route is updated
router.post("/login", authLimiter, loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: "Validation failed", 
      details: errors.array() 
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );
    
    // --- CRITICAL FIX ---
    // We now create a user object to send back, excluding the password.
    // This ensures all profile data (username, bio, profilePicture, etc.) is included.
    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.json({ 
      success: true,
      token,
      user: userResponse, // Send the full user object
      message: "Login successful"
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;