const { prisma } = require('../testSetup');
const { getQuestions, createQuestion, likeQuestion, unlikeQuestion, deleteQuestion } = require('../questions.js');
const { HttpError } = require('../errors.js');

describe('Questions Module', () => {
    const mockPresentation = {
        id: 1,
        title: 'Test Presentation',
    };

    const mockQuestion = {
        id: 1,
        content: 'Test question',
        author: 'Test Author',
        authorToken: 'test-token',
        likes: 0,
        presentationId: 1,
        state: 'CREATED',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getQuestions', () => {
        it('should return questions for a valid presentation', async () => {
            prisma.presentation.findUnique.mockResolvedValue(mockPresentation);
            prisma.question.findMany.mockResolvedValue([mockQuestion]);

            const result = await getQuestions('1');
            expect(result).toEqual([{
                id: 1,
                content: 'Test question',
                author: 'Test Author',
                authorToken: 'test-token',
                likes: 0,
                presentationId: 1,
            }]);
        });

        it('should throw error for invalid presentation ID', async () => {
            await expect(getQuestions('invalid')).rejects.toThrow('Invalid presentation ID provided.');
        });

        it('should throw error for non-existent presentation', async () => {
            prisma.presentation.findUnique.mockResolvedValue(null);
            await expect(getQuestions('1')).rejects.toThrow('Presentation with ID 1 not found.');
        });
    });

    describe('createQuestion', () => {
        it('should create a question successfully', async () => {
            prisma.presentation.findUnique.mockResolvedValue(mockPresentation);
            prisma.question.create.mockResolvedValue(mockQuestion);
            prisma.question.findMany.mockResolvedValue([mockQuestion]);

            const result = await createQuestion('1', 'Test question', 'Test Author', 'test-token');
            expect(result).toHaveLength(1);
            expect(prisma.question.create).toHaveBeenCalledWith({
                data: {
                    content: 'Test question',
                    author: 'Test Author',
                    authorToken: 'test-token',
                    likes: 0,
                    presentation: { connect: { id: 1 } }
                }
            });
        });

        it('should throw error for missing content', async () => {
            await expect(createQuestion('1', '')).rejects.toThrow('Valid content is required to create a question.');
        });
    });

    describe('likeQuestion', () => {
        it('should increment likes for a question', async () => {
            prisma.question.findUnique.mockResolvedValue(mockQuestion);
            prisma.question.update.mockResolvedValue({ ...mockQuestion, likes: 1 });
            prisma.question.findMany.mockResolvedValue([{ ...mockQuestion, likes: 1 }]);

            const result = await likeQuestion('1');
            expect(result[0].likes).toBe(1);
        });

        it('should throw error for non-existent question', async () => {
            prisma.question.findUnique.mockResolvedValue(null);
            await expect(likeQuestion('1')).rejects.toThrow('Question with ID 1 not found.');
        });
    });

    describe('unlikeQuestion', () => {
        it('should decrement likes for a question', async () => {
            const questionWithLikes = { ...mockQuestion, likes: 1 };
            prisma.question.findUnique.mockResolvedValue(questionWithLikes);
            prisma.question.update.mockResolvedValue(mockQuestion);
            prisma.question.findMany.mockResolvedValue([mockQuestion]);

            const result = await unlikeQuestion('1');
            expect(result[0].likes).toBe(0);
        });

        it('should not go below 0 likes', async () => {
            prisma.question.findUnique.mockResolvedValue(mockQuestion);
            prisma.question.update.mockResolvedValue(mockQuestion);
            prisma.question.findMany.mockResolvedValue([mockQuestion]);

            const result = await unlikeQuestion('1');
            expect(result[0].likes).toBe(0);
        });
    });

    describe('deleteQuestion', () => {
        it('should delete a question with valid author token', async () => {
            prisma.question.findUnique.mockResolvedValue(mockQuestion);
            prisma.question.update.mockResolvedValue({ ...mockQuestion, state: 'DELETED' });
            prisma.question.findMany.mockResolvedValue([]);

            const result = await deleteQuestion('1', 'test-token');
            expect(result).toHaveLength(0);
        });

        it('should throw error for invalid author token', async () => {
            prisma.question.findUnique.mockResolvedValue(mockQuestion);
            await expect(deleteQuestion('1', 'wrong-token')).rejects.toThrow('Unauthorized: Invalid author token.');
        });
    });
}); 