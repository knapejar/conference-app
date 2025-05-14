const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

// Helper function to generate ETag
const generateETag = (data) => {
    return crypto.createHash('md5').update(data).digest('hex');
};

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

        // Generate ETag from image data
        const etag = generateETag(image.data);
        
        // Check if the client has a cached version
        if (req.headers['if-none-match'] === etag) {
            return res.status(304).end(); // Not Modified
        }

        // Set caching headers
        res.set({
            'Content-Type': image.mimeType,
            'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
            'ETag': etag,
            'Last-Modified': image.updatedAt || image.createdAt,
            'Vary': 'Accept-Encoding'
        });

        res.send(image.data);
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).json({ error: 'Failed to retrieve image' });
    }
});

module.exports = router; 