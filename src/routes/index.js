const express = require('express');
const router = express.Router();
const Auth = require('../controller/auth');
const Users = require('../controller/user');
const Authorization = require('../services/verifyToken');

router
    .post('/auth', Auth.login)
    .post('/user/register', Users.register)
    .get('/user/list', Authorization, Users.list)
    .get('/user/:id', Authorization, Users.user)
    .delete('/user/:id', Authorization, Users.deleteUser)
    .put('/user/update/:id', Authorization, Users.updateUser)
    .patch('/user/update/password/:id', Authorization, Users.updatePassword)

module.exports = router;