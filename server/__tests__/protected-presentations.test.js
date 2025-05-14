const { prisma } = require('../testSetup.cjs');
const { createBlock, updateBlock, deleteBlock, createPresentation, updatePresentation, deletePresentation } = require('../services/protected/presentations.service.cjs');
const { HttpError } = require('../utils/errors.cjs');

describe('Protected Presentations Module', () => {
    const mockBlock = {
        id: 1,
        blockName: 'Test Block',
        start: new Date(),
        end: new Date(),
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

    describe('createBlock', () => {
        it('should create a new block', async () => {
            prisma.block.create.mockResolvedValue(mockBlock);

            const result = await createBlock({ 
                blockName: 'Test Block',
                start: new Date(),
                end: new Date()
            });
            expect(result).toEqual(mockBlock);
        });

        it('should throw error for missing required fields', async () => {
            await expect(createBlock({})).rejects.toThrow('Block name, start time, and end time are required');
        });
    });

    describe('updateBlock', () => {
        it('should update a block', async () => {
            prisma.block.findUnique.mockResolvedValue(mockBlock);
            prisma.block.update.mockResolvedValue({ 
                ...mockBlock, 
                blockName: 'Updated Block',
                start: new Date(),
                end: new Date()
            });

            const result = await updateBlock('1', { 
                blockName: 'Updated Block',
                start: new Date(),
                end: new Date()
            });
            expect(result.blockName).toBe('Updated Block');
        });

        it('should throw error for non-existent block', async () => {
            prisma.block.findUnique.mockResolvedValue(null);
            await expect(updateBlock('1', { 
                blockName: 'Test',
                start: new Date(),
                end: new Date()
            })).rejects.toThrow('Block not found');
        });
    });

    describe('deleteBlock', () => {
        it('should delete a block', async () => {
            prisma.block.findUnique.mockResolvedValue(mockBlock);
            prisma.block.delete.mockResolvedValue(mockBlock);

            const result = await deleteBlock('1');
            expect(result).toEqual({ success: true });
        });
    });

    describe('createPresentation', () => {
        it('should create a new presentation', async () => {
            prisma.block.findUnique.mockResolvedValue(mockBlock);
            prisma.presentation.create.mockResolvedValue(mockPresentation);

            const result = await createPresentation({
                title: 'Test Presentation',
                description: 'Test Description',
                start: new Date(),
                end: new Date(),
                blockId: 1,
                questionsRoom: true
            });
            expect(result).toEqual(mockPresentation);
        });

        it('should throw error for invalid block', async () => {
            prisma.block.findUnique.mockResolvedValue(null);
            await expect(createPresentation({
                title: 'Test',
                description: 'Test',
                start: new Date(),
                end: new Date(),
                blockId: 1,
                questionsRoom: true
            })).rejects.toThrow('Block not found');
        });
    });

    describe('updatePresentation', () => {
        it('should update a presentation', async () => {
            prisma.presentation.findUnique.mockResolvedValue(mockPresentation);
            prisma.presentation.update.mockResolvedValue({ ...mockPresentation, title: 'Updated Title' });

            const result = await updatePresentation('1', { title: 'Updated Title' });
            expect(result.title).toBe('Updated Title');
        });

        it('should throw error for non-existent presentation', async () => {
            prisma.presentation.findUnique.mockResolvedValue(null);
            await expect(updatePresentation('1', { title: 'Test' })).rejects.toThrow('Presentation not found');
        });
    });

    describe('deletePresentation', () => {
        it('should delete a presentation', async () => {
            prisma.question.deleteMany.mockResolvedValue({ count: 0 });
            prisma.presentation.update.mockResolvedValue(mockPresentation);
            prisma.presentation.delete.mockResolvedValue(mockPresentation);

            const result = await deletePresentation('1');
            expect(result).toEqual({ success: true });
            expect(prisma.question.deleteMany).toHaveBeenCalledWith({
                where: { presentationId: 1 }
            });
            expect(prisma.presentation.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    presenters: {
                        set: []
                    }
                }
            });
            expect(prisma.presentation.delete).toHaveBeenCalledWith({
                where: { id: 1 }
            });
        });
    });
}); 