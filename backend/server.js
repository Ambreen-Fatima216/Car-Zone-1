const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
// It will prioritize the MONGO_URI in your Render settings
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://ambreen2007216_db_user:AmbreenCarZone@bookingform.92vn541.mongodb.net/?appName=bookingform';

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Database error:", err));

// Routes
// This means your URL will be: https://car-zone-live.onrender.com/api/contact
app.use('/api/contact', require('./routes/contact'));

// Root route to stop the "Cannot GET /" message
app.get('/', (req, res) => {
    res.send('Car Zone Backend is officially live and running!');
});

// FIX: Render assigns a port automatically, so we must use process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});