const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  salary: Number,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyEmail: String,
});

module.exports = mongoose.model('Job', jobSchema);
