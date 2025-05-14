const { createError } = require('../utils/errors.cjs');
const crypto = require('crypto');

const requireAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw createError('Authorization header is required', 401);
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
        throw createError('Invalid authorization format', 401);
    }

    // Get current admin password and compute its hash
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'default_admin_password';
    const ADMIN_PASSWORD_HASH = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest('hex');

    // Compare received hash with stored hash
    if (token !== ADMIN_PASSWORD_HASH) {
        throw createError('Invalid admin token', 403);
    }

    next();
};

module.exports = { requireAdmin }; 