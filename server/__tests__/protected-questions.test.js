const { prisma } = require('../testSetup.cjs');
const { createQuestion: adminCreateQuestion, updateQuestion, deleteQuestion: adminDeleteQuestion } = require('../protected/questions.cjs');
const { HttpError } = require('../errors.cjs');

describe('Protected Questions Module', () => {
    const mockQuestion = {
        id: 1,
        content: 'Test question',
        author: 'Test Author',
        authorToken: 'test-token',
        likes: 0,
        presentationId: 1,
        state: 'CREATED'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('adminCreateQuestion', () => {
        it('should create a question as admin', async () => {
            prisma.presentation.findUnique.mockResolvedValue({ id: 1 });
            prisma.question.create.mockResolvedValue(mockQuestion);

            const result = await adminCreateQuestion({
                content: 'Test question',
                author: 'Test Author',
                presentationId: 1
            });
            expect(result).toEqual(mockQuestion);
        });

        it('should throw error for invalid presentation', async () => {
            prisma.presentation.findUnique.mockResolvedValue(null);
            await expect(adminCreateQuestion({
                content: 'Test',
                author: 'Test',
                presentationId: 1
            })).rejects.toThrow('Presentation not found');
        });
    });

    describe('updateQuestion', () => {
        it('should update a question', async () => {
            prisma.question.findUnique.mockResolvedValue(mockQuestion);
            prisma.question.update.mockResolvedValue({ ...mockQuestion, content: 'Updated content' });

            const result = await updateQuestion('1', { content: 'Updated content' });
            expect(result.content).toBe('Updated content');
        });

        it('should throw error for non-existent question', async () => {
            prisma.question.findUnique.mockResolvedValue(null);
            await expect(updateQuestion('1', { content: 'Test' })).rejects.toThrow('Question not found');
        });
    });

    describe('adminDeleteQuestion', () => {
        it('should delete a question as admin', async () => {
            prisma.question.findUnique.mockResolvedValue(mockQuestion);
            prisma.question.delete.mockResolvedValue(mockQuestion);

            const result = await adminDeleteQuestion('1');
            expect(result).toEqual({ success: true });
        });
    });
}); 