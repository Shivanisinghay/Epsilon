const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   PUT api/user/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    authMiddleware,
    [
      body('name', 'Name is required').not().isEmpty(),
      body('email', 'Please include a valid email').isEmail(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const userFields = { name, email };

    try {
      let user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If password is provided, hash it and update
      if (password) {
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }
        const salt = await bcrypt.genSalt(10);
        userFields.password = await bcrypt.hash(password, salt);
      }

      user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: userFields },
        { new: true }
      ).select('-password');

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;