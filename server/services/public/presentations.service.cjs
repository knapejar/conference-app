const { PrismaClient } = require('@prisma/client');
const { createError, HttpError } = require('../../utils/errors.cjs');

const prisma = new PrismaClient();

const getPresentations = async () => {
    try {
        const blocks = await prisma.block.findMany({
            include: {
                presentations: {
                    include: {
                        presenters: {
                            orderBy: {
                                name: 'asc'
                            }
                        }
                    }
                }
            },
            orderBy: {
                start: 'asc'
            }
        });

        return blocks;
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