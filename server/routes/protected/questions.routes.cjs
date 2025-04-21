const express = require('express');
const router = express.Router();
const { createQuestion, updateQuestion, deleteQuestion } = require('../../services/protected/questions.service.cjs');
const { requireAdmin } = require('../../middleware/auth.cjs');

router.post('/', requireAdmin, async (req, res, next) => {
    try {
        const question = await createQuestion(req.body);
        res.json(question);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
    try {
        const question = await updateQuestion(req.params.id, req.body);
        res.json(question);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
    try {
        const result = await deleteQuestion(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 