import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'http';
import { Server } from 'socket.io';
import io from 'socket.io-client';
import express from 'express';
import { registerQuestions } from '../server/questions.js';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import cors from 'cors';

const prisma = new PrismaClient();
let ioServer;
let serverSocket;
let clientSocket;
let httpServer;
let app;
const TEST_PORT = 3001;

describe('Server Tests', () => {
    beforeAll(async () => {
        return new Promise((resolve) => {
            app = express();
            app.use(cors());
            app.use(express.json());

            // Add routes
            app.get('/initial-update', async (req, res) => {
                const deviceToken = req.query.deviceToken;
                if (!deviceToken) {
                    return res.status(400).json({ error: 'Device token is required' });
                }
                
                try {
                    // Mock initial update response
                    const user = await prisma.user.findFirst({
                        where: {
                            devices: {
                                some: { token: deviceToken }
                            }
                        },
                        include: {
                            starredPresentations: true
                        }
                    });

                    if (!user) {
                        return res.status(404).json({ error: 'User not found' });
                    }

                    res.json({
                        user,
                        starredPresentations: user.starredPresentations
                    });
                } catch (error) {
                    console.error('Error fetching initial update:', error);
                    res.status(500).json({ error: 'Failed to fetch initial update' });
                }
            });

            app.get('/debug-get-test-token', async (req, res) => {
                try {
                    const device = await prisma.device.findFirst();
                    res.json({ token: device.token });
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            });

            httpServer = createServer(app);
            ioServer = new Server(httpServer);
            
            // Set up socket server
            ioServer.on('connection', (socket) => {
                serverSocket = socket;
                registerQuestions(app, ioServer, socket);

                socket.on('disconnect', () => {
                    console.log('User disconnected:', socket.id);
                });
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

    describe('HTTP Endpoints', () => {
        let testUser;
        let testDevice;

        beforeAll(async () => {
            // Create test user and device for HTTP endpoint tests
            testUser = await prisma.user.create({
                data: {
                    name: 'Test User'
                }
            });

            testDevice = await prisma.device.create({
                data: {
                    token: `test-device-token-http-${Date.now()}`,
                    userId: testUser.id
                }
            });
        });

        afterAll(async () => {
            // Clean up test data
            await prisma.device.delete({
                where: { id: testDevice.id }
            });
            await prisma.user.delete({
                where: { id: testUser.id }
            });
        });

        it('should return 400 when device token is missing in initial-update', async () => {
            const response = await axios.get(`http://localhost:${TEST_PORT}/initial-update`, {
                validateStatus: () => true
            });
            expect(response.status).toBe(400);
            expect(response.data).toEqual({ error: 'Device token is required' });
        });

        it('should return user data when device token is valid in initial-update', async () => {
            const response = await axios.get(`http://localhost:${TEST_PORT}/initial-update`, {
                params: {
                    deviceToken: testDevice.token
                }
            });
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('user');
            expect(response.data.user.id).toBe(testUser.id);
            expect(response.data.user.name).toBe(testUser.name);
            expect(response.data).toHaveProperty('starredPresentations');
            expect(Array.isArray(response.data.starredPresentations)).toBe(true);
        });

        it('should return a test token from debug-get-test-token', async () => {
            const response = await axios.get(`http://localhost:${TEST_PORT}/debug-get-test-token`);
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('token');
            expect(typeof response.data.token).toBe('string');
        });
    });

    describe('Socket Connection', () => {
        it('should handle socket connection and disconnection', () => {
            return new Promise((resolve) => {
                const testSocket = io(`http://localhost:${TEST_PORT}`);
                
                testSocket.on('connect', () => {
                    expect(testSocket.connected).toBe(true);
                    
                    // Test disconnection
                    testSocket.disconnect();
                });

                testSocket.on('disconnect', () => {
                    expect(testSocket.connected).toBe(false);
                    resolve();
                });
            });
        });
    });

    describe('Questions Functionality', () => {
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

            // Test 1: Like a question
            const questionUpdatePromise = new Promise((resolve) => {
                const handler = (updatedQuestion) => {
                    clientSocket.off('newQuestion', handler);
                    resolve(updatedQuestion);
                };
                clientSocket.on('newQuestion', handler);
            });

            clientSocket.emit('likeQuestion', {
                questionId: question.id,
                deviceToken: device.token
            });

            const likedQuestion = await questionUpdatePromise;
            expect(likedQuestion.id).toBe(question.id);
            expect(likedQuestion.likes).toBe(1);

            // Test 2: Like the same question again (should unlike)
            const unlikeQuestionPromise = new Promise((resolve) => {
                const handler = (updatedQuestion) => {
                    clientSocket.off('newQuestion', handler);
                    resolve(updatedQuestion);
                };
                clientSocket.on('newQuestion', handler);
            });

            clientSocket.emit('likeQuestion', {
                questionId: question.id,
                deviceToken: device.token
            });

            const unlikedQuestion = await unlikeQuestionPromise;
            expect(unlikedQuestion.id).toBe(question.id);
            expect(unlikedQuestion.likes).toBe(0);

            // Test 3: Like with invalid device token
            let receivedInvalidTokenUpdate = false;
            const invalidTokenPromise = new Promise((resolve) => {
                const timeout = setTimeout(() => resolve(), 100);
                const handler = (updatedQuestion) => {
                    clearTimeout(timeout);
                    receivedInvalidTokenUpdate = true;
                    clientSocket.off('newQuestion', handler);
                    resolve();
                };
                clientSocket.on('newQuestion', handler);
            });

            clientSocket.emit('likeQuestion', {
                questionId: question.id,
                deviceToken: 'invalid-token'
            });

            await invalidTokenPromise;
            expect(receivedInvalidTokenUpdate).toBe(false);

            // Test 4: Like with invalid question ID
            let receivedInvalidQuestionUpdate = false;
            const invalidQuestionPromise = new Promise((resolve) => {
                const timeout = setTimeout(() => resolve(), 100);
                const handler = (updatedQuestion) => {
                    clearTimeout(timeout);
                    receivedInvalidQuestionUpdate = true;
                    clientSocket.off('newQuestion', handler);
                    resolve();
                };
                clientSocket.on('newQuestion', handler);
            });

            clientSocket.emit('likeQuestion', {
                questionId: 999999,
                deviceToken: device.token
            });

            await invalidQuestionPromise;
            expect(receivedInvalidQuestionUpdate).toBe(false);

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
}); 