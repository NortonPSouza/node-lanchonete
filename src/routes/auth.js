const express = require('express');
const router = express.Router();
const Auth = require('../controller/auth');

router.post('/token', Auth.login);

module.exports = app => app.use('/auth/v1', router);