const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
// CHANGE THIS LINE to use curly braces:
const { sendEmail, sendInternalNotification } = require('../emailService');

router.post('/', async (req, res) => {
    try {
        const { name, email, message, service, location } = req.body;

        // 1. Save to MongoDB
        await Contact.create({ name, email, message, service, location });

        // 2. Send both emails
        const emailData = { name, email, service, location, message };
        
        await sendEmail(email, "Booking Confirmation - Car Zone", emailData);
        await sendInternalNotification(emailData);

        res.status(200).json({ success: true, message: "Request processed!" });
    } catch (error) {
        console.error("Route error:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
});

module.exports = router;