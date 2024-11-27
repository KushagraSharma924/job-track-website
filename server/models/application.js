const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resumeUrl: String,
});

module.exports = mongoose.model('Application', applicationSchema);
