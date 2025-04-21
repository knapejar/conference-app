const { prisma } = require('../testSetup.cjs');
const { getPresentations } = require('../presentations.cjs');

describe('Presentations Module', () => {
    const mockBlock = {
        id: 1,
        blockName: 'Test Block',
        presentations: []
    };

    const mockPresentation = {
        id: 1,
        title: 'Test Presentation',
        description: 'Test Description',
        start: new Date(),
        end: new Date(),
        blockId: 1,
        questionsRoom: true,
        block: mockBlock
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getPresentations', () => {
        it('should return all presentations', async () => {
            const mockBlockWithPresentations = {
                ...mockBlock,
                presentations: [mockPresentation]
            };
            prisma.block.findMany.mockResolvedValue([mockBlockWithPresentations]);

            const result = await getPresentations();
            expect(result).toHaveLength(1);
            expect(result[0].presentations).toHaveLength(1);
            expect(result[0].presentations[0].title).toBe('Test Presentation');
        });
    });
}); 