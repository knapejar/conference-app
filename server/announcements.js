import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAnnouncements = async () => {
    try {
        const announcements = await prisma.announcement.findMany();
        return announcements;
    } catch (error) {
        console.error("Error in getAnnouncements:", error);
        throw error;
    }
}; 