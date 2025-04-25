const { PrismaClient } = require('@prisma/client');
const { createError, HttpError } = require('../../utils/errors.cjs');

const prisma = new PrismaClient();

const createPerson = async (data) => {
    if (!data.name) {
        throw createError('Name is required', 400);
    }

    try {
        let presentationId = null;
        if (data.presentationId) {
            const presentation = await prisma.presentation.findUnique({
                where: { id: parseInt(data.presentationId, 10) }
            });

            if (!presentation) {
                throw createError('Presentation not found', 404);
            }
            presentationId = parseInt(data.presentationId, 10);
        }

        const person = await prisma.presenter.create({
            data: {
                name: data.name,
                role: data.role || '',
                imageURL: data.imageURL || '',
                details: data.details || '',
                presentationId: presentationId
            }
        });

        // Return all presenters sorted by name
        const presenters = await prisma.presenter.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        return presenters;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error creating person:', error);
        throw createError('Failed to create person', 500);
    }
};

const updatePerson = async (id, data) => {
    if (!id) {
        throw createError('Person ID is required', 400);
    }

    const personId = parseInt(id, 10);
    if (isNaN(personId)) {
        throw createError('Invalid person ID', 400);
    }

    try {
        const person = await prisma.presenter.findUnique({
            where: { id: personId }
        });

        if (!person) {
            throw createError('Person not found', 404);
        }

        await prisma.presenter.update({
            where: { id: personId },
            data: {
                name: data.name,
                role: data.role,
                imageURL: data.imageURL,
                details: data.details,
                presentationId: data.presentationId ? parseInt(data.presentationId, 10) : undefined
            }
        });

        // Return all presenters sorted by name
        const presenters = await prisma.presenter.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        return presenters;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error updating person:', error);
        throw createError('Failed to update person', 500);
    }
};

const deletePerson = async (id) => {
    if (!id) {
        throw createError('Person ID is required', 400);
    }

    const personId = parseInt(id, 10);
    if (isNaN(personId)) {
        throw createError('Invalid person ID', 400);
    }

    try {
        const person = await prisma.presenter.findUnique({
            where: { id: personId }
        });

        if (!person) {
            throw createError('Person not found', 404);
        }

        await prisma.presenter.delete({
            where: { id: personId }
        });

        return { success: true };
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error deleting person:', error);
        throw createError('Failed to delete person', 500);
    }
};

module.exports = {
    createPerson,
    updatePerson,
    deletePerson
}; 