const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://ambreen2007216_db_user:AmbreenCarZone@bookingform.92vn541.mongodb.net/?appName=bookingform';

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Database error:", err));

// Routes
// Note: Ensure your route file is named correctly
app.use('/api/contact', require('./routes/contact'));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});