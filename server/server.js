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

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/debug-get-test-token', async (req, res) => {
    await debugGetTestToken(req, res);
});

// Questions routes
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

// Other routes
app.get('/presentations', async (req, res, next) => {
    try {
        const presentations = await getPresentations();
        res.json(presentations);
    } catch (error) {
        next(error);
    }
});

app.get('/announcements', async (req, res, next) => {
    try {
        const announcements = await getAnnouncements();
        res.json(announcements);
    } catch (error) {
        next(error);
    }
});

app.get('/people', async (req, res, next) => {
    try {
        const people = await getPeople();
        res.json(people);
    } catch (error) {
        next(error);
    }
});

app.get('/conference', async (req, res, next) => {
    try {
        const conference = await getConference();
        res.json(conference);
    } catch (error) {
        next(error);
    }
});

// Error handling middleware - must be after all routes
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

// Only start the server if this file is run directly
if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export { app };