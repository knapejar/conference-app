const { prisma } = require('../testSetup.cjs');
const { getPeople } = require('../services/public/people.service.cjs');

describe('People Module', () => {
    const mockPerson = {
        id: 1,
        name: 'Test Person',
        role: 'Test Role',
        imageURL: 'test.jpg',
        details: 'Test Details',
        presentationId: 1
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getPeople', () => {
        it('should return all people', async () => {
            prisma.presenter.findMany.mockResolvedValue([mockPerson]);

            const result = await getPeople();
            expect(result).toHaveLength(1);
        });
    });
}); 