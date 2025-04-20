import express from 'express';
import { createServer } from 'http';
import { debugGetTestToken } from './testPrisma.js';
import {
    getQuestions,
    createQuestion,
    likeQuestion,
    unlikeQuestion,
    deleteQuestion
} from './questions.js';
import { getPresentations } from './presentations.js';
import { getAnnouncements } from './announcements.js';
import { getPeople } from './people.js';
import { getConference } from './conference.js';
import { HttpError } from './errors.js';
import cors from 'cors';

const app = express();
const server = createServer(app);
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/debug-get-test-token', async (req, res) => {
    await debugGetTestToken(req, res);
});

// GET questions for a given presentationId
app.get('/questions', async (req, res, next) => {
    const { presentationId } = req.query;
    if (!presentationId) {
        return res.status(400).json({ error: 'Presentation ID is required' });
    }
    try {
        const questions = await getQuestions(presentationId);
        res.json(questions);
    } catch (error) {
        next(error);
    }
});

// POST to create a new question
app.post('/questions', async (req, res, next) => {
    const { presentationId, content, author, authorToken } = req.body;
    if (!presentationId || !content) {
        return res.status(400).json({ error: 'Presentation ID and content are required' });
    }
    try {
        const questions = await createQuestion(presentationId, content, author, authorToken);
        res.json(questions);
    } catch (error) {
        next(error);
    }
});

// POST to like a question
app.post('/questions/:id/like', async (req, res, next) => {
    const questionId = req.params.id;
    if (!questionId) {
        return res.status(400).json({ error: 'Question ID is required' });
    }
    try {
        const questions = await likeQuestion(questionId);
        res.json(questions);
    } catch (error) {
        next(error);
    }
});

// POST to unlike a question
app.post('/questions/:id/unlike', async (req, res, next) => {
    const questionId = req.params.id;
    if (!questionId) {
        return res.status(400).json({ error: 'Question ID is required' });
    }
    try {
        const questions = await unlikeQuestion(questionId);
        res.json(questions);
    } catch (error) {
        next(error);
    }
});

// DELETE a question
app.delete('/questions/:id', async (req, res, next) => {
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
        next(error);
    }
});

// GET presentations
app.get('/presentations', async (req, res, next) => {
    try {
        const presentations = await getPresentations();
        res.json(presentations);
    } catch (error) {
        next(error);
    }
});

// GET announcements
app.get('/announcements', async (req, res, next) => {
    try {
        const announcements = await getAnnouncements();
        res.json(announcements);
    } catch (error) {
        next(error);
    }
});

// GET people
app.get('/people', async (req, res, next) => {
    try {
        const people = await getPeople();
        res.json(people);
    } catch (error) {
        next(error);
    }
});

// GET conference
app.get('/conference', async (req, res, next) => {
    try {
        const conference = await getConference();
        res.json(conference);
    } catch (error) {
        next(error);
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});