const Express = require('express');
const Router = express.Router();
const Auth = require('../controller/authController');
const UserController = require('../controller/userController');
const tokenAuthorization = require('../middleware/authorization');
const isAdmin = require('../middleware/userPermission');

Router
    .post('/auth', Auth.login)
    .post('/user', UserController.register)
    .get('/user',tokenAuthorization, UserController.listAll)
    .get('/user/:id',tokenAuthorization, UserController.listOne)
    .delete('/user/:id',tokenAuthorization,isAdmin, UserController.deleteUser)
    .put('/user/:id',tokenAuthorization, UserController.updateUser)
    .patch('/user/:id',tokenAuthorization, UserController.updatePassword)

module.exports = Router;