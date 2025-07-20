const express = require('express');
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// This middleware protects all routes in this file, ensuring only logged-in users can access them.
router.use(authMiddleware);

// @route   GET api/content
// @desc    Get all content for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const content = await Content.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/content
// @desc    Save new content
// @access  Private
router.post(
  '/',
  [
    body('type', 'Type is required').not().isEmpty(),
    body('prompt', 'Prompt is required').not().isEmpty(),
    body('generatedContent', 'Generated content is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, prompt, generatedContent } = req.body;

    try {
      const newContent = new Content({
        userId: req.user.id,
        type,
        prompt,
        generatedContent,
      });

      const content = await newContent.save();
      res.status(201).json(content);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/content/:id
// @desc    Delete a content item by its ID
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);

        // 1. Check if the content item actually exists
        if (!content) {
            return res.status(404).json({ msg: 'Content not found' });
        }

        // 2. Verify that the user deleting the content is the one who owns it
        if (content.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // 3. If checks pass, delete the item
        await content.deleteOne();

        res.json({ msg: 'Content removed successfully' });
    } catch (err) {
        console.error("Error in delete route:", err.message);
        // Handle cases where the provided ID is not a valid MongoDB ObjectId
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Content not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;