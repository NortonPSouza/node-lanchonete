const MySQL = require('../database/mysql');
const Crypt = require('../services/crypt');

class UserModel {

    static register(cpf, full_name, email, password, phone_number) {
        const _cpf = Crypt.encrypt(cpf);
        const _email = Crypt.encrypt(email);
        const _password = Crypt.encrypt(password);

        new Promise((resolve, reject) => {
            const userQuery = `SELECT cpf,email FROM lanchonete.user WHERE cpf='${_cpf}' AND email='${_email}';`;
            MySQL.query(userQuery, (err, result) => {
                if (err) reject({ status_code: 400, result: err });
                if (result.length) {
                    reject({ status_code: 409, result: "Email or cpf Already Exist" });
                }
            });

            const registerLogin = `INSERT INTO lanchonete.login (email, password) VALUES ('${_email}', '${_password}');`;
            MySQL.query(registerLogin, (err, results) => {
                if (err) reject({ status_code: 500, result: err });
            });

            const registerUser = `INSERT INTO lanchonete.user (cpf, full_name, email, password, phone_number) VALUES ('${_cpf}', '${full_name}', '${_email}', '${_password}', '${phone_number}');`;
            MySQL.query(registerUser, (err, result) => {
                if (err) reject({ status_code: 500, result: err });
                return resolve({ status_code: 201, result: 'User created successfully' });
            });
        })
    }

    static listAll() {
        const listUsers = "SELECT * FROM lanchonete.user";
        new Promise((resolve, reject) => {
            MySQL.query(listUsers, (err, results) => {
                if (err) reject({ status_code: 400, result: err });
                if (results.length) {
                    const users = results.map(item => {
                        delete item.cpf;
                        delete item.password;
                        return { ...item, email: Crypt.descrypt(item.email) }
                    });
                    resolve({ status_code: 200, results: users });
                }
                else reject({ status_code: 404, results: "Not Found" })
            });
        })
    }

    static listOne(userId) {
        new Promise((resolve, reject)=>{
            const findUserQuery = `SELECT * FROM lanchonete.user WHERE id_user='${userId}'`;
            MySQL.query(findUserQuery, (err, results) => {
                if (err) reject({ status_code: 400, result: err });
                if (results.length) {
                    const user = results.map(item => {
                        delete item.cpf;
                        delete item.password;
                        return { ...item, email: Crypt.descrypt(item.email) }
                    });
                    resolve({ status_code: 200, results: user });
                }
                else reject({ status_code: 404, results: "Not Found" });
            });
        })
    }
}

module.exports = UserModel;