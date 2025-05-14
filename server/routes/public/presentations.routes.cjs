const express = require('express');
const router = express.Router();
const { getPresentations } = require('../../services/public/presentations.service.cjs');

router.get('/', async (req, res, next) => {
    try {
        const presentations = await getPresentations();
        res.json(presentations);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 