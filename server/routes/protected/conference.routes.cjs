const express = require('express');
const router = express.Router();
const multer = require('multer');
const { updateConference } = require('../../services/protected/conference.service.cjs');
const { requireAdmin } = require('../../middleware/auth.cjs');

const upload = multer();

router.put('/', requireAdmin, upload.none(), async (req, res, next) => {
    try {
        const conference = await updateConference(0, req.body);
        res.json(conference);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 