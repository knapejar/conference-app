import { PrismaClient } from '@prisma/client';
import { createError, HttpError } from './errors.js';

const prisma = new PrismaClient();

export const getConference = async () => {
    try {
        const conference = await prisma.conference.findFirst();
        if (!conference) {
            throw createError("Conference not found.", 404);
        }
        return conference;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error("Error in getConference:", error);
        throw createError("Failed to retrieve conference.", 500);
    }
}; 