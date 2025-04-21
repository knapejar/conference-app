const { PrismaClient } = require('@prisma/client');
const { createError, HttpError } = require('./errors.cjs');

const prisma = new PrismaClient();

const getPeople = async () => {
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

module.exports = {
    getPeople
}; 