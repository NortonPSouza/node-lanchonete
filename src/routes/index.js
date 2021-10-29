const express = require('express');
const router = express.Router();
const Auth = require('../controller/auth');

router
    .post('/auth', Auth.Login)

module.exports = router;