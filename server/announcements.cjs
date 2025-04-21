const { PrismaClient } = require('@prisma/client');
const { createError, HttpError } = require('./errors.cjs');

const prisma = new PrismaClient();

const getAnnouncements = async () => {
    try {
        const announcements = await prisma.announcement.findMany();
        return announcements;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error("Error in getAnnouncements:", error);
        throw createError("Failed to retrieve announcements.", 500);
    }
};

module.exports = {
    getAnnouncements
}; 