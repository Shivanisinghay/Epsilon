const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  // --- UPDATED FOR DATABASE STORAGE ---
  profilePicture: {
    data: Buffer, // Stores the image data
    contentType: String // Stores the MIME type (e.g., 'image/png')
  },
  // --- END OF UPDATE ---
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  bio: {
    type: String,
    maxlength: [250, 'Bio must be less than 250 characters'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ username: 1 }, { unique: true, partialFilterExpression: { username: { $type: "string" } } });

module.exports = mongoose.model("User", userSchema);