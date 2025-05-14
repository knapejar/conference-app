const { prisma } = require('../testSetup.cjs');
const { getPresentations } = require('../services/public/presentations.service.cjs');

describe('Presentations Module', () => {
    const mockBlock = {
        id: 1,
        blockName: 'Test Block',
        start: new Date('2024-04-25T09:00:00Z'),
        end: new Date('2024-04-25T10:30:00Z'),
        presentations: []
    };

    const mockPresentation = {
        id: 1,
        title: 'Test Presentation',
        description: 'Test Description',
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

        it('should sort blocks by their start time', async () => {
            const blocks = [
                {
                    id: 2,
                    blockName: 'Oběd',
                    start: new Date('2024-04-25T12:30:00Z'),
                    end: new Date('2024-04-25T13:30:00Z'),
                    presentations: [{
                        ...mockPresentation,
                        id: 1
                    }]
                },
                {
                    id: 1,
                    blockName: 'Plenární zasedání',
                    start: new Date('2024-04-25T09:00:00Z'),
                    end: new Date('2024-04-25T10:30:00Z'),
                    presentations: [{
                        ...mockPresentation,
                        id: 2
                    }]
                },
                {
                    id: 8,
                    blockName: 'Večerní blok',
                    start: new Date('2024-04-25T17:00:00Z'),
                    end: new Date('2024-04-25T19:00:00Z'),
                    presentations: [{
                        ...mockPresentation,
                        id: 3
                    }]
                },
                {
                    id: 9,
                    blockName: 'Snídaně',
                    start: new Date('2024-04-25T07:00:00Z'),
                    end: new Date('2024-04-25T08:00:00Z'),
                    presentations: [{
                        ...mockPresentation,
                        id: 4
                    }]
                }
            ];

            // Return blocks in random order
            prisma.block.findMany.mockImplementation(({ orderBy }) => {
                const sortedBlocks = [...blocks].sort((a, b) => {
                    if (orderBy && orderBy.start === 'asc') {
                        return a.start.getTime() - b.start.getTime();
                    }
                    return 0;
                });
                return Promise.resolve(sortedBlocks);
            });

            const result = await getPresentations();

            // Verify blocks are sorted by their own start time
            expect(result[0].blockName).toBe('Snídaně');
            expect(result[1].blockName).toBe('Plenární zasedání');
            expect(result[2].blockName).toBe('Oběd');
            expect(result[3].blockName).toBe('Večerní blok');

            // Verify the exact start times
            expect(result[0].start).toEqual(new Date('2024-04-25T07:00:00Z'));
            expect(result[1].start).toEqual(new Date('2024-04-25T09:00:00Z'));
            expect(result[2].start).toEqual(new Date('2024-04-25T12:30:00Z'));
            expect(result[3].start).toEqual(new Date('2024-04-25T17:00:00Z'));
        });
    });
}); 