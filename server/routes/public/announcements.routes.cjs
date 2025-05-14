const express = require('express');
const router = express.Router();
const { getAnnouncements } = require('../../services/public/announcements.service.cjs');

router.get('/', async (req, res, next) => {
    try {
        const announcements = await getAnnouncements();
        res.json(announcements);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 