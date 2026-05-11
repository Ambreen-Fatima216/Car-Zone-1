const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Required for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, data) => {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3nFjE3Je6p-5t9gOIg_KoyLAls-qTtHDtNw&s" alt="Car Zone Logo" style="width: 200px; margin-bottom: 20px;">
        
        <h2 style="color: #333;">Booking Inquiry Received</h2>
        <p>Dear ${data.name || 'Customer'},</p>
        <p>Thank you for contacting Car Zone. We have received your inquiry for <strong>${data.service}</strong> at our <strong>${data.location}</strong> location.</p>
        
        <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
            <strong>Message:</strong><br>
            <p>${data.message}</p>
        </div>

        <p>A member of our team will review your request and get back to you shortly.</p>
        
        <br>
        <p>Thank you & Best Regards,<br><br>
        <strong>Ahmed Raza</strong><br>
        IT Specialist<br><br>
        <strong>CAR ZONE AUTO MAINT. W. SHOP</strong><br>
        +971 56 997 6489<br>
        +971 6 555 8200<br>
        <a href="mailto:tech@carszone.ae">tech@carszone.ae</a><br>
        <a href="https://www.carszone.ae">www.carszone.ae</a></p>
    </div>
    `;

    try {
        await transporter.sendMail({
            from: `"Car Zone Support" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent 
        });
        console.log("Professional email sent to " + to);
    } catch (error) {
        console.error("Email error:", error);
        throw error; // Let the route know it failed
    }
};

const sendInternalNotification = async (data) => {
    const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 2px solid #333;">
        <h2 style="color: #333; text-transform: uppercase; letter-spacing: 1px;">New Booking Lead</h2>
        <p>A new customer has submitted a booking request.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #000;">
            <p><strong>Client Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Message:</strong><br>${data.message}</p>
        </div>
        
        <p style="font-size: 12px; color: #888; margin-top: 20px;">
            This is an automated notification from your website.
        </p>
    </div>
    `;

    try {
        await transporter.sendMail({
            from: `"Car Zone System" <${process.env.EMAIL_USER}>`,
            to: 'flowstatedesign26@gmail.com', 
            subject: "New Booking Request: " + data.name,
            html: htmlContent
        });
        console.log("Internal notification sent to business");
    } catch (error) {
        console.error("Internal email failed:", error);
        throw error;
    }
};

// EXPORT BOTH FUNCTIONS PROPERLY
module.exports = { sendEmail, sendInternalNotification };