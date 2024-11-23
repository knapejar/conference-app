import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInitialUpdate = async (req, res, deviceToken) => {
    try {
        // Find the user associated with the device token
        const user = await prisma.user.findFirst({
            where: {
                devices: {
                    some: { token: deviceToken }
                }
            },
            include: { starredPresentations: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const blocks = await prisma.block.findMany({
            include: {
                presentations: {
                    include: {
                        presenters: true,
                        starrers: true,
                        questions: {
                            include: {
                                author: true,
                                likers: true
                            }
                        }
                    }
                }
            }
        });

        const starredPresentations = user.starredPresentations || [];

        const blocksWithPresentations = blocks.map(block => ({
            ...block,
            presentations: block.presentations.map(presentation => ({
                ...presentation,
                isStarred: starredPresentations.some(sp => sp.id === presentation.id),
                questions: presentation.questions.map(question => ({
                    ...question,
                    authorName: question.author.name,
                    likeCount: question.likers.length
                }))
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
