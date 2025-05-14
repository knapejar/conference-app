const request = require('supertest');
const express = require('express');
const { prisma } = require('../testSetup.cjs');
const questionsRouter = require('../routes/protected/questions.routes.cjs');

const app = express();
app.use(express.json());
app.use('/questions', questionsRouter);

describe('Questions Routes', () => {
    const mockQuestions = [
        { id: 1, content: 'Question 1', presentationId: 1, createdAt: '2025-04-25T09:56:13.730Z' },
        { id: 2, content: 'Question 2', presentationId: 1, createdAt: '2025-04-25T09:56:13.730Z' },
        { id: 3, content: 'Question 3', presentationId: 1, createdAt: '2025-04-25T09:56:13.730Z' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock console.error to suppress output during tests
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        // Restore console.error after each test
        console.error.mockRestore();
    });

    describe('GET /questions/presentation/:presentationId', () => {
        it('should return questions for a presentation with default pagination', async () => {
            prisma.question.findMany.mockResolvedValue(mockQuestions);

            const response = await request(app)
                .get('/questions/presentation/1')
                .expect(200);

            expect(response.body).toEqual(mockQuestions);
            expect(prisma.question.findMany).toHaveBeenCalledWith({
                where: { presentationId: 1 },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 100
            });
        });

        it('should return questions with custom pagination', async () => {
            prisma.question.findMany.mockResolvedValue(mockQuestions.slice(0, 2));

            const response = await request(app)
                .get('/questions/presentation/1?skip=0&take=2')
                .expect(200);

            expect(response.body).toEqual(mockQuestions.slice(0, 2));
            expect(prisma.question.findMany).toHaveBeenCalledWith({
                where: { presentationId: 1 },
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 2
            });
        });

        it('should handle errors', async () => {
            prisma.question.findMany.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/questions/presentation/1')
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Failed to get questions');
        });
    });

    describe('GET /questions/presentation/:presentationId/count', () => {
        it('should return question count for a presentation', async () => {
            prisma.question.count.mockResolvedValue(3);

            const response = await request(app)
                .get('/questions/presentation/1/count')
                .expect(200);

            expect(response.body).toEqual({ count: 3 });
            expect(prisma.question.count).toHaveBeenCalledWith({
                where: { presentationId: 1 }
            });
        });

        it('should handle errors', async () => {
            prisma.question.count.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/questions/presentation/1/count')
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Failed to get question count');
        });
    });
}); 