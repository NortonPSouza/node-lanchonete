const UserModel = require('../model/userModel');
const UserValidate = require('../validate/userValidate');

class UserController {

    static register(req, res) {
        const { cpf, name, email, password, phone, type } = req.body;
        const fields = {
            isCPF: UserValidate.isCPF(cpf),
            isName: UserValidate.isName(name),
            isType: UserValidate.isType(type),
            isEmail: UserValidate.isEmail(email),
            isPhone: UserValidate.isPhone(phone),
            isPassword: UserValidate.isPassword(password)
        };

        for (const key in fields) {
            if (fields[key].err) {
                return res.status(400).send({ err: fields[key].err });
            };
        };

        UserModel.register(cpf, name, email, password, phone, type)
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
        const { name, email, password, phone, } = req.body;
        const fields = {
            isName: UserValidate.isName(name),
            isEmail: UserValidate.isEmail(email),
            isPhone: UserValidate.isPhone(phone),
        }

        for (const key in fields) {
            if (fields[key].err) {
                return res.status(400).send({ err: fields[key].err });
            };
        };

        UserModel.updateUser(req.params.id, name, email, password, phone)
            .then(({ status_code, result }) => res.status(status_code).send(result))
            .catch(({ status_code, result }) => res.status(status_code).send(result))
    }

    static updatePassword(req, res) {
       const isPassword = UserValidate.isPassword(req.body.password);

       if(isPassword.err){
           return res.status(400).send({err: isPassword.err})
       };

        UserModel.updatePassword(req.params.id, req.body.password)
            .then(({ status_code, result }) => res.status(status_code).send(result))
            .catch(({ status_code, result }) => res.status(status_code).send(result))
    }

    static deleteUser(req, res) {
        if (!req.params.id) {
            return res.status(400).send('ID invalid');
        };

        UserModel.deleteUser(req.params.id)
            .then(({ status_code, result }) => res.status(status_code).send(result))
            .catch(({ status_code, result }) => res.status(status_code).send(result))
    }
}

module.exports = UserController;