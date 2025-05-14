const { prisma } = require('../testSetup.cjs');
const { updateConference } = require('../services/protected/conference.service.cjs');
const { HttpError } = require('../utils/errors.cjs');

describe('Protected Conference Module', () => {
    const mockConference = {
        id: 1,
        name: 'Test Conference',
        description: 'Test Description',
        welcomeImage: 'test-image.jpg'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('updateConference', () => {
        it('should update conference details', async () => {
            prisma.conference.findUnique.mockResolvedValue(mockConference);
            prisma.conference.update.mockResolvedValue({
                ...mockConference,
                name: 'Updated Conference',
                description: 'Updated Description',
                welcomeImage: 'updated-image.jpg'
            });

            const result = await updateConference('1', {
                name: 'Updated Conference',
                description: 'Updated Description',
                welcomeImage: 'updated-image.jpg'
            });

            expect(result.name).toBe('Updated Conference');
            expect(result.description).toBe('Updated Description');
            expect(result.welcomeImage).toBe('updated-image.jpg');
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
            await expect(updateConference('1', {})).rejects.toThrow('Name and description are required');
        });
    });
}); 