const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Mentoringminds" <${process.env.SMTP_EMAIL}>`, 
            to: options.email,
            subject: options.subject,
            html: options.html, 
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to: ${options.email} (Message ID: ${info.messageId})`);
        
    } catch (error) {
        console.error("❌ Email sending failed. Detail error:", error.message);
        throw new Error("Could not send email.");
    }
};

module.exports = sendEmail;

