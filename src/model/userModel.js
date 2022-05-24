const res = require('express/lib/response');
const MySQL = require('../connections/mysql');
const Crypt = require('../services/crypt');

class UserModel {

    static TYPE_DESCRIPTION = ["Administrador", "Cliente"];

    static register(cpf, name, email, password, phone, type) {
        const _password = Crypt.encrypt(password);

        return new Promise((resolve, reject) => {
            const userQuery = `
                SELECT u.cpf 
                FROM user AS u
                INNER JOIN  login AS l ON u.id = l.id_user
                WHERE u.cpf='${cpf}' OR l.email='${email}';
            `;
            MySQL.query(userQuery, (err, result) => {
                if (err) return reject({ status_code: 500, result: err });
                if (result.length) {
                    return reject({ status_code: 409, result: "User Already Exist" });
                }
            });

            const selctPermission = `
                SELECT id
                FROM permission
                WHERE type = ${Number(type)}
            `;
            MySQL.query(selctPermission, (err, resultPermission) => {
                const idPermission = resultPermission[0].id;

                const registerUser = `
                    INSERT INTO user (cpf, name, phone, id_permission) 
                    VALUES ('${cpf}', '${name}', '${phone}', '${idPermission}');
                `;
                MySQL.query(registerUser, (err, resultUser) => {
                    if (err) return reject({ status_code: 500, result: err });
                    const idUser = resultUser.insertId;

                    const linkToken = `
                        INSERT INTO token (id_user)
                        VALUES ('${idUser}');
                    `;
                    MySQL.query(linkToken, (err, resultToken) => {
                        if (err) return reject({ status_code: 500, result: err });
                    });

                    const registerLogin = `
                        INSERT INTO login (id_user, email, password) 
                        VALUES ('${idUser}','${email}', '${_password}');
                    `;
                    MySQL.query(registerLogin, (err, resultLogin) => {
                        if (err) return reject({ status_code: 500, result: err });
                        resolve({ status_code: 204, result: "User created successfully" });
                    });
                });
            });
        });
    }

    static listAll() {
        const listUsers = `
            SELECT u.id, u.name, u.phone, u.create_time, l.email 
            FROM user AS u
            INNER JOIN login as l ON u.id = l.id_user;
        `;
        return new Promise((resolve, reject) => {
            MySQL.query(listUsers, (err, results) => {
                if (err) return reject({ status_code: 400, result: err });
                if (results.length) {
                    const listUser = results.map(item => item);
                    resolve({ status_code: 200, result: listUser });
                }
                else reject({ status_code: 404, result: "Not Found" })
            });
        });
    }

    static listOne(userId) {
        return new Promise((resolve, reject) => {
            const findUserQuery = `
                SELECT u.id, u.name, u.phone, u.create_time, l.email 
                FROM user AS u
                INNER JOIN login as l ON u.id = l.id_user
                WHERE u.id='${userId}';
            `;
            MySQL.query(findUserQuery, (err, result) => {
                if (err) return reject({ status_code: 400, result: err });
                if (result.length) {
                    resolve({ status_code: 200, result: result[0] });
                }
                else reject({ status_code: 404, result: "Not Found" });
            });
        });
    }

    static updateUser(id, name, email, password, number) {
        const _password = Crypt.encrypt(password);

        return new Promise((resolve, reject) => {
            const emailExist = `SELECT email FROM login WHERE email='${email}';`;
            MySQL.query(emailExist, (err, result) => {
                if (err) return reject({ status_code: 400, result: err });
                const updateUser = `
                        UPDATE user SET
                        name='${name}',                         
                        phone='${number}' 
                        WHERE id=${id};
                    `;
                MySQL.query(updateUser, (err, result) => {
                    if (err) reject({ status_code: 400, result: err });
                    const updateLogin = `
                            UPDATE login SET
                            email='${email}',
                            password='${_password}'
                            WHERE id_user=${id};
                        `;
                    MySQL.query(updateLogin, (err, result) => {
                        if (err) reject({ status_code: 400, result: err });
                        resolve({ status_code: 200, result: 'User updated successfully' });
                    });
                });
            });
        });
    }

    static updatePassword(id, password) {
        return new Promise((resolve, reject) => {
            const _password = Crypt.encrypt(password);
            const updatePassword = `UPDATE login SET password='${_password}' WHERE id_user=${id};`
            MySQL.query(updatePassword, (err, result) => {
                if (err) return reject({ status_code: 400, result: err });
                if (result.affectedRows)
                    resolve({ status_code: 200, result: 'Password updated successfully' });
            });
        });
    }

    static deleteUser(id) {
        return new Promise((resolve, reject) => {
            const deleteUser = `DELETE FROM user WHERE id='${id}'`;

            MySQL.query(deleteUser, (err, result) => {
                if (err) return reject({ status_code: 400, result: err });
                if (result.affectedRows) {
                    resolve({ status_code: 201, result: 'User deleted successfully' })
                }
                else reject({ status_code: 404, result: 'Not Found' });
            });
        });
    }
}

module.exports = UserModel;