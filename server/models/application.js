const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resume: { type: String, required: true }, // Path to the resume file
  year: { type: String, required: true },
  branch: { type: String, required: true },

});

module.exports = mongoose.model('Application', applicationSchema);
