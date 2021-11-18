const MySQL = require('../database/mysql');
const Crypt = require('../utils/crypt');
const jwt = require('jsonwebtoken');

class Auth {

    constructor(app) {
        this._app = app;
    }

    static login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send({ error: { description: "All input is required" } });

        const _email = Crypt.encrypt(email);
        const _password = Crypt.encrypt(password);

        const isLogin = `SELECT * FROM lanchonete.login WHERE password='${_password}' AND email='${_email}';`;
        MySQL.query(isLogin, (err, result) => {
            if (err) return res.status(500).send({ err });
            if (result.length) {
                const id = result[0].id_login;
                const expires_in = 3600;
                const access_token = jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: '1h' });

                const registerToken = `UPDATE lanchonete.login SET access_token='${access_token}', expires_in='${expires_in}' WHERE id_login='${id}';`;
                MySQL.query(registerToken, (err, result) => {
                    if (err) return res.status(500).send({ err });
                    return res.status(200).json({ token: access_token, expires_in: expires_in });
                });
            } else return res.status(400).send({ error: { description: "Email or password invalid" } });
        });
    }
}

module.exports = Auth;