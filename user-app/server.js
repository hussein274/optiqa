
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cloudinary = require('./config/cloudinary');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Home Route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server is working successfully!'
    });
});

// Cloudinary Test Route
app.get('/test-cloudinary', async (req, res) => {
    try {
        const result = await cloudinary.api.ping();

        res.status(200).json({
            message: 'Cloudinary Connected Successfully!',
            status: result.status
        });

    } catch (error) {
        console.error('Cloudinary Error:', error);

        res.status(500).json({
            message: 'Cloudinary Connection Failed',
            error: error.message
        });
    }
});

// Connect to MongoDB
connectDB();

// Start Server
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
