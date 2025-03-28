import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateDeviceToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const validateInviteCode = async (inviteCode) => {
    const invite = await prisma.invite.findUnique({
        where: { code: inviteCode }
    });
    return invite !== null;
};

export const createUserWithDeviceToken = async (inviteCode) => {
    const deviceToken = generateDeviceToken();
    
    const user = await prisma.user.create({
        data: {
            deviceToken,
            invite: {
                connect: {
                    code: inviteCode
                }
            }
        }
    });
    
    return user;
};

export const validateDeviceToken = async (deviceToken) => {
    const user = await prisma.user.findUnique({
        where: { deviceToken }
    });
    return user !== null;
}; 