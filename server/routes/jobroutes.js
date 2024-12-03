const express = require('express');
const { postJob, getAllJobs, getJobById } = require('../controllers/jobcontrol');
const { verifyToken, authorizeRole } = require('../middleware/middleware');
const router = express.Router();

// POST route to create a job
router.post('/', verifyToken, authorizeRole('employer'), postJob);

// GET route to fetch all jobs
router.get('/', getAllJobs);

//GET route to fetch specific job
router.get('/:jobId', getJobById);


module.exports = router;
