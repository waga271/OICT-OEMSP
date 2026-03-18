const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    completedLessons: [
        {
            lesson: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'lesson'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    completedQuizzes: [
        {
            quiz: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'quiz'
            },
            score: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

// Ensure unique progress entry per user per course
ProgressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('progress', ProgressSchema);
