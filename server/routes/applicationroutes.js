const express = require('express');
const router = express.Router();
const { handleApplication } = require('../controllers/applicationcontrol');
const { verifyToken, authorizeRole } = require('../middleware/middleware');

router.post('/', verifyToken, authorizeRole('jobSeeker'), handleApplication);

module.exports = router;
