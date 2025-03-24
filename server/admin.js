import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerAdmin = (app, io, socket) => {
    socket.on('getAppState', async () => {
        