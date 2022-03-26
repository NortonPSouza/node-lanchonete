const MySQL = require('../database/mysql');
const Crypt = require('../services/crypt');
const jwt = require('jsonwebtoken');


class AuthModel {

    static login(email, password) {
        new Promise((resolve, reject) => {
            const _email = Crypt.encrypt(email);
            const _password = Crypt.encrypt(password);

            const loginQuery = `SELECT * FROM lanchonete.login WHERE password='${_password}' AND email='${_email}';`;
            MySQL.query(loginQuery, (err, result) => {
                if (err) reject({ status_code: 500, result: null });
                if (result.length) {
                    const id = result[0].id_login;
                    const expires_in = 3600;
                    const access_token = jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: '1h' });

                    const registerToken = `UPDATE lanchonete.login SET access_token='${access_token}', expires_in='${expires_in}' WHERE id_login='${id}';`;
                    MySQL.query(registerToken, (err, result) => {
                        if (err) reject({ status_code: 500, result: null });
                        return resolve({ status_code: 200, result: { token: access_token, expires_in: expires_in } });
                    });
                } else return reject({ status_code: 400, result: "Email or password invalid" });
            });
        });
    }

}

module.exports = AuthModel;