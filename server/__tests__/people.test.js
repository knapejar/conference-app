const { prisma } = require('../testSetup.cjs');
const { getPeople } = require('../services/public/people.service.cjs');

describe('People Module', () => {
    const mockPerson = {
        id: 1,
        name: 'Test Person',
        role: 'Test Role',
        imageURL: 'test.jpg',
        details: 'Test Details',
        presentations: [
            {
                id: 1,
                title: 'Test Presentation',
                description: 'Test Description',
                start: new Date(),
                end: new Date(),
                questionsRoom: true
            }
        ]
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getPeople', () => {
        it('should return all people', async () => {
            prisma.presenter.findMany.mockResolvedValue([mockPerson]);

            const result = await getPeople();
            expect(result).toHaveLength(1);
            expect(result[0].presentations).toHaveLength(1);
        });
    });
}); 