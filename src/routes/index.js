const express = require('express');
const router = express.Router();
const Auth = require('../controller/authController');
const UserController = require('../controller/userController');
const Authorization = require('../services/middleware');

router
    .post('/auth', Auth.login)
    .post('/user', UserController.register)
    .get('/user', Authorization, UserController.listAll)
    .get('/user/:id', Authorization, UserController.listOne)
    .delete('/user/:id', Authorization, UserController.deleteUser)
    .put('/user/:id', Authorization, UserController.updateUser)
    .patch('/user/:id', Authorization, UserController.updatePassword)

module.exports = router;