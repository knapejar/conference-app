import { PrismaClient } from '@prisma/client';
import { generateDeviceToken, validateInviteCode, createUserWithDeviceToken, validateDeviceToken } from '../auth.js';

const prisma = new PrismaClient();

describe('Authentication', () => {
    let testInviteCode;

    beforeAll(async () => {
        // Create a test invite code
        const invite = await prisma.invite.create({
            data: {
                code: 'TEST123',
                email: 'test@example.com'
            }
        });
        testInviteCode = invite.code;
    });

    afterAll(async () => {
        // Clean up test data
        await prisma.user.deleteMany();
        await prisma.invite.deleteMany();
        await prisma.$disconnect();
    });

    describe('generateDeviceToken', () => {
        it('should generate a unique device token', () => {
            const token1 = generateDeviceToken();
            const token2 = generateDeviceToken();
            
            expect(token1).toBeDefined();
            expect(token2).toBeDefined();
            expect(token1).not.toBe(token2);
            expect(token1.length).toBe(64);
            expect(token2.length).toBe(64);
        });
    });

    describe('validateInviteCode', () => {
        it('should validate a correct invite code', async () => {
            const isValid = await validateInviteCode(testInviteCode);
            expect(isValid).toBe(true);
        });

        it('should reject an invalid invite code', async () => {
            const isValid = await validateInviteCode('INVALID123');
            expect(isValid).toBe(false);
        });
    });

    describe('createUserWithDeviceToken', () => {
        it('should create a user with a valid invite code', async () => {
            const user = await createUserWithDeviceToken(testInviteCode);
            
            expect(user).toBeDefined();
            expect(user.deviceToken).toBeDefined();
            expect(user.deviceToken.length).toBe(64);
            expect(user.invite.code).toBe(testInviteCode);
        });

        it('should throw error for invalid invite code', async () => {
            await expect(createUserWithDeviceToken('INVALID123')).rejects.toThrow();
        });
    });

    describe('validateDeviceToken', () => {
        it('should validate a correct device token', async () => {
            const user = await createUserWithDeviceToken(testInviteCode);
            const isValid = await validateDeviceToken(user.deviceToken);
            expect(isValid).toBe(true);
        });

        it('should reject an invalid device token', async () => {
            const isValid = await validateDeviceToken('INVALID123');
            expect(isValid).toBe(false);
        });
    });
}); 