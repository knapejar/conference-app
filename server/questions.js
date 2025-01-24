import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUserByToken = async (deviceToken) => {
    return await prisma.user.findFirst({
        where: {
            devices: {
                some: { token: deviceToken }
            }
        },
        include: { starredPresentations: true }
    });
};

const getPresentationById = async (presentationId) => {
    return await prisma.presentation.findUnique({
        where: { id: parseInt(presentationId, 10) }
    });
};

export const registerQuestions = (app, io, socket) => {
    socket.on('requestQuestions', async (params) => {
        const { deviceToken, presentationId } = params;
        try {
            const questions = await prisma.question.findMany({
                where: {
                    presentationId: parseInt(presentationId, 10)
                },
                include: {
                    author: true
                }
            });
            io.emit('questions', questions);
        } catch (error) {
            console.error('Error handling requestQuestions event:', error);
        }
    });
    socket.on('newQuestion', async (params) => {
        const { content, presentationId, deviceToken } = params;

        try {
            const user = await getUserByToken(deviceToken);
            const presentation = await getPresentationById(presentationId);

            if (!user) {
                console.error('User not found for token:', deviceToken);
                return;
            }

            if (!presentation) {
                console.error('Presentation not found for ID:', presentationId);
                return;
            }

            var newQuestion = await prisma.question.create({
                data: {
                    content,
                    presentation: { connect: { id: presentation.id } },
                    author: { connect: { id: user.id } }
                },
                include: {
                    author: true
                }
            });
            newQuestion.likes = 0;

            io.emit('newQuestion', newQuestion);
        } catch (error) {
            console.error('Error handling newQuestion event:', error);
        }
    });
    socket.on('likeQuestion', async (params) => {
        const { questionId, deviceToken } = params;

        console.log('Like question:', questionId, 'from user:', deviceToken);

        try {
            const user = await getUserByToken(deviceToken);
            if (!user) {
                console.error('User not found for token:', deviceToken);
                return;
            }

            const question = await prisma.question.findUnique({
                where: { id: parseInt(questionId, 10) },
                include: { likers: true }
            });

            if (!question) {
                console.error('Question not found for ID:', questionId);
                return;
            }

            const likedByUser = question.likers.some((liker) => liker.id === user.id);
            if (likedByUser) { // Unlike the question
                await prisma.question.update({
                    where: { id: question.id },
                    data: {
                        likers: {
                            disconnect: { id: user.id }
                        }
                    }
                });
            } else { // Like the question
                await prisma.question.update({
                    where: { id: question.id },
                    data: {
                        likers: {
                            connect: { id: user.id }
                        }
                    }
                });
            }

            const updatedQuestion = await prisma.question.findUnique({
                where: { id: question.id },
                include: {
                    author: true,
                    _count: {
                        select: { likers: true }
                    }
                }
            });

            const response = {
                ...updatedQuestion,
                likes: updatedQuestion._count.likers
            };

            io.emit('newQuestion', response);
        } catch (error) {
            console.error('Error handling likeQuestion event:', error);
        }
    });
}