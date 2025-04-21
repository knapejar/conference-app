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

        it('should throw error for non-existent conference', async () => {
            prisma.conference.findUnique.mockResolvedValue(null);
            await expect(updateConference('1', {
                name: 'Test',
                description: 'Test',
                welcomeImage: 'test.jpg'
            })).rejects.toThrow('Conference not found');
        });

        it('should throw error for missing required fields', async () => {
            prisma.conference.findUnique.mockResolvedValue(mockConference);
            await expect(updateConference('1', {})).rejects.toThrow('Name, description, and welcomeImage are required');
        });

        it('should throw error for invalid conference ID', async () => {
            await expect(updateConference('invalid', {
                name: 'Test',
                description: 'Test',
                welcomeImage: 'test.jpg'
            })).rejects.toThrow('Invalid conference ID');
        });

        it('should throw error for missing conference ID', async () => {
            await expect(updateConference(null, {
                name: 'Test',
                description: 'Test',
                welcomeImage: 'test.jpg'
            })).rejects.toThrow('Conference ID is required');
        });
    });
}); 