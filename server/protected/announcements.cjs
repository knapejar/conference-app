const { PrismaClient } = require('@prisma/client');
const { createError } = require('../errors.js');

const prisma = new PrismaClient();

const createAnnouncement = async (data) => {
    if (!data.title || !data.message || !data.category || !data.type) {
        throw createError('Title, message, category, and type are required', 400);
    }

    try {
        const announcement = await prisma.announcement.create({
            data: {
                title: data.title,
                message: data.message,
                date: new Date(),
                category: data.category,
                type: data.type,
                read: false
            }
        });

        return announcement;
    } catch (error) {
        console.error('Error creating announcement:', error);
        throw createError('Failed to create announcement', 500);
    }
};

const updateAnnouncement = async (id, data) => {
    if (!id) {
        throw createError('Announcement ID is required', 400);
    }

    const annId = parseInt(id, 10);
    if (isNaN(annId)) {
        throw createError('Invalid announcement ID', 400);
    }

    try {
        const announcement = await prisma.announcement.findUnique({
            where: { id: annId }
        });

        if (!announcement) {
            throw createError('Announcement not found', 404);
        }

        const updatedAnnouncement = await prisma.announcement.update({
            where: { id: annId },
            data: {
                title: data.title,
                message: data.message,
                category: data.category,
                type: data.type
            }
        });

        return updatedAnnouncement;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error updating announcement:', error);
        throw createError('Failed to update announcement', 500);
    }
};

const deleteAnnouncement = async (id) => {
    if (!id) {
        throw createError('Announcement ID is required', 400);
    }

    const annId = parseInt(id, 10);
    if (isNaN(annId)) {
        throw createError('Invalid announcement ID', 400);
    }

    try {
        const announcement = await prisma.announcement.findUnique({
            where: { id: annId }
        });

        if (!announcement) {
            throw createError('Announcement not found', 404);
        }

        await prisma.announcement.delete({
            where: { id: annId }
        });

        return { success: true };
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error deleting announcement:', error);
        throw createError('Failed to delete announcement', 500);
    }
};

module.exports = {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
}; 