const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const sendEmail = require('../emailService');

router.post('/', async (req, res) => {
    try {
        const { name, email, message, service, location } = req.body;

        // 1. Save to MongoDB
        const newContact = await Contact.create({ 
            name, 
            email, 
            message, 
            service, 
            location 
        });

        // 2. Prepare the email data
        const emailData = { name, service, location, message };

        // 3. Send email to the Customer
        await sendEmail(email, "Booking Confirmation - Car Zone", emailData);

        // 4. Send notification to the Business
        // This is sent specifically to your flowstatedesign address
        await sendEmail('flowstatedesign26@gmail.com', "New Booking Request Received", emailData);

        res.status(200).json({ success: true, message: "Emails sent successfully" });
    } catch (error) {
        console.error("Error processing booking:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
});
module.exports = router;