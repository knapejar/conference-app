import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'http';
import { Server } from 'socket.io';
import io from 'socket.io-client';
import express from 'express';
import { registerQuestions } from '../server/questions.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let ioServer;
let serverSocket;
let clientSocket;
let httpServer;
const TEST_PORT = 3001; // Changed port to avoid conflicts

describe('Questions Socket Tests', () => {
    beforeAll(async () => {
        return new Promise((resolve) => {
            const app = express();
            httpServer = createServer(app);
            ioServer = new Server(httpServer);
            
            // Set up socket server
            ioServer.on('connection', (socket) => {
                serverSocket = socket;
                registerQuestions(app, ioServer, socket);
            });

            // Start the server
            httpServer.listen(TEST_PORT, () => {
                // Set up socket client after server is running
                clientSocket = io(`http://localhost:${TEST_PORT}`);
                clientSocket.on('connect', () => {
                    resolve();
                });
            });
        });
    });

    afterAll(async () => {
        return new Promise((resolve) => {
            if (clientSocket) {
                clientSocket.disconnect();
            }
            if (ioServer) {
                ioServer.close(() => {
                    httpServer.close(() => {
                        resolve();
                    });
                });
            } else {
                resolve();
            }
        });
    });

    it('should load questions for a presentation', async () => {
        // Create a test block first (required for presentation)
        const block = await prisma.block.create({
            data: {
                blockName: 'Test Block'
            }
        });

        // Create a test presentation and questions in the database
        const presentation = await prisma.presentation.create({
            data: {
                title: 'Test Presentation',
                start: new Date(),
                end: new Date(Date.now() + 3600000), // 1 hour from now
                starred: false,
                questionsRoom: 'test-room',
                blockId: block.id
            }
        });

        const user = await prisma.user.create({
            data: {
                name: 'Test User'
            }
        });

        const device = await prisma.device.create({
            data: {
                token: `test-device-token-${Date.now()}`,
                userId: user.id
            }
        });

        const questions = await Promise.all([
            prisma.question.create({
                data: {
                    content: 'Test Question 1',
                    presentationId: presentation.id,
                    authorId: user.id
                }
            }),
            prisma.question.create({
                data: {
                    content: 'Test Question 2',
                    presentationId: presentation.id,
                    authorId: user.id
                }
            })
        ]);

        // Set up promise to handle the response
        const questionsPromise = new Promise((resolve) => {
            clientSocket.on('questions', (receivedQuestions) => {
                resolve(receivedQuestions);
            });
        });

        // Request questions
        clientSocket.emit('requestQuestions', {
            deviceToken: device.token,
            presentationId: presentation.id
        });

        // Wait for the response
        const receivedQuestions = await questionsPromise;

        // Verify the response
        expect(receivedQuestions).toHaveLength(2);
        // Check that both questions exist in the response, regardless of order
        const questionContents = receivedQuestions.map(q => q.content).sort();
        expect(questionContents).toEqual(['Test Question 1', 'Test Question 2'].sort());

        // Clean up test data
        await prisma.question.deleteMany({
            where: { presentationId: presentation.id }
        });
        await prisma.device.delete({
            where: { id: device.id }
        });
        await prisma.user.delete({
            where: { id: user.id }
        });
        await prisma.presentation.delete({
            where: { id: presentation.id }
        });
        await prisma.block.delete({
            where: { id: block.id }
        });
    });

    it('should handle liking and unliking questions', async () => {
        // Create test data
        const block = await prisma.block.create({
            data: {
                blockName: 'Test Block'
            }
        });

        const presentation = await prisma.presentation.create({
            data: {
                title: 'Test Presentation',
                start: new Date(),
                end: new Date(Date.now() + 3600000),
                starred: false,
                questionsRoom: 'test-room',
                blockId: block.id
            }
        });

        const user = await prisma.user.create({
            data: {
                name: 'Test User'
            }
        });

        const device = await prisma.device.create({
            data: {
                token: `test-device-token-${Date.now()}`,
                userId: user.id
            }
        });

        const question = await prisma.question.create({
            data: {
                content: 'Test Question',
                presentationId: presentation.id,
                authorId: user.id
            }
        });

        // Set up promise to handle the response
        const questionUpdatePromise = new Promise((resolve) => {
            clientSocket.on('newQuestion', (updatedQuestion) => {
                resolve(updatedQuestion);
            });
        });

        // Like the question
        clientSocket.emit('likeQuestion', {
            questionId: question.id,
            deviceToken: device.token
        });

        // Wait for the response
        const likedQuestion = await questionUpdatePromise;

        // Verify the question was liked
        expect(likedQuestion.id).toBe(question.id);
        expect(likedQuestion.likes).toBe(1);

        // Set up promise for unlike response
        const unlikeQuestionPromise = new Promise((resolve) => {
            clientSocket.on('newQuestion', (updatedQuestion) => {
                resolve(updatedQuestion);
            });
        });

        // Unlike the question
        clientSocket.emit('likeQuestion', {
            questionId: question.id,
            deviceToken: device.token
        });

        // Wait for the response
        const unlikedQuestion = await unlikeQuestionPromise;

        // Verify the question was unliked
        expect(unlikedQuestion.id).toBe(question.id);
        expect(unlikedQuestion.likes).toBe(0);

        // Clean up test data
        await prisma.question.delete({
            where: { id: question.id }
        });
        await prisma.device.delete({
            where: { id: device.id }
        });
        await prisma.user.delete({
            where: { id: user.id }
        });
        await prisma.presentation.delete({
            where: { id: presentation.id }
        });
        await prisma.block.delete({
            where: { id: block.id }
        });
    });
}); 