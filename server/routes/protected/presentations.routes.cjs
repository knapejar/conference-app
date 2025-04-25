const express = require('express');
const router = express.Router();
const { createBlock, updateBlock, deleteBlock, createPresentation, updatePresentation, deletePresentation, getPresentations } = require('../../services/protected/presentations.service.cjs');
const { requireAdmin } = require('../../middleware/auth.cjs');

router.post('/blocks', requireAdmin, async (req, res, next) => {
    try {
        const block = await createBlock(req.body);
        res.json(block);
    } catch (error) {
        next(error);
    }
});

router.put('/blocks/:id', requireAdmin, async (req, res, next) => {
    try {
        const block = await updateBlock(req.params.id, req.body);
        res.json(block);
    } catch (error) {
        next(error);
    }
});

router.delete('/blocks/:id', requireAdmin, async (req, res, next) => {
    try {
        const result = await deleteBlock(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/', requireAdmin, async (req, res, next) => {
    try {
        const presentation = await createPresentation(req.body);
        res.json(presentation);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
    try {
        const presentation = await updatePresentation(req.params.id, req.body);
        res.json(presentation);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
    try {
        const result = await deletePresentation(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.get('/', requireAdmin, async (req, res, next) => {
    try {
        const presentations = await getPresentations();
        res.json(presentations);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 