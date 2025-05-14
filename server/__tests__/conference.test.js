const { prisma } = require('../testSetup.cjs');
const { getConference } = require('../services/public/conference.service.cjs');
const { updateConference } = require('../services/protected/conference.service.cjs');
const { HttpError } = require('../utils/errors.cjs');

describe('Conference Module', () => {
    const mockConference = {
        id: 1,
        name: 'Test Conference',
        description: 'Test Description',
        welcomeImage: 'test-image.jpg'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getConference', () => {
        it('should return conference data', async () => {
            prisma.conference.findFirst.mockResolvedValue(mockConference);

            const result = await getConference();
            expect(result).toEqual(mockConference);
            expect(prisma.conference.findFirst).toHaveBeenCalled();
        });

        it('should throw error when no conference exists', async () => {
            prisma.conference.findFirst.mockResolvedValue(null);
            await expect(getConference()).rejects.toThrow('No conference found');
        });
    });

    describe('updateConference', () => {
        it('should update conference successfully', async () => {
            const updateData = {
                name: 'Updated Conference',
                description: 'Updated Description',
                welcomeImage: 'updated-image.jpg'
            };

            prisma.conference.findUnique.mockResolvedValue(mockConference);
            prisma.conference.update.mockResolvedValue({
                ...mockConference,
                ...updateData
            });

            const result = await updateConference('1', updateData);
            expect(result).toEqual({
                ...mockConference,
                ...updateData
            });
            expect(prisma.conference.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: updateData
            });
        });

        it('should throw error for invalid conference ID', async () => {
            await expect(updateConference('invalid', {
                name: 'Test',
                description: 'Test',
                welcomeImage: 'test.jpg'
            })).rejects.toThrow('Invalid conference ID');
        });

        it('should create conference if it does not exist', async () => {
            prisma.conference.findUnique.mockResolvedValue(null);
            prisma.conference.create.mockResolvedValue({
                id: 0,
                name: 'Test',
                description: 'Test',
                welcomeImage: 'test.jpg'
            });

            const result = await updateConference('0', {
                name: 'Test',
                description: 'Test',
                welcomeImage: 'test.jpg'
            });

            expect(result).toEqual({
                id: 0,
                name: 'Test',
                description: 'Test',
                welcomeImage: 'test.jpg'
            });
            expect(prisma.conference.create).toHaveBeenCalled();
        });

        it('should throw error for missing required fields', async () => {
            prisma.conference.findUnique.mockResolvedValue(mockConference);
            const invalidData = {
                name: '',
                description: '',
                welcomeImage: ''
            };

            await expect(updateConference('1', invalidData)).rejects.toThrow('Name and description are required');
        });
    });
}); 