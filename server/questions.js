import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getQuestions = async (req, res) => {
    const { id } = req.params;
    const questions = await prisma.question.findMany({
        where: { presentationId: parseInt(id) },
    });
    res.json(questions);
};

export const postQuestion = async (req, res) => {
    const { content, presentationId, user } = req.body;

    const question = await prisma.question.create({
        data: { content, presentationId, user },
    });

    res.json(question);
};
