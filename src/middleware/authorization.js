const jwt = require("jsonwebtoken");

const config = process.env;

function tokenAuthorization(req, res, next) {
    const token = req.body.token || req.query.token || req.headers.authorization;
    if (!token) return res.status(401).send({ err: "A token is required for authentication" });

    const isTokenError = jwt.verify(token, config.TOKEN_KEY, (err, decode) => err && err);
    if (isTokenError) {
        return res.status(401).send({ err: isTokenError.message.replace("jwt", "token") });
    }
    
    return next();
};

module.exports = tokenAuthorization;