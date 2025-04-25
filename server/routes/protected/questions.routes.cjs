const express = require('express');
const router = express.Router();
const { createQuestion, updateQuestion, deleteQuestion, getQuestions, getQuestionCount } = require('../../services/protected/questions.service.cjs');
const { requireAdmin } = require('../../middleware/auth.cjs');
const { HttpError } = require('../../utils/errors.cjs');

router.post('/', requireAdmin, async (req, res, next) => {
    try {
        const question = await createQuestion(req.body);
        res.json(question);
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
    try {
        const question = await updateQuestion(req.params.id, req.body);
        res.json(question);
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
    try {
        const result = await deleteQuestion(req.params.id);
        res.json(result);
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

router.get('/presentation/:presentationId', async (req, res, next) => {
    try {
        const { presentationId } = req.params;
        const { skip = 0, take = 100 } = req.query;
        const questions = await getQuestions(presentationId, parseInt(skip, 10), parseInt(take, 10));
        res.json(questions);
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

router.get('/presentation/:presentationId/count', async (req, res, next) => {
    try {
        const { presentationId } = req.params;
        const count = await getQuestionCount(presentationId);
        res.json(count);
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

module.exports = router; 