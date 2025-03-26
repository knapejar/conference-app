import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const debugGetTestToken = async (req, res) => {
    try {
        const device = await prisma.device.findFirst()
        console.log("Development test token:", device.token);
        res.json({token: device.token});
    } catch (error) {
        console.error(error);
        console.error("Please propely setup the prisma database to test me")
        res.status(500).json({ error: 'Internal Server Error' });
    }
}