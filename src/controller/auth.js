const User = require('../model/user');
const MySQL = require('../database/mysql');
const bcryptjs = require('bcryptjs');
const Crypt = require('../utils/crypt');
const jwt = require('jsonwebtoken');

class Auth {

    constructor(app) {
        this._app = app;
    }

    static Login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send({ error: { description: "All input is required" } });

        const _email = Crypt.encrypt(email);
        const _password = Crypt.encrypt(password);

        const isLogin = `SELECT id,email, password FROM lanchonete.login WHERE password='${_password}' AND email='${_email}';`;
        MySQL.query(isLogin, (err, result) => {
            if (err) return res.status(500).send({ err });
            if (result.length > 0) {
                const token = {
                    access_token: jwt.sign({ user_id: result[0].id, _email }, process.env.TOKEN_KEY, { expiresIn: "1h", }),
                    expires_in: 3600
                };

                const registerToken = `INSERT INTO lanchonete.login (token) VALUES ('${token}');`;
                MySQL.query(registerToken, (err, result) => {
                    if (err) return res.status(500).send({ err });
                    return res.status(200).json(result);

                });
            } else return res.status(400).send({ error: { description: "Email or password invalid" } });
        });








        // const user = await User.findOne({ email });

        // if (user) verifyPassword = await bcryptjs.compare(password, user.password);
        // else return res.status(404).send({ error: { description: "User not found" } });

        // if (user && verifyPassword) {
        //     const token = {
        //         access_token: jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, { expiresIn: "1h", }),
        //         expires_in: 3600
        //     };

        //     user.token = token;

        //     return res.status(200).json(user.token);
        // } else {
        //     return res.status(400).send({ error: { description: "Invalid param" } });
        // }
    }
}

module.exports = Auth;