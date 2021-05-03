const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')
const httpStatus = require('../helpers/http-status')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.send(httpStatus.server_error).send({
            error: "No token provided"
        })
    }

    const parts = authHeader.split(" ");

    if (!parts.length === 2)
        return res.status(401).send({ error: "Token parts error" });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: "Token malformatted" });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: "Token invalid" });
        req.userId = decoded.id;
        return next();
    });
}