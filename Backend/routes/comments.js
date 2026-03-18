const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const Course = require('../models/Course');

// @route    POST api/comments/:lessonId
// @desc     Post a comment on a lesson
// @access   Private
router.post('/:lessonId', auth, async (req, res) => {
    try {
        const { text } = req.body;

        const newComment = new Comment({
            user: req.user.id,
            lesson: req.params.lessonId,
            text
        });

        const comment = await newComment.save();
        
        // Return populated comment
        const populatedComment = await Comment.findById(comment._id).populate('user', ['name', 'role']);
        res.json(populatedComment);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route    GET api/comments/:lessonId
// @desc     Get all comments for a lesson
// @access   Private
router.get('/:lessonId', auth, async (req, res) => {
    try {
        const comments = await Comment.find({ lesson: req.params.lessonId })
            .populate('user', ['name', 'role'])
            .sort({ date: -1 });
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route    DELETE api/comments/:id
// @desc     Delete a comment
// @access   Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Check if user is the comment owner
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await comment.deleteOne();
        res.json({ msg: 'Comment removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
