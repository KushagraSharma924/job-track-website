const express = require('express');
const { postJob, getAllJobs, getJobById } = require('../controllers/jobcontrol');
const { verifyToken, authorizeRole } = require('../middleware/middleware');
const router = express.Router();


router.post('/', verifyToken, authorizeRole('employer'), postJob);


router.get('/', getAllJobs);


router.get('/:jobId', getJobById);


module.exports = router;
