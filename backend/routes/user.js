const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer'); // We use multer for memory storage now

// Configure multer to store files in memory as buffers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    if (filetypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   PUT api/user/profile
// @desc    Update user profile text data
// @access  Private
router.put('/profile', [ authMiddleware, [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, username, phone, dob, gender, bio } = req.body;
        const userFields = { name, email, phone, dob, gender, bio };
        if (username) userFields.username = username;

        if (username) {
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== req.user.id) {
                return res.status(400).json({ error: 'Username is already taken' });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error("Profile update error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/user/profile-picture
// @desc    Upload/update user profile picture
// @access  Private
router.post('/profile-picture', [authMiddleware, upload.single('profilePicture')], async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        user.profilePicture = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };

        await user.save();
        
        // Return the full user object without the password
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json(userResponse);

    } catch (error) {
        console.error("Profile picture save error:", error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/user/avatar/:userId
// @desc    Get user avatar by user ID
// @access  Public
router.get('/avatar/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user || !user.profilePicture || !user.profilePicture.data) {
            // Optionally, send a default image
            return res.status(404).send('Not found');
        }

        res.set('Content-Type', user.profilePicture.contentType);
        res.send(user.profilePicture.data);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;