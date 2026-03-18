const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @route    POST api/lessons/:courseId
// @desc     Add a lesson to a course
// @access   Private (Course Instructor only)
router.post('/:courseId', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if user is the instructor of this course
        if (course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to add lessons to this course' });
        }

        const { title, content, videoUrl, order } = req.body;

        const newLesson = new Lesson({
            course: req.params.courseId,
            title,
            content,
            videoUrl,
            order
        });

        const lesson = await newLesson.save();
        res.json(lesson);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route    GET api/lessons/:courseId
// @desc     Get all lessons for a course
// @access   Private (Enrolled students or Instructor only)
router.get('/:courseId', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if user is enrolled or is the instructor
        const isEnrolled = course.students.some(student => student.user.toString() === req.user.id);
        const isInstructor = course.instructor.toString() === req.user.id;

        if (!isEnrolled && !isInstructor) {
            return res.status(401).json({ msg: 'Unauthorized: You must be enrolled to view lessons' });
        }

        const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
        res.json(lessons);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
