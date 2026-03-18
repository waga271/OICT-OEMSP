const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');
const Course = require('../models/Course');
const User = require('../models/User');

// @route    POST api/courses
// @desc     Create a course
// @access   Private (Instructor only)
router.post('/', [auth, checkRole(['instructor'])], async (req, res) => {
    try {
        const { title, description, price, category, tags } = req.body;

        const newCourse = new Course({
            title,
            description,
            price,
            category,
            tags,
            instructor: req.user.id
        });

        const course = await newCourse.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route    GET api/courses
// @desc     Get all courses (with optional search and category filters)
// @access   Public
router.get('/', async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        const courses = await Course.find(query).populate('instructor', ['name']);
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route    GET api/courses/:id
// @desc     Get course by ID
// @access   Public
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name email');

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        res.json(course);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route    POST api/courses/enroll/:id
// @desc     Enroll in a course
// @access   Private
router.post('/enroll/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if user is already enrolled
        if (course.students.some(student => student.user.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'Already enrolled' });
        }

        course.students.unshift({ user: req.user.id });
        await course.save();

        res.json(course.students);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route    GET api/courses/instructor/analytics
// @desc     Get analytics for instructor's courses
// @access   Private (Instructor only)
router.get('/instructor/analytics', [auth, checkRole(['instructor'])], async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id }).populate('students.user', ['name', 'email']);
        
        const analytics = await Promise.all(courses.map(async (course) => {
            const Progress = require('../models/Progress');
            const Lesson = require('../models/Lesson');
            
            const totalLessons = await Lesson.countDocuments({ course: course._id });
            const studentProgress = await Progress.find({ course: course._id });
            
            let totalCompletion = 0;
            const studentDetails = course.students.map(s => {
                const prog = studentProgress.find(p => p.user.toString() === s.user._id.toString());
                const completedCount = prog?.completedLessons?.length || 0;
                const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
                totalCompletion += percent;
                
                return {
                    name: s.user.name,
                    email: s.user.email,
                    progress: percent,
                    enrolledAt: s.date
                };
            });

            const avgProgress = course.students.length > 0 ? Math.round(totalCompletion / course.students.length) : 0;

            return {
                courseId: course._id,
                title: course.title,
                studentCount: course.students.length,
                avgProgress: avgProgress,
                students: studentDetails
            };
        }));

        res.json(analytics);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
