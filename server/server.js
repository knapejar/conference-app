import express from 'express';
import { createServer } from 'http';
import questions from './questions.cjs';
import presentations from './presentations.cjs';
import announcements from './announcements.cjs';
import people from './people.cjs';
import conference from './conference.cjs';
import errors from './errors.cjs';
import cors from 'cors';

import protectedConference from './protected/conference.cjs';
import protectedAnnouncements from './protected/announcements.cjs';
import protectedPresentations from './protected/presentations.cjs';
import protectedPeople from './protected/people.cjs';
import protectedQuestions from './protected/questions.cjs';
import auth from './middleware/auth.cjs';

const { getQuestions, createQuestion, likeQuestion, unlikeQuestion, deleteQuestion } = questions;
const { getPresentations } = presentations;
const { getAnnouncements } = announcements;
const { getPeople } = people;
const { getConference } = conference;
const { HttpError } = errors;
const { updateConference } = protectedConference;
const { createAnnouncement, updateAnnouncement, deleteAnnouncement } = protectedAnnouncements;
const { createBlock, updateBlock, deleteBlock, createPresentation, updatePresentation, deletePresentation } = protectedPresentations;
const { createPerson, updatePerson, deletePerson } = protectedPeople;
const { createQuestion: adminCreateQuestion, updateQuestion, deleteQuestion: adminDeleteQuestion } = protectedQuestions;
const { requireAdmin } = auth;

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

// Public routes
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

// Protected routes
app.put('/conference/:id', requireAdmin, async (req, res, next) => {
    try {
        const conference = await updateConference(req.params.id, req.body);
        res.json(conference);
    } catch (error) {
        next(error);
    }
});

app.post('/announcements', requireAdmin, async (req, res, next) => {
    try {
        const announcement = await createAnnouncement(req.body);
        res.json(announcement);
    } catch (error) {
        next(error);
    }
});

app.put('/announcements/:id', requireAdmin, async (req, res, next) => {
    try {
        const announcement = await updateAnnouncement(req.params.id, req.body);
        res.json(announcement);
    } catch (error) {
        next(error);
    }
});

app.delete('/announcements/:id', requireAdmin, async (req, res, next) => {
    try {
        const result = await deleteAnnouncement(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

app.post('/blocks', requireAdmin, async (req, res, next) => {
    try {
        const block = await createBlock(req.body);
        res.json(block);
    } catch (error) {
        next(error);
    }
});

app.put('/blocks/:id', requireAdmin, async (req, res, next) => {
    try {
        const block = await updateBlock(req.params.id, req.body);
        res.json(block);
    } catch (error) {
        next(error);
    }
});

app.delete('/blocks/:id', requireAdmin, async (req, res, next) => {
    try {
        const result = await deleteBlock(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

app.post('/presentations', requireAdmin, async (req, res, next) => {
    try {
        const presentation = await createPresentation(req.body);
        res.json(presentation);
    } catch (error) {
        next(error);
    }
});

app.put('/presentations/:id', requireAdmin, async (req, res, next) => {
    try {
        const presentation = await updatePresentation(req.params.id, req.body);
        res.json(presentation);
    } catch (error) {
        next(error);
    }
});

app.delete('/presentations/:id', requireAdmin, async (req, res, next) => {
    try {
        const result = await deletePresentation(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

app.post('/people', requireAdmin, async (req, res, next) => {
    try {
        const person = await createPerson(req.body);
        res.json(person);
    } catch (error) {
        next(error);
    }
});

app.put('/people/:id', requireAdmin, async (req, res, next) => {
    try {
        const person = await updatePerson(req.params.id, req.body);
        res.json(person);
    } catch (error) {
        next(error);
    }
});

app.delete('/people/:id', requireAdmin, async (req, res, next) => {
    try {
        const result = await deletePerson(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

app.post('/admin/questions', requireAdmin, async (req, res, next) => {
    try {
        const question = await adminCreateQuestion(req.body);
        res.json(question);
    } catch (error) {
        next(error);
    }
});

app.put('/admin/questions/:id', requireAdmin, async (req, res, next) => {
    try {
        const question = await updateQuestion(req.params.id, req.body);
        res.json(question);
    } catch (error) {
        next(error);
    }
});

app.delete('/admin/questions/:id', requireAdmin, async (req, res, next) => {
    try {
        const result = await adminDeleteQuestion(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});