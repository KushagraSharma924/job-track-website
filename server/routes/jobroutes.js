const express = require('express');
const { postJob } = require('../controllers/jobcontrol');
const { verifyToken, authorizeRole } = require('../middleware/middleware');
const router = express.Router();

router.post('/', verifyToken, authorizeRole('employer'), postJob);

module.exports = router;
