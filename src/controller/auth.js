const express = require('express');
const User = require('../model/user');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/token', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) res.status(400).send({ error: { description: "All input is required" } });

    const user = await User.findOne({ email });
    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (user && verifyPassword) {
        const token = {
            access_token: jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, { expiresIn: "1h", }),
            expires_in: 3600
        };

        user.token = token;

        console.log();
        res.status(200).json(user.token);
    } else res.status(400).send({ error: { description: "Invalid param" } });

});

module.exports = app => app.use('/auth/v1', router);