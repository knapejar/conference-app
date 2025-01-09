import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const setupSocketHandlers = (io, socket) => {
    socket.on('newQuestion', async (question) => {
        const { content, presentationId, deviceToken } = question;

        try {
            const user = await prisma.user.findFirst({
                where: {
                    devices: {
                        some: { token: deviceToken }
                    }
                },
                include: { starredPresentations: true }
            });
            if (!user) {
                return;
            }
            const newQuestion = await prisma.question.create({
                data: {
                    content,
                    presentation: { connect: { id: parseInt(presentationId, 10) } },
                    author: { connect: { id: user.id } },
                },
            });

            io.emit('newQuestion', newQuestion);
        } catch (error) {
            console.error('Error handling newQuestion event:', error);
        }
    });
};
