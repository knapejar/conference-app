import { PrismaClient } from '@prisma/client';

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
        console.error("Error in getPresentations:", error);
        throw error;
    }
}; 