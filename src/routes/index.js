const express = require('express');
const router = express.Router();
const Auth = require('../controller/auth');
const Users = require('../controller/user');
const Authorization = require('../services/verifyToken');

router
    .post('/auth', Auth.Login)
    .post('/user/register', Users.Register)
    .get('/user/list', Authorization, Users.List)
    .get('/user/:id', Authorization, Users.ListUser)
    .delete('/user/:id', Authorization, Users.DeleteUser)
    .put('/user/update/:id', Authorization, Users.UpdateUser)
    .patch('/user/update/password/:id', Authorization, Users.UpdatePassword)

module.exports = router;