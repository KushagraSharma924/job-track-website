const nodemailer = require('nodemailer');
const Application = require('../models/application');
const Job = require('../models/job');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, '/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Name the file with a timestamp
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single('resume'); // Single file upload for 'resume' field

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Handle application submission
exports.handleApplication = (req, res) => {
  const jobId = req.query.jobId;
  console.log('Job ID:', jobId);

  if (!jobId) {
    return res.status(400).json({ error: 'Job ID is required in the query parameters.' });
  }

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: 'File upload failed.', details: err.message });
    } else if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'Unknown error during file upload.', details: err.message });
    }

    try {
      const { name, email, year, branch } = req.body;

      if (!name || !email || !year || !branch) {
        return res.status(400).json({ error: 'Name, email, year, and branch are required fields.' });
      }

      const resumePath = req.file ? req.file.path : null;

      if (!resumePath) {
        return res.status(400).json({ error: 'Resume file is required.' });
      }

      // Save application to the database
      const application = new Application({
        name,
        email,
        jobId,
        year,
        branch,
        resume: resumePath,
      });

      const savedApplication = await application.save();

      // Fetch the company details from the Job model
      const job = await Job.findById(jobId);  // No need to populate('company')
const companyEmail = job.companyEmail;  // Access the email directly from the Job model

if (!companyEmail) {
  return res.status(500).json({ error: 'Company email not found.' });
}

      // Send email with application details and resume
      const mailOptions = {
        from: email, // Use applicant's email as the sender
        to: companyEmail, // Send email to the company's email
        subject: `New Job Application for ${savedApplication.jobId}`,
        text: `
          New application submitted:
          Name: ${savedApplication.name}
          Email: ${savedApplication.email}
          Year: ${savedApplication.year}
          Branch: ${savedApplication.branch}
          Job ID: ${savedApplication.jobId}
        `,
        attachments: [
          {
            filename: req.file.originalname,
            path: req.file.path,
          },
        ],
      };

      transporter.sendMail(mailOptions, (emailError, info) => {
        if (emailError) {
          console.error('Email error:', emailError);
          return res.status(500).json({ error: 'Failed to send application email.' });
        }
        console.log('Email sent:', info.response);
      });

      return res.status(200).json({ message: 'Application submitted successfully!' });

    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Failed to process application.', details: err.message });
    }
  });
};

// Retrieve all applications
exports.getApplication = async (req, res) => {
  try {
    if (req.user.role !== 'employer') { // Example role check
      return res.status(403).json({ error: 'Access denied' });
    }
    const applications = await Application.find();
    res.status(200).json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve applications.' });
  }
};

// Export applications to Excel
exports.exportApplicationsToExcel = async (req, res) => {
  try {
    if (req.user.role !== 'employer' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const applications = await Application.find().populate('jobId', 'title company');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Job Title', key: 'jobTitle', width: 30 },
      { header: 'Company', key: 'company', width: 25 },
      { header: 'Year', key: 'year', width: 15 },
      { header: 'Branch', key: 'branch', width: 25 },
    ];

    applications.forEach((app) => {
      worksheet.addRow({
        name: app.name,
        email: app.email,
        jobTitle: app.jobId?.title || 'N/A',
        company: app.jobId?.company || 'N/A',
        year: app.year || 'N/A',
        branch: app.branch || 'N/A',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting applications:', err);
    res.status(500).json({ error: 'Failed to export applications to Excel.' });
  }
};
