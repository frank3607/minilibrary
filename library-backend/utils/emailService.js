 const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendIssueEmail = async (email, bookTitle, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '📖 Book Issued Successfully',
    html: `
      <h2>Hello ${userName},</h2>
      <p>You have successfully issued the book: <strong>${bookTitle}</strong>.</p>
      <p>Please return it within 14 days.</p>
      <p>Happy Reading! 📚</p>
    `
  };
  await transporter.sendMail(mailOptions);
};

const sendReturnEmail = async (email, bookTitle, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '📦 Book Returned Successfully',
    html: `
      <h2>Hello ${userName},</h2>
      <p>We have received your returned book: <strong>${bookTitle}</strong>.</p>
      <p>Thank you for using Racing Books Library!</p>
    `
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendIssueEmail, sendReturnEmail };
