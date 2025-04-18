import express from 'express';
import { createServer } from 'http';
import { getInitialUpdate } from './initialUpdate.js';
import { debugGetTestToken } from './testPrisma.js';
import {
    getQuestions,
    createQuestion,
    likeQuestion,
    unlikeQuestion,
    deleteQuestion
} from './questions.js';
import cors from 'cors';

const app = express();
const server = createServer(app);
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/initial-update', async (req, res) => {
    try {
        await getInitialUpdate(req, res);
    } catch (error) {
        console.error('Error fetching initial update:', error);
        res.status(500).json({ error: 'Failed to fetch initial update' });
    }
});

app.get('/debug-get-test-token', async (req, res) => {
    await debugGetTestToken(req, res);
});

// GET questions for a given presentationId
app.get('/questions', async (req, res) => {
    const { presentationId } = req.query;
    if (!presentationId) {
        return res.status(400).json({ error: 'Presentation ID is required' });
    }
    try {
        const questions = await getQuestions(presentationId);
        res.json(questions);
    } catch (error) {
        console.error('Error retrieving questions:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST to create a new question
app.post('/questions', async (req, res) => {
    const { presentationId, content, author, authorToken } = req.body;
    if (!presentationId || !content) {
        return res.status(400).json({ error: 'Presentation ID and content are required' });
    }
    try {
        const questions = await createQuestion(presentationId, content, author, authorToken);
        res.json(questions);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST to like a question
app.post('/questions/:id/like', async (req, res) => {
    const questionId = req.params.id;
    if (!questionId) {
        return res.status(400).json({ error: 'Question ID is required' });
    }
    try {
        const questions = await likeQuestion(questionId);
        res.json(questions);
    } catch (error) {
        console.error('Error liking question:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST to unlike a question
app.post('/questions/:id/unlike', async (req, res) => {
    const questionId = req.params.id;
    if (!questionId) {
        return res.status(400).json({ error: 'Question ID is required' });
    }
    try {
        const questions = await unlikeQuestion(questionId);
        res.json(questions);
    } catch (error) {
        console.error('Error unliking question:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE a question
app.delete('/questions/:id', async (req, res) => {
    const questionId = req.params.id;
    if (!questionId) {
        return res.status(400).json({ error: 'Question ID is required' });
    }
    const authorToken = req.body.authorToken;
    if (!authorToken) {
        return res.status(400).json({ error: 'Author token is required' });
    }
    try {
        const questions = await deleteQuestion(questionId, authorToken);
        res.json(questions);
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});