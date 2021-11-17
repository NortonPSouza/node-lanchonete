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
                if (result.length) {
                    return res.status(409).send({ error: { description: "Email or cpf Already Exist" } });
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

                MySQL.query(registerUser, (err, result) => {
                    if (err) return res.status(400).send({ err });
                    return res.status(201).send({ success: { description: 'User created successfully' } });
                });
            })
            .catch(err => res.send({ err }))
    }

    static List(req, res) {
        const listUsers = "SELECT * FROM lanchonete.user";
        MySQL.query(listUsers, (err, results) => {
            if (err) return res.status(400).send({ err });
            if (results.length) {
                const users = results.map(item => {
                    delete item.cpf;
                    delete item.password;
                    return { ...item, email: Crypt.descrypt(item.email) }
                });
                return res.status(200).send(users);
            }
            else return res.status(404).send({ error: { description: 'Not Found' } })
        });
    }

    static ListUser(req, res) {
        if (!req.params.id) return res.status(400).send({ error: { description: 'ID invalid' } });
        const listUsers = `SELECT * FROM lanchonete.user WHERE id_user='${req.params.id}'`;
        MySQL.query(listUsers, (err, results) => {
            if (err) return res.status(400).send({ err });
            if (results.length) {
                const user = results.map(item => {
                    delete item.cpf;
                    delete item.password;
                    return { ...item, email: Crypt.descrypt(item.email) }
                });
                return res.status(200).send(user);
            }
            else return res.status(404).send({ error: { description: 'Not Found' } });
        });
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

    static DeleteUser(req, res) {
        if (!req.params.id) return res.status(400).send({ error: { description: 'ID invalid' } });
        let email = '';
        const user = `SELECT email FROM lanchonete.user WHERE id_user='${req.params.id}'`;
        const deleteUser = `DELETE FROM  lanchonete.user WHERE id_user='${req.params.id}'`;

        MySQL.query(user, (err, results) => results.map(item => email = item.email));

        MySQL.query(deleteUser, (err, result) => {
            if (err) return res.status(400).send({ err });
            if (result.affectedRows) {
                const delelteLogin = `DELETE FROM  lanchonete.login WHERE email='${email}'`;
                MySQL.query(delelteLogin, (err, result) =>
                    res.status(201).send({ success: { description: 'User deleted successfully' } })
                );
    }
            else return res.status(404).send({ error: { description: 'Not Found' } });
        });
    }
}

module.exports = Users;