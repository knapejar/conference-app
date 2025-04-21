const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
    prisma,
    debugGetTestToken: async (req, res) => {
        res.json({ token: 'test-token' });
    }
}; 