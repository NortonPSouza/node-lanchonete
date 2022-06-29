const UserRepository = require( '../repository/userRepository');

function isAdmin(req, res, next) {
    console.log('header', req.headers.authorization);
    console.log('body',req.body);
    // UserRepository.checkPermission(req.params.id, "admin")
    //     .then()
    //     .catch(_ => res.status(403).send({ err: "Not permission" }))
    return next();
}

module.exports = isAdmin;