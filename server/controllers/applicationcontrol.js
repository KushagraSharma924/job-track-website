const Application = require('../models/application');
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

// Handle application submission
exports.handleApplication = (req, res) => {
  // Log the received jobId
  const jobId = req.query.jobId;
  console.log('Job ID:', jobId);

  // Check if jobId is missing
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

    // Log request body and file info
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    try {
      const { name, email } = req.body;

      // Validate input fields
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
      res.status(201).json({
        message: 'Application submitted successfully.',
        application: savedApplication,
      });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Failed to save application.', details: err.message });
    }
  });
};
