const User = require('../models/User');

module.exports = function(roles) {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({ msg: `Access denied. Role ${user.role} does not have permission.` });
            }

            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server error' });
        }
    };
};
