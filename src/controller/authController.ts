const AuthModel = require('../model/authModel');
import { Request, Response } from 'express';

type loginResult = {
    status_code: number
    result: string
}

class AuthController {

    static login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ error: { description: "All input is required" } });

        AuthModel.login(email, password)
            .then(({ status_code, result }: loginResult) => res.status(status_code).json(result))
            .catch(({ status_code, result }: loginResult) => res.status(status_code).send(result))

    }
}

module.exports = AuthController;