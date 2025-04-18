import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPeople = async () => {
    try {
        const presenters = await prisma.presenter.findMany();
        return presenters;
    } catch (error) {
        console.error("Error in getPeople:", error);
        throw error;
    }
}; 