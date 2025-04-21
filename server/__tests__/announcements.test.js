const { prisma } = require('../testSetup.cjs');
const { getAnnouncements } = require('../announcements.cjs');

describe('Announcements Module', () => {
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

    describe('getAnnouncements', () => {
        it('should return all announcements', async () => {
            prisma.announcement.findMany.mockResolvedValue([mockAnnouncement]);

            const result = await getAnnouncements();
            expect(result).toHaveLength(1);
        });
    });
}); 