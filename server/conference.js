import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getConference = async () => {
    try {
        const conference = await prisma.conference.findFirst();
        return conference;
    } catch (error) {
        console.error("Error in getConference:", error);
        throw error;
    }
}; 