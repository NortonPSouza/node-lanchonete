const MySQL = require('../database/mysql');
const Crypt = require('../services/crypt');

class UserModel {

    static register(cpf, name, email, password, phone) {
        const _password = Crypt.encrypt(password);

        return new Promise((resolve, reject) => {
            const userQuery = `
                SELECT u.cpf 
                FROM user AS u
                INNER JOIN  login AS l ON u.id = l.id_user
                WHERE u.cpf='${cpf}' OR l.email='${email}';
            `;
            MySQL.query(userQuery, (err, result) => {
                if (err) return reject({ status_code: 400, result: err });
                if (result.length) {
                    return reject({ status_code: 409, result: "User Already Exist" });
                }
            });

            const registerUser = `
                INSERT INTO user (cpf, name, phone) 
                VALUES ('${cpf}', '${name}', '${phone}');
            `;
            MySQL.query(registerUser, (err, result) => {
                if (err) return reject({ status_code: 400, result: err });
                const registerLogin = `
                    INSERT INTO login (id_user, email, password) 
                    VALUES ('${result.insertId}','${email}', '${_password}');
                `;
                MySQL.query(registerLogin, (err, result) => {
                    if (err) return reject({ status_code: 400, result: err });
                    resolve({ status_code: 204, result: "User created successfully" });
                });
            });


        });
    }

    static listAll() {
        const listUsers = "SELECT * FROM lanchonete.user";
        return new Promise((resolve, reject) => {
            MySQL.query(listUsers, (err, results) => {
                if (err) return reject({ status_code: 400, result: err });
                if (results.length) {
                    const users = results.map(item => {
                        delete item.cpf;
                        delete item.password;
                        return { ...item, email: Crypt.descrypt(item.email) }
                    });
                    resolve({ status_code: 200, result: users });
                }
                else reject({ status_code: 404, result: "Not Found" })
            });
        });
    }

    static listOne(userId) {
        return new Promise((resolve, reject) => {
            const findUserQuery = `SELECT * FROM lanchonete.user WHERE id_user='${userId}'`;
            MySQL.query(findUserQuery, (err, results) => {
                if (err) return reject({ status_code: 400, result: err });
                if (results.length) {
                    const user = results.map(item => {
                        delete item.cpf;
                        delete item.password;
                        return { ...item, email: Crypt.descrypt(item.email) }
                    });
                    resolve({ status_code: 200, result: user });
                }
                else reject({ status_code: 404, result: "Not Found" });
            });
        });
    }

    static updateUser(id, full_name, email, password, phone_number) {
        const _email = Crypt.encrypt(email);
        const _password = Crypt.encrypt(password);

        return new Promise((resolve, reject) => {
            const emailExist = `SELECT email FROM lanchonete.user WHERE email='${_email}';`;
            MySQL.query(emailExist, (err, result) => {
                if (err || !result) return reject({ status_code: 400, result: err });
                if (result.length) {
                    const updateUser = `UPDATE lanchonete.user SET full_name='${full_name}', email='${_email}', password='${_password}', phone_number='${phone_number}' WHERE id_user=${id};`;
                    MySQL.query(updateUser, (err, result) => {
                        if (err) reject({ status_code: 400, result: err });
                        if (result.affectedRows) resolve({ status_code: 200, result: 'User updated successfully' });
                    });
                };
            });
        });
    }

    static updatePassword(id, password) {
        return new Promise((resolve, reject) => {
            const _password = Crypt.encrypt(password);
            const updatePassword = `UPDATE lanchonete.user SET password='${_password}' WHERE id_user=${id};`
            MySQL.query(updatePassword, (err, result) => {
                if (err) return reject({ status_code: 400, result: err });
                if (result.affectedRows)
                    resolve({ status_code: 200, result: 'Password updated successfully' });
            });
        });
    }

    static deleteUser(id) {
        return new Promise((resolve, reject) => {
            let email = '';
            const userQuery = `SELECT email FROM lanchonete.user WHERE id_user='${id}'`;
            const deleteUser = `DELETE FROM  lanchonete.user WHERE id_user='${id}'`;

            MySQL.query(userQuery, (err, results) => results.map(item => email = item.email));

            MySQL.query(deleteUser, (err, result) => {
                if (err) return reject({ status_code: 400, result: err });
                if (result.affectedRows) {
                    const delelteLogin = `DELETE FROM  lanchonete.login WHERE email='${email}'`;
                    MySQL.query(delelteLogin, (err, result) =>
                        resolve({ status_code: 201, result: 'User deleted successfully' })
                    );
                }
                else reject({ status_code: 404, result: 'Not Found' });
            });
        });
    }
}

module.exports = UserModel;