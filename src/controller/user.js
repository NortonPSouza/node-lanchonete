const User = require('../model/user');
const MySQL = require('../database/mysql');
const Crypt = require('../utils/crypt');

class Users {

    constructor(app) {
        this._app = app;
    }

    static Register(req, res) {
        const { cpf, full_name, email, password, phone_number } = req.body;

        if (!(cpf && full_name && email && password && phone_number)) {
            return res.status(400).send({ error: { description: "All input is required" } });
        }

        const _cpf = Crypt.encrypt(cpf);
        const _email = Crypt.encrypt(email);
        const _password = Crypt.encrypt(password);

        new Promise((resolve, reject) => {
            const isUser = `SELECT cpf,email FROM lanchonete.user WHERE cpf='${_cpf}' AND email='${_email}';`;
            MySQL.query(isUser, (err, result) => {
                if (err) return res.status(500).send({ err });
                if (result.length > 0) {
                    return res.status(409).send({ error: { description: "User Already Exist" } });
                }
                resolve();
            });
        })
            .then(() => {
                const registerLogin = `INSERT INTO lanchonete.login (email, password) VALUES ('${_email}', '${_password}');`;
                MySQL.query(registerLogin, (err, results) => {
                    if (err) return res.status(500).send({ err });
                });
            })
            .then(() => {
                const registerUser = `INSERT INTO lanchonete.user (cpf, full_name, email, password, phone_number) VALUES ('${_cpf}', '${full_name}', '${_email}', '${_password}', '${phone_number}');`;

                MySQL.query(registerUser, (err, results) => {
                    if (err) return res.status(400).send({ err });
                    return res.status(201).send({ success: { description: 'User created successfully' } });
                });
            })
            .catch(err => res.send({ err }))
    }

    static async List(req, res) {
        User.find({}, (err, users) => {
            if (err) throw err;
            if (users.length == 0) return res.status(404).send({ error: { description: 'User Not Found' } });
            return res.status(200).json(users);
        });
    }

    static async ListUser(req, res) {
        User.findById(req.params.id, (err, user) => {
            if (err || !user) return res.status(404).send({ error: { description: 'User Not Found' } });
            return res.status(200).json(user);
        });
    }

    static DeleteUser(req, res) {
        try {
            User.deleteOne({ _id: req.params.id })
                .then(resp => { if (resp.ok) return res.status(200).send('User deleted successfully') })
                .catch(err => { return res.send(err) })
        }
        catch (err) {
            return res.status(404).send({ error: { description: 'User Not Found' } });
        }
    }

    static UpdateUser(req, res) {
        if (!req.body.name || !req.body.email || !req.body.password)
            res.status(400).send({ error: { status: 'Param invalid' } });
        else {
            User.findOneAndUpdate({ _id: req.params.id }, req.body, (err, data) => {
                if (err) res.send(err);
                data.modifyAt = new Date();
                return res.status(200).send('User updated successfully');
            });
        }
    }

    static UpdatePassword(req, res) {
        if (!req.body.password)
            res.status(400).send({ error: { status: 'Param invalid' } });
        else {
            User.findOneAndUpdate({ _id: req.params.id }, req.body.password, (err, data) => {
                if (err) res.send(err);
                res.send(data);
            });
        }
    }
}

module.exports = Users;