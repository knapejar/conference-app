import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getQuestions = async (presentationId) => {
    if (!presentationId) {
        throw new Error("Presentation ID is required.");
    }
    const presId = parseInt(presentationId, 10);
    if (isNaN(presId)) {
        throw new Error("Invalid presentation ID provided.");
    }
    try {
        // Verify that the presentation exists
        const presentation = await prisma.presentation.findUnique({
            where: { id: presId }
        });
        if (!presentation) {
            throw new Error(`Presentation with ID ${presId} not found.`);
        }

        const questions = await prisma.question.findMany({
            where: { presentationId: presId }
        });
        return questions;
    } catch (error) {
        console.error("Error in getQuestions:", error);
        throw error;
    }
};

export const createQuestion = async (presentationId, content, author = "Anonymous", authorToken = "Anonymous") => {
    if (!presentationId) {
        throw new Error("Presentation ID is required.");
    }
    if (!content || typeof content !== 'string') {
        throw new Error("Valid content is required to create a question.");
    }
    const presId = parseInt(presentationId, 10);
    if (isNaN(presId)) {
        throw new Error("Invalid presentation ID provided.");
    }
    try {
        // Verify that the presentation exists
        const presentation = await prisma.presentation.findUnique({
            where: { id: presId }
        });
        if (!presentation) {
            throw new Error(`Presentation with ID ${presId} not found.`);
        }
        // Create the question with likes defaulting to 0
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
        console.error("Error in createQuestion:", error);
        throw error;
    }
};

export const likeQuestion = async (questionId) => {
    if (!questionId) {
        throw new Error("Question ID is required.");
    }
    const qId = parseInt(questionId, 10);
    if (isNaN(qId)) {
        throw new Error("Invalid question ID provided.");
    }
    try {
        const question = await prisma.question.findUnique({ where: { id: qId } });
        if (!question) {
            throw new Error(`Question with ID ${qId} not found.`);
        }
        await prisma.question.update({
            where: { id: qId },
            data: { likes: question.likes + 1 }
        });
        return getQuestions(question.presentationId);
    } catch (error) {
        console.error("Error in likeQuestion:", error);
        throw error;
    }
};

export const unlikeQuestion = async (questionId) => {
    if (!questionId) {
        throw new Error("Question ID is required.");
    }
    const qId = parseInt(questionId, 10);
    if (isNaN(qId)) {
        throw new Error("Invalid question ID provided.");
    }
    try {
        const question = await prisma.question.findUnique({ where: { id: qId } });
        if (!question) {
            throw new Error(`Question with ID ${qId} not found.`);
        }
        const updatedLikes = question.likes > 0 ? question.likes - 1 : 0;
        await prisma.question.update({
            where: { id: qId },
            data: { likes: updatedLikes }
        });
        return getQuestions(question.presentationId);
    } catch (error) {
        console.error("Error in unlikeQuestion:", error);
        throw error;
    }
};

export const deleteQuestion = async (questionId, authorToken) => {
    if (!questionId) {
        throw new Error("Question ID is required.");
    }
    if (!authorToken) {
        throw new Error("Author token is required for deletion.");
    }
    const qId = parseInt(questionId, 10);
    if (isNaN(qId)) {
        throw new Error("Invalid question ID provided.");
    }
    try {
        const question = await prisma.question.findUnique({ where: { id: qId } });
        if (!question) {
            throw new Error(`Question with ID ${qId} not found.`);
        }
        if (question.authorToken !== authorToken) {
            throw new Error("Unauthorized: Invalid author token.");
        }
        await prisma.question.delete({
            where: { id: qId }
        });
        return getQuestions(question.presentationId);
    } catch (error) {
        console.error("Error in deleteQuestion:", error);
        throw error;
    }
};
