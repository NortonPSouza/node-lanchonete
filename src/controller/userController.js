const UserModel = require('../model/userModel')

class UserController {

    constructor(app) {
        this._app = app;
    }

    static register(req, res) {
        const { cpf, full_name, email, password, phone_number } = req.body;

        if (!(cpf && full_name && email && password && phone_number)) {
            return res.status(400).send("All input is required");
        }

        UserModel.register(cpf, full_name, email, password, phone_number)
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
        const { full_name, email, password, phone_number } = req.body;

        if (!full_name || !email || !password || !phone_number) {
            return res.status(400).send('Filds are not must empty');
        }

        UserModel.updateUser(req.params.id, full_name, email, password, phone_number)
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
        if (!req.params.id){
            return res.status(400).send('ID invalid');
        } 

        UserModel.deleteUser(req.params.id)
            .then(({ status_code, result }) => res.status(status_code).send(result))
            .catch(({ status_code, result }) => res.status(status_code).send(result))

    }
}

module.exports = UserController;