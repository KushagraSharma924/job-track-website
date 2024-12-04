const express = require('express');
const router = express.Router();
const { handleApplication, getApplication, exportApplicationsToExcel } = require('../controllers/applicationcontrol');
const { verifyToken, authorizeRole } = require('../middleware/middleware');

router.post('/', verifyToken, authorizeRole('jobSeeker'), handleApplication);
router.get('/application', verifyToken, authorizeRole('employer'), getApplication);
router.get('/export', verifyToken, exportApplicationsToExcel);


module.exports = router;
