import express from 'express';
const router = express.Router();
import Review from '../models/Review.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

// @desc    Get all approved reviews
// @route   GET /api/reviews
// @access  Public
router.get('/', async (req, res) => {
    // This route is fine, no changes needed here.
    const reviews = await Review.find({ isApproved: true }).populate('user', 'name avatar');
    res.json(reviews);
});

// @desc    Submit a new review
// @route   POST /api/reviews
// @access  Private (requires user to be logged in)
router.post('/', protect, async (req, res) => {
  // The fix is applied to this route handler
  try {
    const { rating, comment } = req.body;
    
    // 1. Basic Validation
    if (!rating || !comment) {
      return res.status(400).json({ msg: 'Please provide a rating and a comment.' });
    }

    // 2. Check if the user has already submitted a review
    const existingReview = await Review.findOne({ user: req.user.id });
    if (existingReview) {
        return res.status(400).json({ msg: 'You have already submitted a review.' });
    }

    // 3. Create the new review object
    const review = new Review({
      user: req.user.id, // Get user ID from the 'protect' middleware
      name: req.user.name, // Get user name from the 'protect' middleware
      rating: Number(rating),
      comment,
      // isApproved is false by default based on the model
    });

    // 4. Save the review to the database
    const createdReview = await review.save();
    res.status(201).json(createdReview);

  } catch (error) {
    // 5. THIS IS THE CRUCIAL PART FOR DEBUGGING
    // It will log the detailed error to your VS Code terminal.
    console.error('ERROR OCCURRED WHILE SUBMITTING REVIEW:', error);
    
    // 6. Send a generic error message back to the frontend
    res.status(500).json({ msg: 'Server error occurred. Please check the terminal for details.' });
  }
});

export default router;