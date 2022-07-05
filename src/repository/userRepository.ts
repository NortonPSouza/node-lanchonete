import MySQL from '../connections/mysql';

class UserRepository {

    static find(id: number) {
        return new Promise((resolve, reject) => {
            const querry = `
                SELECT u.id, u.name, u.phone,u.create_time, l.email, p.permission, p.permission_description
                FROM user AS u
                INNER JOIN login as l ON u.id = l.id_user
                INNER JOIN permission p ON p.id = u.id_permission
                WHERE u.id=${id};
            `;
            MySQL.query(querry, (error: Error, result: any) => {
                if (error) return reject(error);
                return resolve(result);
            });
        });
    }

    static getIdByToken(token: string) {
        return new Promise((resolve, reject) => {
            const getIdUser = `
                SELECT id_user 
                FROM  token AS t 
                WHERE t.access_token = "${token}" 
            `;
            MySQL.query(getIdUser, (error: Error, result: any) => {
                if (error) return reject(error);
                return resolve(result);
            });
        })
    }

    static list() {
        return new Promise((resolve, reject) => {
            const listUsers = `
                SELECT u.id, u.name, u.phone, u.create_time, l.email, p.permission, p.permission_description
                FROM user u
                INNER JOIN login l ON u.id = l.id_user
                INNER JOIN permission p ON p.id = u.id_permission
            `;
            MySQL.query(listUsers, (error: Error, result: any) => {
                if (error) return reject(error);
                return resolve(result);
            });
        });
    }

    static checkPermission(id: number, type: number) {
        return new Promise((resolve, reject) => {
            const checkPermission = `
                SELECT u.name, p.permission_description , u.id_permission 
                FROM permission p 
                INNER JOIN user u ON p.permission = u.id_permission
                WHERE u.id = ${id} AND p.permission_description  = '${type}';
            `;
            MySQL.query(checkPermission, ((error: Error, result: any) => {
                if (error) return reject(error);
                if (!result.length) return reject(false)
                return resolve(true);
            }));
        });
    }
}

module.exports = UserRepository;