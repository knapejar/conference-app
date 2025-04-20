const { PrismaClient } = require('@prisma/client');
const { createError, HttpError } = require('../errors.cjs');

const prisma = new PrismaClient();

const updateConference = async (id, data) => {
    if (!id) {
        throw createError('Conference ID is required', 400);
    }

    const confId = parseInt(id, 10);
    if (isNaN(confId)) {
        throw createError('Invalid conference ID', 400);
    }

    if (!data.name || !data.description || !data.welcomeImage) {
        throw createError('Name, description, and welcomeImage are required', 400);
    }

    try {
        const conference = await prisma.conference.findUnique({
            where: { id: confId }
        });

        if (!conference) {
            throw createError('Conference not found', 404);
        }

        const updatedConference = await prisma.conference.update({
            where: { id: confId },
            data: {
                name: data.name,
                description: data.description,
                welcomeImage: data.welcomeImage
            }
        });

        return updatedConference;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error updating conference:', error);
        throw createError('Failed to update conference', 500);
    }
};

module.exports = {
    updateConference
}; 