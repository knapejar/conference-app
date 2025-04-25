const { PrismaClient } = require('@prisma/client');
const { createError, HttpError } = require('../../utils/errors.cjs');

const prisma = new PrismaClient();

const getPresentations = async () => {
    try {
        const blocks = await prisma.block.findMany({
            include: {
                presentations: {
                    include: {
                        presenters: true,
                    },
                    orderBy: {
                        start: 'asc'
                    }
                }
            }
        });

        const sortedBlocks = blocks.sort((a, b) => {
            const aEarliest = a.presentations[0]?.start || new Date(0);
            const bEarliest = b.presentations[0]?.start || new Date(0);
            return aEarliest - bEarliest;
        });

        return sortedBlocks;
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