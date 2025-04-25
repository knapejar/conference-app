const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

module.exports = router; 