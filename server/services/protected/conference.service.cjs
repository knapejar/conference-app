const { PrismaClient } = require('@prisma/client');
const { createError, HttpError } = require('../../utils/errors.cjs');

const prisma = new PrismaClient();

const updateConference = async (id, data) => {
    if (!data.name || !data.description) {
        throw createError('Name and description are required', 400);
    }

    try {
        const confId = parseInt(id, 10);
        if (isNaN(confId)) {
            throw createError('Invalid conference ID', 400);
        }

        // Try to find existing conference
        let conference = await prisma.conference.findUnique({
            where: { id: confId }
        });

        // If conference doesn't exist, create it
        if (!conference) {
            conference = await prisma.conference.create({
                data: {
                    id: confId,
                    name: data.name,
                    description: data.description,
                    welcomeImage: data.welcomeImage || null
                }
            });
            return conference;
        }

        // Update existing conference
        const updateData = {
            name: data.name,
            description: data.description,
            welcomeImage: data.welcomeImage || conference.welcomeImage
        };

        const updatedConference = await prisma.conference.update({
            where: { id: confId },
            data: updateData
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