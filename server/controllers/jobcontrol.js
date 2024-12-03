const Job = require('../models/job');

/////
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

//////
exports.postJob = async (req, res) => {
  // Ensure only employers can post jobs
  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Only employers can post jobs' });
  }

  try {
    const {
      title,
      description,
      location,
      salary,
      jobType,
      requirements,
      companyEmail,
      company,
    } = req.body;

    // Use the email from request body if provided, otherwise fallback to user's email
    const emailToUse = companyEmail || req.user.email;

    // Create a new job with all required fields
    const job = new Job({
      title,
      description,
      location,
      salary,
      jobType,
      requirements,
      postedBy: req.user.id,
      companyEmail: emailToUse,
      company,
    });

    // Save the job to the database
    await job.save();

    res.status(201).json(job);
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ error: 'Failed to post job' });
  }
};

//////
exports.getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};

