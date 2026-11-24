
const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');
const upload = require('../middleware/upload');

// Register
router.post('/register', upload.single('profileImage'), registerUser);

// Login
router.post('/login', loginUser);

module.exports = router;
