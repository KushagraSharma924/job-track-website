const express = require('express');
const { postJob, getAllJobs } = require('../controllers/jobcontrol');
const { verifyToken, authorizeRole } = require('../middleware/middleware');
const router = express.Router();

// POST route to create a job
router.post('/', verifyToken, authorizeRole('employer'), postJob);

// GET route to fetch all jobs
router.get('/', getAllJobs);

module.exports = router;
