const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');
const Course = require('../models/Course');

// @route    GET api/progress/:courseId
// @desc     Get user progress for a course
// @access   Private
router.get('/:courseId', auth, async (req, res) => {
    try {
        let progress = await Progress.findOne({ user: req.user.id, course: req.params.courseId });
        
        if (!progress) {
            // Create initial progress if none exists
            progress = new Progress({
                user: req.user.id,
                course: req.params.courseId,
                completedLessons: [],
                completedQuizzes: []
            });
            await progress.save();
        }
        
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route    POST api/progress/lesson/:courseId/:lessonId
// @desc     Mark lesson as completed
// @access   Private
router.post('/lesson/:courseId/:lessonId', auth, async (req, res) => {
    try {
        let progress = await Progress.findOne({ user: req.user.id, course: req.params.courseId });

        if (!progress) {
            progress = new Progress({
                user: req.user.id,
                course: req.params.courseId,
                completedLessons: []
            });
        }

        if (progress.completedLessons.some(l => l.lesson.toString() === req.params.lessonId)) {
            return res.json(progress);
        }

        progress.completedLessons.unshift({ lesson: req.params.lessonId });
        await progress.save();
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route    POST api/progress/quiz/:courseId/:quizId
// @desc     Mark quiz as completed
// @access   Private
router.post('/quiz/:courseId/:quizId', auth, async (req, res) => {
    try {
        let progress = await Progress.findOne({ user: req.user.id, course: req.params.courseId });

        if (!progress) {
            progress = new Progress({
                user: req.user.id,
                course: req.params.courseId,
                completedQuizzes: []
            });
        }

        if (progress.completedQuizzes.some(q => q.quiz.toString() === req.params.quizId)) {
            return res.json(progress);
        }

        progress.completedQuizzes.unshift({ quiz: req.params.quizId, score: req.body.score || 100 });
        await progress.save();
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
