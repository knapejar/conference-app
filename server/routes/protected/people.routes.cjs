const express = require('express');
const router = express.Router();
const { createPerson, updatePerson, deletePerson } = require('../../services/protected/people.service.cjs');
const { requireAdmin } = require('../../middleware/auth.cjs');

router.post('/', requireAdmin, async (req, res, next) => {
    try {
        const person = await createPerson(req.body);
        res.json(person);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
    try {
        const person = await updatePerson(req.params.id, req.body);
        res.json(person);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
    try {
        const result = await deletePerson(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 