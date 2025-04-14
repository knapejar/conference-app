import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInitialUpdate = async (req, res) => {
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

        const announcements = await prisma.announcement.findMany();
        const conference = await prisma.conference.findFirst();
        const presenters = await prisma.presenter.findMany();

        res.json({
            announcements: announcements,
            blocks: blocksWithPresentations,
            conference: conference,
            presenters: presenters,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
