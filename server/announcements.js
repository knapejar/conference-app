import { PrismaClient } from '@prisma/client';
import { createError, HttpError } from './errors.js';

const prisma = new PrismaClient();

export const getAnnouncements = async () => {
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