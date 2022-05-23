const express = require('express');
const router = express.Router();
const Auth = require('../controller/authController');
const UserController = require('../controller/userController');
const Authorization = require('../services/verifyToken');

router
    .post('/auth', Auth.login)
    .post('/user/register', UserController.register)
    .get('/user/list', Authorization, UserController.listAll)
    .get('/user/:id', Authorization, UserController.listOne)
    .delete('/user/delete/:id', Authorization, UserController.deleteUser)
    .put('/user/update/:id', Authorization, UserController.updateUser)
    .patch('/user/update/password/:id', Authorization, UserController.updatePassword)

module.exports = router;