const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');

// @route    POST api/quizzes/:courseId
// @desc     Create a quiz for a course
// @access   Private (Instructor only)
router.post('/', [auth, checkRole(['instructor'])], async (req, res) => {
    try {
        const { title, course, questions } = req.body;

        // Check if course exists and user is the instructor
        const courseData = await Course.findById(course);
        if (!courseData) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        const newQuiz = new Quiz({
            title,
            course,
            questions,
            instructor: req.user.id
        });

        const quiz = await newQuiz.save();
        res.json(quiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route    GET api/quizzes/course/:courseId
// @desc     Get all quizzes for a course
// @access   Private (Enrolled students or Instructor)
router.get('/course/:courseId', auth, async (req, res) => {
    try {
        const quizzes = await Quiz.find({ course: req.params.courseId });
        res.json(quizzes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
