const express = require('express');
const router = express.Router();
const { updateConference } = require('../../services/protected/conference.service.cjs');
const { requireAdmin } = require('../../middleware/auth.cjs');

router.put('/:id', requireAdmin, async (req, res, next) => {
    try {
        const conference = await updateConference(req.params.id, req.body);
        res.json(conference);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 