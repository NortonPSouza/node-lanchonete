const MySQL = require('../database/mysql');
const Crypt = require('../services/crypt');
const jwt = require('jsonwebtoken');
class AuthModel {

    static login(email, password) {
        return new Promise((resolve, reject) => {
            const _email = Crypt.encrypt(email);
            const _password = Crypt.encrypt(password);

            const loginQuery = `
                SELECT email, password
                FROM login AS l
                WHERE l.emai=${_email}' AND l.password='${_password}';
            `;
            MySQL.query(loginQuery, (err, result) => {
                console.log(result);

            });

            //     const userDataQuery = `
            //         SELECT u.id_user, u.full_name AS name, u.phone_number, 
            //         FROM user AS u
            //         INNER JOIN login AS l ON l.id_login = u.id_user
            //         WHERE u.email='${_email}';
            //     `;

            //     // TODO na tabela login ter email, senha
            //     // TODO na tabela user id_login, name, etc...
            //     // TODO na tabela token id_user, token, expires_in

            //     MySQL.query(userDataQuery, (err, result) => {
            //         if (err) return reject({ status_code: 400, result: err });
            //         if (result.length) {
            //             // console.log(result);
            //             // return resolve({ status_code: 200, result: 'a' });
            //             const queryResult = result[0];
            //             const id = queryResult.id;
            //             const expires_in = 3600;
            //             const access_token = jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: '1h' });

            //     const userDataQuery = `
            //         SELECT u.id_user, u.full_name AS name, u.phone_number, 
            //         FROM user AS u
            //         INNER JOIN login AS l ON l.id_login = u.id_user
            //         WHERE u.email='${_email}';
            //     `;

            //     // TODO na tabela login ter email, senha
            //     // TODO na tabela user id_login, name, etc...
            //     // TODO na tabela token id_user, token, expires_in

            //     MySQL.query(userDataQuery, (err, result) => {
            //         if (err) return reject({ status_code: 400, result: err });
            //         if (result.length) {
            //             // console.log(result);
            //             // return resolve({ status_code: 200, result: 'a' });
            //             const queryResult = result[0];
            //             const id = queryResult.id;
            //             const expires_in = 3600;
            //             const access_token = jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: '1h' });

            //             queryResult.access_token = access_token;
            //             queryResult.expires_in = expires_in;

            //             console.log(queryResult);
            //             return resolve({ status_code: 200, result: 'a' });

            //             // const registerToken = `UPDATE login SET access_token='${access_token}', expires_in='${expires_in}' WHERE id='${id}';`;
            //             // MySQL.query(registerToken, (err, result) => {
            //             //     if (err) return reject({ status_code: 500, result: err });
            //             //     // return resolve({ status_code: 200, result: { token: access_token, expires_in: expires_in } });
            //             // });
            //         } else return reject({ status_code: 400, result: "Email or password invalid" });
            //     });
            // });
            //             console.log(queryResult);
            //             return resolve({ status_code: 200, result: 'a' });

            //             // const registerToken = `UPDATE login SET access_token='${access_token}', expires_in='${expires_in}' WHERE id='${id}';`;
            //             // MySQL.query(registerToken, (err, result) => {
            //             //     if (err) return reject({ status_code: 500, result: err });
            //             //     // return resolve({ status_code: 200, result: { token: access_token, expires_in: expires_in } });
            //             // });
            //         } else return reject({ status_code: 400, result: "Email or password invalid" });
            //     });
        });
    }

}

module.exports = AuthModel;