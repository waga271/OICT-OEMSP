const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Course = require('../models/Course');

// @route    POST api/reviews/:courseId
// @desc     Create or update a review for a course
// @access   Private
// @access   Private
router.post('/:courseId', [
    auth,
    check('rating', 'Rating is required and must be between 1 and 5').isFloat({ min: 1, max: 5 }),
    check('text', 'Review text is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { rating, text } = req.body;
        const courseId = req.params.courseId;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if student is enrolled (optional but recommended)
        const isEnrolled = course.students.some(s => s.user.toString() === req.user.id);
        if (!isEnrolled) {
            return res.status(401).json({ msg: 'Must be enrolled to review' });
        }

        let review = await Review.findOne({ user: req.user.id, course: courseId });

        if (review) {
            // Update existing review
            review.rating = rating;
            review.text = text;
            await review.save();
        } else {
            // Create new review
            review = new Review({
                user: req.user.id,
                course: courseId,
                rating,
                text
            });
            await review.save();
        }

        // Recalculate Course aggregate rating
        const allReviews = await Review.find({ course: courseId });
        const avg = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;
        
        course.averageRating = Math.round(avg * 10) / 10;
        course.totalReviews = allReviews.length;
        await course.save();

        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route    GET api/reviews/:courseId
// @desc     Get all reviews for a course
// @access   Public
router.get('/:courseId', async (req, res) => {
    try {
        const reviews = await Review.find({ course: req.params.courseId })
            .populate('user', ['name'])
            .sort({ date: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
