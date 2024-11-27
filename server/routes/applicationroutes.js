const express = require('express');
const { applyToJob } = require('../controllers/applicationcontrol');
const { verifyToken, authorizeRole } = require('../middleware/middleware');
const router = express.Router();

router.post('/', verifyToken, authorizeRole('jobSeeker'), applyToJob);

module.exports = router;
