import { ResultLoginData, ResultUserData } from "../types/login";

const MySQL = require('../connections/mysql');
const Crypt = require('../services/crypt');
const jwt = require('jsonwebtoken');

class AuthModel {

    static login(email: string, password: string) {
        return new Promise((resolve, reject) => {
            const _password = Crypt.encrypt(password);

            const loginQuery = `
                SELECT id, email, password, id_user
                FROM login AS l
                WHERE l.email='${email}' AND l.password='${_password}';
            `;
            MySQL.query(loginQuery, (err: Error, resultLogin: ResultLoginData) => {
                if (err) return reject({ status_code: 500, result: err });
                if (!resultLogin.length) return reject({ status_code: 401, result: "Email or password is invalid" });                
                
                const id = resultLogin.at(0)?.id_user;
                const access_token = jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: '1h' });                
                const registerAccessToken = `
                    UPDATE token SET 
                    access_token='${access_token}', expires_in='${3600}' WHERE id_user='${id}';
                `;
                MySQL.query(registerAccessToken, (err: Error, resultToken: null) => {
                    if (err) return reject({ status_code: 500, result: err });
                    const userQuery = `
                        SELECT u.id, name, expires_in, access_token
                        FROM token AS t
                        INNER JOIN user AS u ON u.id = t.id_user
                        INNER JOIN login AS l ON l.id_user  = t.id_user 
                        WHERE l.email='${email}' AND l.password='${_password}';
                    `;
                    MySQL.query(userQuery, (err: Error, resultUser: ResultUserData) => {
                        if (err) return reject({ status_code: 500, result: err });                        
                        resolve({ status_code: 200, result: resultUser[0] });
                    });

                });
            });
        });
    }
}

module.exports = AuthModel;