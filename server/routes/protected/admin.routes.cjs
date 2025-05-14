const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth.cjs');

// Simple endpoint that returns 200 if admin auth succeeds
router.get('/test', requireAdmin, (req, res) => {
    res.status(200).json({ success: true });
});

module.exports = router; 