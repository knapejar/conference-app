import { PrismaClient } from '@prisma/client';
import { createError, HttpError } from './errors.js';

const prisma = new PrismaClient();

export const getPeople = async () => {
    try {
        const presenters = await prisma.presenter.findMany();
        return presenters;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error("Error in getPeople:", error);
        throw createError("Failed to retrieve people.", 500);
    }
}; 