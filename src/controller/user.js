const User = require('../model/user');
const bcryptjs = require('bcryptjs');
const MySQL = require('../database/mysql');

class Users {

    constructor(app) {
        this._app = app;
    }

    static async Register(req, res) {
        const { cpf, full_name, email, password, phone_number } = req.body;

        if (!(cpf && full_name && email && password && phone_number)) {
            return res.status(400).send("All input is required");
        }

        const isUser = `SELECT cpf, email FROM lanchonete.user WHERE email = '${await bcryptjs.hash(email, 10)}' AND cpf = '${await bcryptjs.hash(cpf, 10)}';`;

        new Promise((resolve, reject) => {
            MySQL.query(isUser, (err, result) => {
                if (err) {
                    res.status(500);
                    throw err;
                }
                if (result.length > 0) return res.status(409).send("User Already Exist.");
                resolve();
            })
        }).then(async () => {
            const _cpf = await bcryptjs.hash(cpf, 10);
            const _email = await bcryptjs.hash(email, 10);
            const _password = await bcryptjs.hash(password, 10);

            //to do: criar um login pra inserir na tabela e depois crirar um usuario

            const registerUser = `INSERT INTO lanchonete.user (cpf, full_name, email, password, phone_number) VALUES ('${_cpf}', '${full_name}', '${_email}', '${_password}', '${phone_number}');`;
            MySQL.query(registerUser, (err, results) => {
                if (err) return res.status(400).send({ err });
                return res.status(201).send({ success: `sucesso ao criar usuario de login`, status: results });
            });
        });
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