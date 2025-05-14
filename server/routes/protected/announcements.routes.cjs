const express = require('express');
const router = express.Router();
const { createAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../../services/protected/announcements.service.cjs');
const { requireAdmin } = require('../../middleware/auth.cjs');

router.post('/', requireAdmin, async (req, res, next) => {
    try {
        const announcement = await createAnnouncement(req.body);
        res.json(announcement);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
    try {
        const announcement = await updateAnnouncement(req.params.id, req.body);
        res.json(announcement);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
    try {
        const result = await deleteAnnouncement(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 