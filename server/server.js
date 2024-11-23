import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getQuestions, postQuestion } from './questions.js';
import { getInitialUpdate } from './initialUpdate.js';
import { debugGetTestToken } from './debug.js';
import cors from 'cors';

const app = express();
const server = createServer(app);
app.use(cors());
const io = new Server(server);

app.use(express.json());

app.get('/presentations/:id/questions', getQuestions);
app.post('/questions', postQuestion);
app.get('/initial-update', async (req, res) => {
    const deviceToken = req.query.deviceToken;
    if (!deviceToken) {
        return res.status(400).json({ error: 'Device token is required' });
    }
    
    try {
        await getInitialUpdate(req, res, deviceToken);
    } catch (error) {
        console.error('Error fetching initial update:', error);
        res.status(500).json({ error: 'Failed to fetch initial update' });
    }
});
app.get('/debug-get-test-token', async(req, res) => {
    await debugGetTestToken(req, res);
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});