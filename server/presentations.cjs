const { PrismaClient } = require('@prisma/client');
const { createError, HttpError } = require('./errors.cjs');

const prisma = new PrismaClient();

const getPresentations = async () => {
    try {
        const blocks = await prisma.block.findMany({
            include: {
                presentations: {
                    include: {
                        presenters: true,
                    }
                }
            }
        });

        const blocksWithPresentations = blocks.map(block => ({
            ...block,
            presentations: block.presentations.map(presentation => ({
                ...presentation,
            }))
        }));

        return blocksWithPresentations;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error("Error in getPresentations:", error);
        throw createError("Failed to retrieve presentations.", 500);
    }
};

module.exports = {
    getPresentations
}; 