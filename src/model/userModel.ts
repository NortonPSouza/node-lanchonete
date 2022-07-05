import MySQL from '../connections/mysql';
const Crypt = require('../services/crypt');
const UserRepository = require('../repository/userRepository');

type RegisterProps = {
    cpf: number
    name: string
    email: string
    password: string
    phone: string
    type: number
};
type RowPermissionData = {
    id: number
    permission: number
    permission_description: string
};
type ResultPermissionData = RowPermissionData[];

type UserData = {
    id: number
    name: string
    phone: string
    create_time: Date
    email: string
    permission: number
    permission_description: string
};

type UpdateUserProps = Omit<RegisterProps, 'type' | 'cpf'> & { idUser: number };

type ResultRegisterData = { insertId: number };

type EmailExistResult = {
    email: string
    id_user: number
}

class UserModel {

    static TYPE_DESCRIPTION = ["Administrador", "Cliente"];

    static register({ cpf, name, email, password, phone, type }: RegisterProps) {
        const _password = Crypt.encrypt(password);

        return new Promise((resolve, reject) => {
            const userQuery = `
                SELECT u.cpf 
                FROM user AS u
                INNER JOIN  login AS l ON u.id = l.id_user
                WHERE u.cpf='${cpf}' OR l.email='${email}';
            `;
            MySQL.query(userQuery, (err: Error, result: string) => {
                if (err) return reject({ status_code: 500, result: err });
                if (result.length) {
                    return reject({ status_code: 409, result: "User Already Exist" });
                }
            });

            const selctPermission = `
                SELECT *
                FROM permission
                WHERE permission = ${Number(type)}
            `;
            MySQL.query(selctPermission, (err: Error, resultPermission: ResultPermissionData) => {
                if (err) return reject({ status_code: 500, result: err });
                const idPermission = resultPermission.at(0)?.permission;

                const registerUser = `
                    INSERT INTO user (cpf, name, phone, id_permission) 
                    VALUES ('${cpf}', '${name}', '${phone}', '${idPermission}');
                `;
                MySQL.query(registerUser, (err: Error, resultUser: ResultRegisterData) => {
                    if (err) return reject({ status_code: 500, result: err });

                    const idUser = resultUser.insertId;

                    const linkToken = `
                        INSERT INTO token (id_user)
                        VALUES ('${idUser}');
                    `;
                    MySQL.query(linkToken, (err: Error) => {
                        if (err) return reject({ status_code: 500, result: err });
                    });

                    const registerLogin = `
                        INSERT INTO login (id_user, email, password) 
                        VALUES ('${idUser}','${email}', '${_password}');
                    `;
                    MySQL.query(registerLogin, (err: Error) => {
                        if (err) return reject({ status_code: 500, result: err });
                        resolve({ status_code: 204, result: "User created successfully" });
                    });
                });
            });
        });
    }

    static listAll() {
        return new Promise((resolve, reject) => {
            UserRepository.list()
                .then((result: UserData[]) => {
                    if (!result.length) reject({ status_code: 404, result: "Not Found" });
                    return resolve({ status_code: 200, result: result });
                })
                .catch((err: Error) => reject({ status_code: 500, result: err }))
        });
    }

    static listOne(userId: number) {
        return new Promise((resolve, reject) => {
            UserRepository.find(userId)
                .then((result: UserData[]) => {
                    if (!result.length) reject({ status_code: 404, result: "Not Found" });
                    return resolve({ status_code: 200, result: result.at(0) });
                })
                .catch((err: Error) => reject({ status_code: 500, result: err }))
        });
    }

    static updateUser({ idUser, name, email, password, phone }: UpdateUserProps) {
        const _password = Crypt.encrypt(password);
        const hasPassword = password ? `password='${_password}',` : "\n";

        return new Promise((resolve, reject) => {
            const emailExist = `
                SELECT email, id_user
                FROM login 
                WHERE id_user='${idUser}';`
                ;
            MySQL.query(emailExist, (err: Error, result: EmailExistResult[]) => {
                if (err) return reject({ status_code: 500, result: err });
                if (email === result.at(0)?.email && result.at(0)?.id_user == idUser) {
                    const updateUser = `
                            UPDATE user SET
                            name='${name}',                         
                            phone='${phone}' 
                            WHERE id=${idUser};
                        `;
                    MySQL.query(updateUser, (err: Error) => {
                        if (err) reject({ status_code: 500, result: err });
                        const updateLogin = `
                                UPDATE login SET
                                ${hasPassword}
                                email='${email}'
                                WHERE id_user=${idUser};
                            `;
                        MySQL.query(updateLogin, (err: Error) => {
                            if (err) reject({ status_code: 500, result: err });
                            resolve({ status_code: 200, result: 'User updated successfully' });
                        });
                    });
                } else {
                    return reject({ status_code: 409, result: "eamil already exists" });
                }
            });
        });
    }

    static updatePassword(id: number, password: string) {
        return new Promise((resolve, reject) => {
            const _password = Crypt.encrypt(password);
            const updatePassword = `UPDATE login SET password='${_password}' WHERE id_user=${id};`
            MySQL.query(updatePassword, (err: Error, result: any) => {
                if (err) return reject({ status_code: 500, result: err });
                if (result.affectedRows)
                    resolve({ status_code: 200, result: 'Password updated successfully' });
            });
        });
    }

    static deleteUser(id: number) {
        return new Promise((resolve, reject) => {
            const deleteUser = `DELETE FROM user WHERE id='${id}'`;

            MySQL.query(deleteUser, (err: Error, result: any) => {
                if (err) return reject({ status_code: 500, result: err });
                if (result.affectedRows) {
                    resolve({ status_code: 200, result: 'User deleted successfully' })
                }
                else reject({ status_code: 404, result: 'Not Found' });
            });
        });
    }
}

module.exports = UserModel;