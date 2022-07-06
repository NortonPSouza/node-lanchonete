const UserModel = require('../model/userModel');
const UserValidate = require('../validate/userValidate');
import { Request, Response } from 'express';

type ErrorData = { err: string }

type User = {
    id: number
    permission: number
    name: string
    phone: string
    create_time: string
    email: string
    permission_description: string
}

type ErrorProps = {
    status_code: number
    result: Error
}

type RegisterProps = {
    status_code: number
    result: ""
}

type ListAllProps = {
    status_code: number
    result: User[]
}

type ListUserProps = {
    status_code: number
    result: User
}

type UpdateProps = {
    status_code: number
    result: string
}

type UpdatePasswordProps = {
    status_code: number
    result: string
}

type DeleteProps = {
    status_code: number
    result: string
}



class UserController {

    static register(req: Request, res: Response) {
        const { cpf, name, email, password, phone, type } = req.body;
        const fields = {
            isCPF: UserValidate.isCPF(cpf),
            isName: UserValidate.isName(name),
            isType: UserValidate.isType(type),
            isEmail: UserValidate.isEmail(email),
            isPhone: UserValidate.isPhone(phone),
            isPassword: UserValidate.isPassword(password)
        };

        type Key = keyof typeof fields

        for (const key in fields) {
            if (fields[key as Key]?.err) {
                return res.status(400).send({ err: fields[key as Key].err });
            };
        };

        UserModel.register({ cpf, name, email, password, phone, type })
            .then(({ status_code, result }: RegisterProps) => res.status(status_code).send(result))
            .catch(({ status_code, result }: ErrorProps) => res.status(status_code).send(result))
    }

    static listAll(req: Request, res: Response) {
        UserModel.listAll()
            .then(({ status_code, result }: ListAllProps) => res.status(status_code).json(result))
            .catch(({ status_code, result }: ErrorProps) => res.status(status_code).send(result))
    }

    static listOne(req: Request, res: Response) {
        if (!req.params.id) {
            return res.status(400).send('ID invalid');
        }

        UserModel.listOne(req.params.id)
            .then(({ status_code, result }: ListUserProps) => res.status(status_code).send(result))
            .catch(({ status_code, result }: ErrorProps) => res.status(status_code).send(result))
    }

    static updateUser(req: Request, res: Response) {
        const { name, email, password, phone, } = req.body;
        const fields = {
            isName: UserValidate.isName(name),
            isEmail: UserValidate.isEmail(email),
            isPhone: UserValidate.isPhone(phone),
            isPassword: UserValidate.isPassword(password)
        }
        type Key = keyof typeof fields
        for (const key in fields) {
            if (fields[key as Key].err) {
                return res.status(400).send({ err: fields[key as Key].err });
            };
        };

        UserModel.updateUser({ idUser: req.params.id, name, email, password, phone })
            .then(({ status_code, result }: UpdateProps) => res.status(status_code).send(result))
            .catch(({ status_code, result }: ErrorProps) => res.status(status_code).send(result))
    }

    static updatePassword(req: Request, res: Response) {
        const isPassword = UserValidate.isPassword(req.body.password);

        if (isPassword.err) {
            return res.status(400).send({ err: isPassword.err })
        };

        UserModel.updatePassword(req.params.id, req.body.password)
            .then(({ status_code, result }: UpdatePasswordProps) => res.status(status_code).send(result))
            .catch(({ status_code, result }: ErrorProps) => res.status(status_code).send(result))
    }

    static deleteUser(req: Request, res: Response) {
        if (!req.params.id) {
            return res.status(400).send('ID invalid');
        };

        UserModel.deleteUser(req.params.id)
            .then(({ status_code, result }: DeleteProps) => res.status(status_code).send(result))
            .catch(({ status_code, result }: ErrorProps) => res.status(status_code).send(result))
    }
}

module.exports = UserController;