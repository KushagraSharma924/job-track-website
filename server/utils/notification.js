const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendApplicationEmail = async (companyEmail, applicant, job) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: companyEmail,
    subject: `New Application for ${job.title}`,
    text: `You have a new application from ${applicant.name} (${applicant.email}). Resume: ${applicant.resumeUrl}`,
  };

  await transporter.sendMail(mailOptions);
};
