import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import errors from './utils/errors.cjs';

// Import routes
import publicQuestionsRoutes from './routes/public/questions.routes.cjs';
import publicPresentationsRoutes from './routes/public/presentations.routes.cjs';
import publicAnnouncementsRoutes from './routes/public/announcements.routes.cjs';
import publicPeopleRoutes from './routes/public/people.routes.cjs';
import publicConferenceRoutes from './routes/public/conference.routes.cjs';
import publicImagesRoutes from './routes/public/images.routes.cjs';

import protectedConferenceRoutes from './routes/protected/conference.routes.cjs';
import protectedAnnouncementsRoutes from './routes/protected/announcements.routes.cjs';
import protectedPresentationsRoutes from './routes/protected/presentations.routes.cjs';
import protectedPeopleRoutes from './routes/protected/people.routes.cjs';
import protectedQuestionsRoutes from './routes/protected/questions.routes.cjs';
import adminRoutes from './routes/protected/admin.routes.cjs';

const { HttpError } = errors;

const app = express();
const server = createServer(app);
app.use(cors());
app.use(express.json());

// Public routes
app.use('/questions', publicQuestionsRoutes);
app.use('/presentations', publicPresentationsRoutes);
app.use('/announcements', publicAnnouncementsRoutes);
app.use('/people', publicPeopleRoutes);
app.use('/conference', publicConferenceRoutes);
app.use('/images', publicImagesRoutes);

// Protected routes
app.use('/admin/conference', protectedConferenceRoutes);
app.use('/admin/announcements', protectedAnnouncementsRoutes);
app.use('/admin/presentations', protectedPresentationsRoutes);
app.use('/admin/people', protectedPeopleRoutes);
app.use('/admin/questions', protectedQuestionsRoutes);
app.use('/admin', adminRoutes);

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

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});