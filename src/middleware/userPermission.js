const UserRepository = require('../repository/userRepository');

function isAdmin(req, res, next) {
    const token = req.headers.authorization;
    console.log(1, token);
    UserRepository.getIdByToken(token)
        .then(([{ id_user }]) => {
            UserRepository.checkPermission(id_user, 'admin')
                .then(resp => next())
                .catch(error => res.status(403).send({ err: "not authorization for this operation" }))
        })
        .catch(error => res.status(500).send({ err: error }))
}

module.exports = isAdmin;