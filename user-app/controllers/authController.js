
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const cloudinary = require('../config/cloudinary');

// Register User
const registerUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            dateOfBirth,
            gender
        } = req.body;

        // Validate required fields
        if (
            !firstName?.trim() ||
            !lastName?.trim() ||
            !email ||
            !password ||
            !phone ||
            !dateOfBirth ||
            !gender
        ) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        // Check existing email or phone
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase().trim() },
                { phone: phone.trim() }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email or phone already exists'
            });
        }

        // Upload profile image to Cloudinary
        let profileImageUrl = '';

        if (req.file) {
            const result = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
                {
                    folder: 'user-profiles'
                }
            );

            profileImageUrl = result.secure_url;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            phone: phone.trim(),
            dateOfBirth,
            gender,
            profileImage: profileImageUrl
        });

        await newUser.save();

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
                dateOfBirth: newUser.dateOfBirth,
                gender: newUser.gender,
                profileImage: newUser.profileImage
            }
        });

    } catch (error) {
        console.error('Register Error:', error);

        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};


// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error('Login Error:', error);

        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};


module.exports = {
    registerUser,
    loginUser
};
