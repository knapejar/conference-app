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
import cors from 'cors';

const app = express();
const server = createServer(app);
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
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

// GET presentations
app.get('/presentations', async (req, res) => {
    try {
        const presentations = await getPresentations();
        res.json(presentations);
    } catch (error) {
        console.error('Error retrieving presentations:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET announcements
app.get('/announcements', async (req, res) => {
    try {
        const announcements = await getAnnouncements();
        res.json(announcements);
    } catch (error) {
        console.error('Error retrieving announcements:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET people
app.get('/people', async (req, res) => {
    try {
        const people = await getPeople();
        res.json(people);
    } catch (error) {
        console.error('Error retrieving people:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET conference
app.get('/conference', async (req, res) => {
    try {
        const conference = await getConference();
        res.json(conference);
    } catch (error) {
        console.error('Error retrieving conference:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});