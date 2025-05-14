const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAdmin } = require('../middleware/auth.cjs');
const prisma = new PrismaClient();

// Upload image
router.post('/upload', requireAdmin, async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const image = req.files.image;
        
        // Validate file type
        if (!image.mimetype.startsWith('image/')) {
            return res.status(400).json({ error: 'File must be an image' });
        }

        // Create image record in database
        const savedImage = await prisma.image.create({
            data: {
                filename: image.name,
                mimeType: image.mimetype,
                size: image.size,
                data: image.data
            }
        });

        res.status(201).json({
            id: savedImage.id,
            filename: savedImage.filename,
            mimeType: savedImage.mimeType,
            size: savedImage.size,
            createdAt: savedImage.createdAt
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Get image by ID
router.get('/:id', async (req, res) => {
    try {
        const imageId = parseInt(req.params.id);
        if (isNaN(imageId)) {
            return res.status(400).json({ error: 'Invalid image ID' });
        }

        const image = await prisma.image.findUnique({
            where: { id: imageId }
        });

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.set('Content-Type', image.mimeType);
        res.send(image.data);
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).json({ error: 'Failed to retrieve image' });
    }
});

// Delete image by ID
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const imageId = parseInt(req.params.id);
        if (isNaN(imageId)) {
            return res.status(400).json({ error: 'Invalid image ID' });
        }

        const image = await prisma.image.delete({
            where: { id: imageId }
        });

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Image not found' });
        }
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

module.exports = router; 