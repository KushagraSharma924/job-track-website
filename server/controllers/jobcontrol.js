const Job = require('../models/job');

exports.postJob = async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Only employers can post jobs' });
  }

  const job = new Job({ ...req.body, postedBy: req.user.id, companyEmail: req.user.email });
  await job.save();
  res.status(201).json(job);
};
