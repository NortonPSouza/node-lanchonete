const UserRepository = require('../repository/userRepository');
import { Request, Response, NextFunction } from 'express';

type findIdByTokenResult ={
    id_user: Number
}


function isAdmin(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    UserRepository.getIdByToken(token)
        .then((resp: findIdByTokenResult[]) => {
            UserRepository.checkPermission(resp.at(0)?.id_user, 'admin')
                .then((resp: Boolean )=> next())
                .catch((error: Error) => res.status(403).send({ err: "not authorization for this operation" }))
        })
        .catch((error: Error )=> res.status(500).send({ err: error }))
}

module.exports = isAdmin;