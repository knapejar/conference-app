const { PrismaClient } = require('@prisma/client');
const { createError, HttpError } = require('./errors.js');

const prisma = new PrismaClient();

const getQuestions = async (presentationId) => {
    if (!presentationId) {
        throw createError("Presentation ID is required.", 400);
    }
    const presId = parseInt(presentationId, 10);
    if (isNaN(presId)) {
        throw createError("Invalid presentation ID provided.", 400);
    }
    try {
        const presentation = await prisma.presentation.findUnique({
            where: { id: presId }
        });
        if (!presentation) {
            throw createError(`Presentation with ID ${presId} not found.`, 404);
        }

        const questions = await prisma.question.findMany({
            where: { 
                presentationId: presId,
                state: "CREATED"
            }
        });
        return questions.map(({ state, ...rest }) => rest);
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error("Error in getQuestions:", error);
        throw createError("Failed to retrieve questions.", 500);
    }
};

const createQuestion = async (presentationId, content, author = "Anonymous", authorToken = "Anonymous") => {
    if (!presentationId) {
        throw createError("Presentation ID is required.", 400);
    }
    if (!content || typeof content !== 'string') {
        throw createError("Valid content is required to create a question.", 400);
    }
    const presId = parseInt(presentationId, 10);
    if (isNaN(presId)) {
        throw createError("Invalid presentation ID provided.", 400);
    }
    try {
        const presentation = await prisma.presentation.findUnique({
            where: { id: presId }
        });
        if (!presentation) {
            throw createError(`Presentation with ID ${presId} not found.`, 404);
        }
        await prisma.question.create({
            data: {
                content,
                author,
                authorToken,
                likes: 0,
                presentation: { connect: { id: presId } }
            }
        });
        return getQuestions(presId);
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error("Error in createQuestion:", error);
        throw createError("Failed to create question.", 500);
    }
};

const likeQuestion = async (questionId) => {
    if (!questionId) {
        throw createError("Question ID is required.", 400);
    }
    const qId = parseInt(questionId, 10);
    if (isNaN(qId)) {
        throw createError("Invalid question ID provided.", 400);
    }
    try {
        const question = await prisma.question.findUnique({ where: { id: qId } });
        if (!question) {
            throw createError(`Question with ID ${qId} not found.`, 404);
        }
        await prisma.question.update({
            where: { id: qId },
            data: { likes: question.likes + 1 }
        });
        return getQuestions(question.presentationId);
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error("Error in likeQuestion:", error);
        throw createError("Failed to like question.", 500);
    }
};

const unlikeQuestion = async (questionId) => {
    if (!questionId) {
        throw createError("Question ID is required.", 400);
    }
    const qId = parseInt(questionId, 10);
    if (isNaN(qId)) {
        throw createError("Invalid question ID provided.", 400);
    }
    try {
        const question = await prisma.question.findUnique({ where: { id: qId } });
        if (!question) {
            throw createError(`Question with ID ${qId} not found.`, 404);
        }
        const updatedLikes = question.likes > 0 ? question.likes - 1 : 0;
        await prisma.question.update({
            where: { id: qId },
            data: { likes: updatedLikes }
        });
        return getQuestions(question.presentationId);
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error("Error in unlikeQuestion:", error);
        throw createError("Failed to unlike question.", 500);
    }
};

const deleteQuestion = async (questionId, authorToken) => {
    if (!questionId) {
        throw createError("Question ID is required.", 400);
    }
    if (!authorToken) {
        throw createError("Author token is required for deletion.", 400);
    }
    const qId = parseInt(questionId, 10);
    if (isNaN(qId)) {
        throw createError("Invalid question ID provided.", 400);
    }
    try {
        const question = await prisma.question.findUnique({ where: { id: qId } });
        if (!question) {
            throw createError(`Question with ID ${qId} not found.`, 404);
        }
        if (question.authorToken !== authorToken) {
            throw createError("Unauthorized: Invalid author token.", 403);
        }
        await prisma.question.update({
            where: { id: qId },
            data: { state: "DELETED" }
        });
        return getQuestions(question.presentationId);
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.error("Error in deleteQuestion:", error);
        throw createError("Failed to delete question.", 500);
    }
};

module.exports = {
    getQuestions,
    createQuestion,
    likeQuestion,
    unlikeQuestion,
    deleteQuestion
};
