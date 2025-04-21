const { PrismaClient } = require('@prisma/client');
const { createError, HttpError } = require('../../utils/errors.cjs');

const prisma = new PrismaClient();

const getConference = async () => {
    try {
        const conference = await prisma.conference.findFirst();
        if (!conference) {
            throw createError('No conference found', 404);
        }
        return conference;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error getting conference:', error);
        throw createError('Failed to get conference', 500);
    }
};

module.exports = {
    getConference
}; 