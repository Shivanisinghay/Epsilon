const express = require('express');
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const authMiddleware = require('../middleware/authMiddleware'); // We'll create this next

const router = express.Router();

// Middleware to protect routes
router.use(authMiddleware);

// Get all content for a user
router.get('/', async (req, res) => {
  try {
    const content = await Content.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Save new content
router.post('/', [
    body('type').notEmpty(),
    body('prompt').notEmpty(),
    body('generatedContent').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { type, prompt, generatedContent } = req.body;
        const newContent = new Content({
            userId: req.user.id,
            type,
            prompt,
            generatedContent
        });
        await newContent.save();
        res.status(201).json(newContent);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save content' });
    }
});

module.exports = router;