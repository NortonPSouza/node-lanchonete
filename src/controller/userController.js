const { is } = require('express/lib/request');
const UserModel = require('../model/userModel');
const UserValidate = require('../validate/userValidate');

class UserController {

    constructor(app) {
        this._app = app;
    }

    static register(req, res) {
        const { cpf, name, email, password, phone } = req.body;
        const isCPF = UserValidate.isCPF(cpf);
        const isName = UserValidate.isName(name);
        const isEmail = UserValidate.isEmail(email);
        const isPhone = UserValidate.isPhone(phone);
        const isPassword = UserValidate.isPassword(password)

        if (isCPF.err || isName.err || isEmail.err || isPhone.err || isPassword?.err ) {
            return res.status(400).send({
                cpf: isCPF?.err,
                email: isEmail?.err,
                name: isName?.err,
                phone: isPhone?.err,
                password: isPassword?.err            
            });
        }

        UserModel.register(cpf, name, email, password, phone)
            .then(({ status_code, result }) => res.status(status_code).send(result))
            .catch(({ status_code, result }) => res.status(status_code).send(result))
    }

    static listAll(req, res) {
        UserModel.listAll()
            .then(({ status_code, result }) => res.status(status_code).json(result))
            .catch(({ status_code, result }) => res.status(status_code).send(result))
    }

    static listOne(req, res) {
        if (!req.params.id) {
            return res.status(400).send('ID invalid');
        }

        UserModel.listOne(req.params.id)
            .then(({ status_code, result }) => res.status(status_code).send(result))
            .catch(({ status_code, result }) => res.status(status_code).send(result))
    }

    static updateUser(req, res) {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).send('Filds are not must empty');
        }

        UserModel.updateUser(req.params.id, name, email, password, phone)
            .then(({ status_code, result }) => res.status(status_code).send(result))
            .catch(({ status_code, result }) => res.status(status_code).send(result))
    }

    static updatePassword(req, res) {
        if (!req.body.password) {
            return res.status(400).send('Param invalid');
        }

        UserModel.updatePassword(req.params.id, req.body.password)
            .then(({ status_code, result }) => res.status(status_code).send(result))
            .catch(({ status_code, result }) => res.status(status_code).send(result))

    }

    static deleteUser(req, res) {
        if (!req.params.id) {
            return res.status(400).send('ID invalid');
        }

        UserModel.deleteUser(req.params.id)
            .then(({ status_code, result }) => res.status(status_code).send(result))
            .catch(({ status_code, result }) => res.status(status_code).send(result))

    }
}

module.exports = UserController;