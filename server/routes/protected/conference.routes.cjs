const express = require('express');
const router = express.Router();
const { updateConference } = require('../../services/protected/conference.service.cjs');
const { requireAdmin } = require('../../middleware/auth.cjs');

router.put('/conference', requireAdmin, async (req, res, next) => {
    try {
        const conference = await updateConference(0, req.body);
        res.json(conference);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 