 const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendIssueEmail = async (email, bookTitle, userName) => {
  try {
    const mailOptions = {
      from: `"Racing Books Library" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Book Issued Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Racing Books Library</h2>
          <p>Dear ${userName},</p>
          <p>You have successfully issued the book:</p>
          <h3 style="color: #e74c3c;">${bookTitle}</h3>
          <p>Please return it within 14 days.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p>Happy Reading!</p>
            <p>The Racing Books Team</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email sending error:', err.message);
    throw new Error('Failed to send email');
  }
};

module.exports = { sendIssueEmail };