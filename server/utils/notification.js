const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendApplicationEmail = async (companyEmail, applicant, job) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: companyEmail,
      subject: `New Application for ${job.title}`,
      text: `You have a new application from ${applicant.name} (${applicant.email}).`,
      attachments: [
        {
          filename: applicant.resume.name, 
          content: fs.createReadStream(path.join(__dirname, 'uploads', applicant.resume.name)), 
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Application email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
