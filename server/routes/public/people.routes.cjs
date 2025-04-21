const express = require('express');
const router = express.Router();
const { getPeople } = require('../../services/public/people.service.cjs');

router.get('/', async (req, res, next) => {
    try {
        const people = await getPeople();
        res.json(people);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 