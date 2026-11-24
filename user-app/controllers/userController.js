
const User = require('../models/user');

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'User profile retrieved successfully',
            user: {
                id: user._id,
                email: user.email,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error('Get Profile Error:', error);

        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getUserProfile
};
