const MySQL = require('../database/mysql');
const Crypt = require('../services/crypt');
const jwt = require('jsonwebtoken');
class AuthModel {

    static login(email, password) {
        return new Promise((resolve, reject) => {
            const _password = Crypt.encrypt(password);

            const loginQuery = `
                SELECT id, email, password, id_user
                FROM login AS l
                WHERE l.email='${email}' AND l.password='${_password}';
            `;
            MySQL.query(loginQuery, (err, resultLogin) => {
                if (err) return reject({ status_code: 500, result: err });
                if (!resultLogin.length) return reject({ status_code: 401, result: "Email or password is invalid" });

                const id = resultLogin[0].id_user;
                const access_token = jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: '1h' });
                //TODO
                //rever token cadastrado duplicado para o diferentes usuarios
                const registerAccessToken = `
                    UPDATE token SET 
                    access_token='${access_token}', expires_in='${3600}' WHERE id_user='${id}';
                `;
                MySQL.query(registerAccessToken, (err, resultToken) => {
                    if (err) return reject({ status_code: 500, result: err });

                    const userQuery = `
                        SELECT id_user, name, expires_in, access_token
                        FROM token AS t
                        INNER JOIN user AS u ON u.id = t.id_user
                    `;
                    MySQL.query(userQuery, (err, resultUser) => {
                        if (err) return reject({ status_code: 500, result: err });
                        resolve({ status_code: 201, result: resultUser[0] });
                    });

                });
            });
        });
    }
}

module.exports = AuthModel;