const AuthModel = require('../model/authModel');
class AuthController {

    constructor(app) {
        this._app = app;
    }

    static login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ error: { description: "All input is required" } });

        AuthModel.login(email, password)
            .then(({ status_code, result }) => res.status(status_code).json(result))
            .catch(({ status_code, result }) => res.status(status_code).send(result))

    }
}

module.exports = AuthController;