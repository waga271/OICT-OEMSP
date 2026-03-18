const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route    PUT api/users/profile
// @desc     Update user profile
// @access   Private
router.put('/profile', auth, async (req, res) => {
    const { name, email, password } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // If password is being updated
        if (password) {
            const salt = await bcrypt.genSalt(10);
            profileFields.password = await bcrypt.hash(password, salt);
        }

        // Check if email already exists (if changing email)
        if (email && email !== user.email) {
            let emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ msg: 'Email already in use' });
            }
        }

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
