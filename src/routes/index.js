const express = require('express');
const router = express.Router();
const Authorization = require('../services/verifyToken')
const Auth = require('../controller/auth');

router
    .post('/auth', Auth.Login)

module.exports = router;