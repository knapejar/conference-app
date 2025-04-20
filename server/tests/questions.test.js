import request from 'supertest';
import { app } from '../server.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Questions API', () => {
    let testPresentationId;
    let testQuestionId;
    const testAuthorToken = 'test-token-123';

    beforeAll(async () => {
        // Create a test presentation
        const presentation = await prisma.presentation.create({
            data: {
                title: 'Test Presentation',
                description: 'Test Description',
                start: new Date(),
                end: new Date(),
                questionsRoom: true,
                block: {
                    create: {
                        blockName: 'Test Block'
                    }
                }
            }
        });
        testPresentationId = presentation.id;
    });

    afterAll(async () => {
        // Clean up test data
        await prisma.question.deleteMany({
            where: { presentationId: testPresentationId }
        });
        await prisma.presentation.delete({
            where: { id: testPresentationId }
        });
        await prisma.$disconnect();
    });

    describe('GET /questions', () => {
        it('should return 400 if presentationId is missing', async () => {
            const response = await request(app)
                .get('/questions')
                .expect(400);
            expect(response.body.error).toBe('Presentation ID is required');
        });

        it('should return 404 if presentation does not exist', async () => {
            const response = await request(app)
                .get('/questions?presentationId=999999')
                .expect(404);
            expect(response.body.error).toBe('Presentation with ID 999999 not found.');
        });

        it('should return empty array if no questions exist', async () => {
            const response = await request(app)
                .get(`/questions?presentationId=${testPresentationId}`)
                .expect(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('POST /questions', () => {
        it('should create a new question', async () => {
            const response = await request(app)
                .post('/questions')
                .send({
                    presentationId: testPresentationId,
                    content: 'Test question',
                    author: 'Test Author',
                    authorToken: testAuthorToken
                })
                .expect(200);

            expect(response.body).toHaveLength(1);
            expect(response.body[0].content).toBe('Test question');
            expect(response.body[0].author).toBe('Test Author');
            expect(response.body[0].likes).toBe(0);

            testQuestionId = response.body[0].id;
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/questions')
                .send({})
                .expect(400);
            expect(response.body.error).toBe('Presentation ID and content are required');
        });
    });

    describe('POST /questions/:id/like', () => {
        it('should increment likes for a question', async () => {
            const response = await request(app)
                .post(`/questions/${testQuestionId}/like`)
                .expect(200);

            expect(response.body[0].likes).toBe(1);
        });

        it('should return 404 if question does not exist', async () => {
            const response = await request(app)
                .post('/questions/999999/like')
                .expect(404);
            expect(response.body.error).toBe('Question with ID 999999 not found.');
        });
    });

    describe('POST /questions/:id/unlike', () => {
        it('should decrement likes for a question', async () => {
            const response = await request(app)
                .post(`/questions/${testQuestionId}/unlike`)
                .expect(200);

            expect(response.body[0].likes).toBe(0);
        });

        it('should not allow negative likes', async () => {
            // Unlike again to ensure likes don't go negative
            const response = await request(app)
                .post(`/questions/${testQuestionId}/unlike`)
                .expect(200);

            expect(response.body[0].likes).toBe(0);
        });
    });

    describe('DELETE /questions/:id', () => {
        it('should delete a question with valid author token', async () => {
            const response = await request(app)
                .delete(`/questions/${testQuestionId}`)
                .send({ authorToken: testAuthorToken })
                .expect(200);

            expect(response.body).toEqual([]);
        });

        it('should return 403 with invalid author token', async () => {
            const response = await request(app)
                .delete(`/questions/${testQuestionId}`)
                .send({ authorToken: 'invalid-token' })
                .expect(403);

            expect(response.body.error).toBe('Unauthorized: Invalid author token.');
        });
    });
}); 