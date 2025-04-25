const express = require('express');
const router = express.Router();
const multer = require('multer');
const { updateConference } = require('../../services/protected/conference.service.cjs');
const { requireAdmin } = require('../../middleware/auth.cjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configure multer to accept a single file with field name 'welcomeImage'
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
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
                if (!req.file.mimetype.startsWith('image/')) {
                    return res.status(400).json({ error: 'File must be an image' });
                }

                const savedImage = await prisma.image.create({
                    data: {
                        filename: req.file.originalname,
                        mimeType: req.file.mimetype,
                        size: req.file.size,
                        data: req.file.buffer
                    }
                });

                const apiBase = process.env.VITE_API_BASE || 'http://localhost:3000'; // TODO: Move this out to helper func
                welcomeImage = `${apiBase}/images/${savedImage.id}`;
            }

            const data = {
                name: req.body.name,
                description: req.body.description,
                welcomeImage: welcomeImage
            };
            console.log(data);
            
            const conference = await updateConference(0, data);
            res.json(conference);
        } catch (error) {
            next(error);
        }
    });
});

module.exports = router; 