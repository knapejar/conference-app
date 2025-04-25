const express = require('express');
const router = express.Router();
const multer = require('multer');
const { updateConference } = require('../../services/protected/conference.service.cjs');
const { requireAdmin } = require('../../middleware/auth.cjs');
const { saveImage, getImageUrl } = require('../../helpers/image.helper.cjs');

// Configure multer to accept a single file with field name 'welcomeImage'
const upload = multer({
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB limit
    }
}).single('welcomeImage');

router.put('/', requireAdmin, (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ error: 'Unexpected file field. Use "welcomeImage" as the field name.' });
            }
            return next(err);
        }

        try {
            if (!req.body.name || !req.body.description) {
                return res.status(400).json({ error: 'Name and description are required' });
            }

            let welcomeImage = req.body.welcomeImage;

            // If there's a file upload, store it and get the image URL
            if (req.file) {
                try {
                    const savedImage = await saveImage(req.file);
                    welcomeImage = getImageUrl(savedImage.id);
                } catch (error) {
                    return res.status(400).json({ error: error.message });
                }
            }

            const data = {
                name: req.body.name,
                description: req.body.description,
                welcomeImage: welcomeImage
            };
            
            const conference = await updateConference(0, data);
            res.json(conference);
        } catch (error) {
            next(error);
        }
    });
});

module.exports = router; 