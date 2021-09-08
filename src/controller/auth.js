const User = require('../model/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Auth {

    constructor(app) {
        this._app = app;
    }

    static async Login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send({ error: { description: "All input is required" } });

        const user = await User.findOne({ email });
        const verifyPassword = await bcryptjs.compare(password, user.password);

        if (user && verifyPassword) {
            const token = {
                access_token: jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, { expiresIn: "1h", }),
                expires_in: 3600
            };

            user.token = token;

            return res.status(200).json(user.token);
        } else return res.status(400).send({ error: { description: "Invalid param" } });
    }
}

module.exports = Auth;