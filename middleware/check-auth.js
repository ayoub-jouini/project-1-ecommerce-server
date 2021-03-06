const jwt = require("jsonwebtoken");
const HttpError = require("./http-error");

const checkAuth = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed!');
        }
        const decodedToken = jwt.verify(token, "my-token-key");
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        const error = new HttpError('Authentication failed!', 401);
        return next(error);
    }
}

module.exports = checkAuth;