const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Content = require('../models/Content');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/stats
// @desc    Get application-wide statistics
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Count the total number of users
    const userCount = await User.countDocuments();
    
    // Count each type of content generated
    const imageCount = await Content.countDocuments({ type: 'image' });
    const audioCount = await Content.countDocuments({ type: 'audio' });
    const emailCount = await Content.countDocuments({ type: 'email' });
    const transcriptCount = await Content.countDocuments({ type: 'transcript' });
    const notificationCount = await Content.countDocuments({ type: 'notification' });

    // Send the real stats as a JSON response
    res.json({
      users: userCount,
      images: imageCount,
      audios: audioCount,
      emails: emailCount,
      transcripts: transcriptCount,
      notifications: notificationCount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;