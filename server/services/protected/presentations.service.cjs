const { PrismaClient } = require('@prisma/client');
const { createError, HttpError } = require('../../utils/errors.cjs');

const prisma = new PrismaClient();

// Block operations
const createBlock = async (data) => {
    if (!data.blockName || !data.start || !data.end) {
        throw createError('Block name, start time, and end time are required', 400);
    }

    try {
        const block = await prisma.block.create({
            data: {
                blockName: data.blockName,
                start: new Date(data.start),
                end: new Date(data.end)
            }
        });

        return block;
    } catch (error) {
        console.error('Error creating block:', error);
        throw createError('Failed to create block', 500);
    }
};

const updateBlock = async (id, data) => {
    if (!id) {
        throw createError('Block ID is required', 400);
    }

    const blockId = parseInt(id, 10);
    if (isNaN(blockId)) {
        throw createError('Invalid block ID', 400);
    }

    try {
        const block = await prisma.block.findUnique({
            where: { id: blockId }
        });

        if (!block) {
            throw createError('Block not found', 404);
        }

        const updatedBlock = await prisma.block.update({
            where: { id: blockId },
            data: {
                blockName: data.blockName,
                start: data.start ? new Date(data.start) : undefined,
                end: data.end ? new Date(data.end) : undefined
            }
        });

        return updatedBlock;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error updating block:', error);
        throw createError('Failed to update block', 500);
    }
};

const deleteBlock = async (id) => {
    if (!id) {
        throw createError('Block ID is required', 400);
    }

    const blockId = parseInt(id, 10);
    if (isNaN(blockId)) {
        throw createError('Invalid block ID', 400);
    }

    try {
        const block = await prisma.block.findUnique({
            where: { id: blockId }
        });

        if (!block) {
            throw createError('Block not found', 404);
        }

        await prisma.block.delete({
            where: { id: blockId }
        });

        return { success: true };
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error deleting block:', error);
        throw createError('Failed to delete block', 500);
    }
};

// Presentation operations
const createPresentation = async (data) => {
    if (!data.title || !data.description || !data.start || !data.end || !data.blockId) {
        throw createError('Title, description, start time, end time, and block ID are required', 400);
    }

    try {
        const block = await prisma.block.findUnique({
            where: { id: parseInt(data.blockId, 10) }
        });

        if (!block) {
            throw createError('Block not found', 404);
        }

        const presentation = await prisma.presentation.create({
            data: {
                title: data.title,
                description: data.description,
                start: new Date(data.start),
                end: new Date(data.end),
                blockId: parseInt(data.blockId, 10),
                questionsRoom: data.questionsRoom || false
            }
        });

        return presentation;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error creating presentation:', error);
        throw createError('Failed to create presentation', 500);
    }
};

const updatePresentation = async (id, data) => {
    if (!id) {
        throw createError('Presentation ID is required', 400);
    }

    const presId = parseInt(id, 10);
    if (isNaN(presId)) {
        throw createError('Invalid presentation ID', 400);
    }

    try {
        const presentation = await prisma.presentation.findUnique({
            where: { id: presId }
        });

        if (!presentation) {
            throw createError('Presentation not found', 404);
        }

        const updatedPresentation = await prisma.presentation.update({
            where: { id: presId },
            data: {
                title: data.title,
                description: data.description,
                start: data.start ? new Date(data.start) : undefined,
                end: data.end ? new Date(data.end) : undefined,
                blockId: data.blockId ? parseInt(data.blockId, 10) : undefined,
                questionsRoom: data.questionsRoom
            }
        });

        return updatedPresentation;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error updating presentation:', error);
        throw createError('Failed to update presentation', 500);
    }
};

const deletePresentation = async (id) => {
    if (!id) {
        throw createError('Presentation ID is required', 400);
    }

    const presId = parseInt(id, 10);
    if (isNaN(presId)) {
        throw createError('Invalid presentation ID', 400);
    }

    try {
        const presentation = await prisma.presentation.findUnique({
            where: { id: presId }
        });

        if (!presentation) {
            throw createError('Presentation not found', 404);
        }

        await prisma.presentation.delete({
            where: { id: presId }
        });

        return { success: true };
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error deleting presentation:', error);
        throw createError('Failed to delete presentation', 500);
    }
};

module.exports = {
    createBlock,
    updateBlock,
    deleteBlock,
    createPresentation,
    updatePresentation,
    deletePresentation
}; 