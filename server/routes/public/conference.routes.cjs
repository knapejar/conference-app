const express = require('express');
const router = express.Router();
const { getConference } = require('../../services/public/conference.service.cjs');

router.get('/', async (req, res, next) => {
    try {
        const conference = await getConference();
        res.json(conference);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 