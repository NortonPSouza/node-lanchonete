const jwt = require("jsonwebtoken");

const config = process.env;

function middleware(req, res, next) {
    const token = req.body.token || req.query.token || req.headers.authorization;

    if (!token) return res.status(401).send({ err: "A token is required for authentication" });
    jwt.verify(token, config.TOKEN_KEY, (err, decode) => {
        if (err) {
           return res.status(401).send({ err: err.message.replace("jwt", "token") });
        }
    });
    return next();
};

module.exports = middleware;