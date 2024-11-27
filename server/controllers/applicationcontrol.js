const Application = require('../models/application');
const Job = require('../models/job');
const { sendApplicationEmail } = require('../utils/notification');

exports.applyToJob = async (req, res) => {
  const { jobId, resumeUrl } = req.body;
  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const application = new Application({ job: jobId, applicant: req.user.id, resumeUrl });
  await application.save();

  await sendApplicationEmail(job.companyEmail, req.user, job);
  res.status(201).json({ message: 'Application submitted' });
};
