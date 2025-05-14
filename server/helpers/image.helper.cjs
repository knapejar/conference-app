const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const saveImage = async (file) => {
    if (!file) {
        return null;
    }

    if (!file.mimetype.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    const savedImage = await prisma.image.create({
        data: {
            filename: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            data: file.buffer
        }
    });

    return savedImage;
};

const getImageUrl = (imageId) => {
    if (!imageId) {
        return null;
    }
    const apiBase = process.env.VITE_API_BASE || 'http://localhost:3000';
    return `${apiBase}/images/${imageId}`;
};

module.exports = {
    saveImage,
    getImageUrl
}; 