import { PrismaClient } from '@prisma/client';
import { createError, HttpError } from './errors.js';

const prisma = new PrismaClient();

export const getPresentations = async () => {
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