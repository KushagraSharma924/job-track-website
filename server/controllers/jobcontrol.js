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
    const job = new Job({ ...req.body, postedBy: req.user.id, companyEmail: req.user.email });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post job' });
  }
};
