const { prisma } = require('../testSetup.cjs');
const { createAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../services/protected/announcements.service.cjs');
const { HttpError } = require('../utils/errors.cjs');

describe('Protected Announcements Module', () => {
    const mockAnnouncement = {
        id: 1,
        title: 'Test Announcement',
        message: 'Test Message',
        date: new Date(),
        category: 'Test',
        type: 'Test',
        read: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createAnnouncement', () => {
        it('should create a new announcement', async () => {
            prisma.announcement.create.mockResolvedValue(mockAnnouncement);

            const result = await createAnnouncement({
                title: 'Test Announcement',
                message: 'Test Message',
                date: new Date(),
                category: 'Test',
                type: 'Test',
                read: false
            });
            expect(result).toEqual(mockAnnouncement);
        });

        it('should throw error for missing required fields', async () => {
            await expect(createAnnouncement({})).rejects.toThrow('Title, message, category, and type are required');
        });
    });

    describe('updateAnnouncement', () => {
        it('should update an announcement', async () => {
            prisma.announcement.findUnique.mockResolvedValue(mockAnnouncement);
            prisma.announcement.update.mockResolvedValue({ ...mockAnnouncement, title: 'Updated Title' });

            const result = await updateAnnouncement('1', { title: 'Updated Title' });
            expect(result.title).toBe('Updated Title');
        });

        it('should throw error for non-existent announcement', async () => {
            prisma.announcement.findUnique.mockResolvedValue(null);
            await expect(updateAnnouncement('1', { title: 'Test' })).rejects.toThrow('Announcement not found');
        });
    });

    describe('deleteAnnouncement', () => {
        it('should delete an announcement', async () => {
            prisma.announcement.findUnique.mockResolvedValue(mockAnnouncement);
            prisma.announcement.delete.mockResolvedValue(mockAnnouncement);

            const result = await deleteAnnouncement('1');
            expect(result).toEqual({ success: true });
        });
    });
}); 