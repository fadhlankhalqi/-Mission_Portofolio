const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authorization = req.headers.authorization || '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ status: 'error', message: 'Token autentikasi diperlukan' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch {
        return res.status(401).json({ status: 'error', message: 'Autentikasi gagal: token tidak valid' });
    }
}

module.exports = { verifyToken };
