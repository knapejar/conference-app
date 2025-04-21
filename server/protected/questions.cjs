const { PrismaClient } = require('@prisma/client');
const { createError, HttpError } = require('../errors.cjs');

const prisma = new PrismaClient();

const createQuestion = async (data) => {
    if (!data.content || !data.presentationId) {
        throw createError('Content and presentationId are required', 400);
    }

    try {
        const presentation = await prisma.presentation.findUnique({
            where: { id: parseInt(data.presentationId, 10) }
        });

        if (!presentation) {
            throw createError('Presentation not found', 404);
        }

        const question = await prisma.question.create({
            data: {
                content: data.content,
                author: data.author || 'Anonymous',
                authorToken: data.authorToken || 'Anonymous',
                likes: 0,
                state: 'CREATED',
                presentationId: parseInt(data.presentationId, 10)
            }
        });

        return question;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error creating question:', error);
        throw createError('Failed to create question', 500);
    }
};

const updateQuestion = async (id, data) => {
    if (!id) {
        throw createError('Question ID is required', 400);
    }

    const questionId = parseInt(id, 10);
    if (isNaN(questionId)) {
        throw createError('Invalid question ID', 400);
    }

    try {
        const question = await prisma.question.findUnique({
            where: { id: questionId }
        });

        if (!question) {
            throw createError('Question not found', 404);
        }

        const updatedQuestion = await prisma.question.update({
            where: { id: questionId },
            data: {
                content: data.content,
                state: data.state
            }
        });

        return updatedQuestion;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error updating question:', error);
        throw createError('Failed to update question', 500);
    }
};

const deleteQuestion = async (id) => {
    if (!id) {
        throw createError('Question ID is required', 400);
    }

    const questionId = parseInt(id, 10);
    if (isNaN(questionId)) {
        throw createError('Invalid question ID', 400);
    }

    try {
        const question = await prisma.question.findUnique({
            where: { id: questionId }
        });

        if (!question) {
            throw createError('Question not found', 404);
        }

        await prisma.question.delete({
            where: { id: questionId }
        });

        return { success: true };
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error('Error deleting question:', error);
        throw createError('Failed to delete question', 500);
    }
};

module.exports = {
    createQuestion,
    updateQuestion,
    deleteQuestion
}; 