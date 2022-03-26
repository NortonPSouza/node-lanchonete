const UserModel = require('../model/userModel')

class UserController {

    constructor(app) {
        this._app = app;
    }

    static register(req, res) {
        const { cpf, full_name, email, password, phone_number } = req.body;

        if (!(cpf && full_name && email && password && phone_number)) {
            return res.status(400).send({ error: { description: "All input is required" } });
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
        if (!req.params.id) return res.status(400).send('ID invalid');
        UserModel.listOne(req.params.id)
            .then(({ status_code, result }) => res.status(status_code).send(result))
            .catch(({ status_code, result }) => res.status(status_code).send(result))
    }

    static updateUser(req, res) {
        const { id } = req.params;
        const { full_name, email, password, phone_number } = req.body;

        if (!full_name || !email || !password || !phone_number)
            res.status(400).send({ error: { status: 'Param invalid' } });
        else {
            const _email = Crypt.encrypt(email);
            const _password = Crypt.encrypt(password);

            const emailExist = `SELECT email lanchonete.user WHERE email = '${_email}';`;
            MySQL.query(emailExist, (err, result) => {
                if (err) return res.status(400).send({ err });
                if (!result.length) {
                    const updateUser = `UPDATE lanchonete.user SET full_name='${full_name}', email='${_email}', password='${_password}' WHERE id_user=${id};`;
                    MySQL.query(updateUser, (err, result) => {
                        if (err) return res.status(400).send({ err });
                        if (result.affectedRows) return res.status(200).send({ success: { description: 'User updated successfully' } });
                    });
                };
            });
        }
    }

    static updatePassword(req, res) {
        const { id } = req.params;
        const { password } = req.body;

        if (!password)
            res.status(400).send({ error: { status: 'Param invalid' } });
        else {
            const _password = Crypt.encrypt(password);

            const updatePassword = `UPDATE lanchonete.user SET password='${_password}' WHERE id_user=${id};`
            MySQL.query(updatePassword, (err, result) => {
                if (err)
                    return res.status(400).send({ err });
                if (result.affectedRows)
                    return res.status(200).send({ success: { description: 'Password updated successfully' } });
            });
        }
    }

    static deleteUser(req, res) {
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

module.exports = UserController;