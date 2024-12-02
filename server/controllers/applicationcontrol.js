const nodemailer = require('nodemailer');
const Application = require('../models/application');
const Job = require('../models/job')
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required fields.' });
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
        resume: resumePath,
      });

      const savedApplication = await application.save();

      const job = await Job.findById(jobId); // Await to ensure the job is retrieved
      
      if (!job) {
        return res.status(404).json({ error: 'Job not found.' });
      }

      const employerEmail = job.companyEmail; // Access the employer's email from the job document
      
      if (!employerEmail) {
        return res.status(400).json({ error: 'Employer email not found for the job.' });
      }
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: employerEmail,
        subject: `New Application for Job ID: ${jobId}`,
        text: `You have received a new application.\n\nName: ${name}\nEmail: ${email}`,
        attachments: [
          {
            filename: req.file.originalname,
            path: resumePath,
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({
        message: 'Application submitted successfully and notification sent to employer.',
        application: savedApplication,
      });
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
