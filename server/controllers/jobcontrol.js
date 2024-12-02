const Job = require('../models/job');

// Controller to fetch all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Existing postJob function
exports.postJob = async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Only employers can post jobs' });
  }

  try {
    // Check if companyEmail is in request body, if not, use the email from req.user
    const { title, description, companyEmail } = req.body;
    const emailToUse = companyEmail || req.user.email; // Use companyEmail from body if provided, else use the logged-in user's email

    const job = new Job({
      title,
      description,
      postedBy: req.user.id,
      companyEmail: emailToUse,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post job' });
  }
};

