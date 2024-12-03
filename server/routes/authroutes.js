const express = require('express');
const { register, login, getuser } = require('../controllers/authcontrol');
const router = express.Router();
const {verifyToken} = require('../middleware/middleware')

router.post('/register', register);
router.post('/login', login);
router.get('/user',verifyToken, getuser);

module.exports = router;