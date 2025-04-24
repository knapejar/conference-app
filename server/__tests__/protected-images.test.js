const request = require('supertest');
const express = require('express');
const imagesRouter = require('../routes/images.cjs');
const crypto = require('crypto');
const fileUpload = require('express-fileupload');

// Create test app
const app = express();
app.use(express.json());
app.use(fileUpload());
app.use('/api/images', imagesRouter);

// Test password and its hash
const TEST_PASSWORD = 'test_admin_password';
const TEST_PASSWORD_HASH = crypto.createHash('sha256').update(TEST_PASSWORD).digest('hex');

describe('Image Upload and Retrieval', () => {
    // Mock environment variable for testing
    beforeAll(() => {
        process.env.ADMIN_PASSWORD = TEST_PASSWORD;
    });

    test('should upload image with correct admin password', async () => {
        // Create a test image buffer (1x1 pixel PNG)
        const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

        const response = await request(app)
            .post('/api/images/upload')
            .set('Authorization', `Bearer ${TEST_PASSWORD_HASH}`)
            .attach('image', testImage, 'test.png');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.filename).toBe('test.png');
        expect(response.body.mimeType).toBe('image/png');
        expect(response.body.size).toBe(testImage.length);
    });

    test('should deny upload without authorization header', async () => {
        const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

        const response = await request(app)
            .post('/api/images/upload')
            .attach('image', testImage, 'test.png');

        expect(response.status).toBe(401);
    });

    test('should deny upload with incorrect password', async () => {
        const wrongPassword = 'wrong_password';
        const wrongPasswordHash = crypto.createHash('sha256').update(wrongPassword).digest('hex');
        const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

        const response = await request(app)
            .post('/api/images/upload')
            .set('Authorization', `Bearer ${wrongPasswordHash}`)
            .attach('image', testImage, 'test.png');

        expect(response.status).toBe(403);
    });

    test('should retrieve uploaded image', async () => {
        // First upload an image
        const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
        
        const uploadResponse = await request(app)
            .post('/api/images/upload')
            .set('Authorization', `Bearer ${TEST_PASSWORD_HASH}`)
            .attach('image', testImage, 'test.png');

        const imageId = uploadResponse.body.id;

        // Then retrieve it
        const getResponse = await request(app)
            .get(`/api/images/${imageId}`);

        expect(getResponse.status).toBe(200);
        expect(getResponse.headers['content-type']).toBe('image/png');
        expect(Buffer.from(getResponse.body).equals(testImage)).toBe(true);
    });

    test('should return 404 for non-existent image', async () => {
        const response = await request(app)
            .get('/api/images/999999');

        expect(response.status).toBe(404);
    });

    test('should delete image with correct admin password', async () => {
        // First upload an image
        const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
        
        const uploadResponse = await request(app)
            .post('/api/images/upload')
            .set('Authorization', `Bearer ${TEST_PASSWORD_HASH}`)
            .attach('image', testImage, 'test.png');

        const imageId = uploadResponse.body.id;

        // Delete the image
        const deleteResponse = await request(app)
            .delete(`/api/images/${imageId}`)
            .set('Authorization', `Bearer ${TEST_PASSWORD_HASH}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body).toHaveProperty('message', 'Image deleted successfully');

        // Verify image is deleted
        const getResponse = await request(app)
            .get(`/api/images/${imageId}`);
        expect(getResponse.status).toBe(404);
    });

    test('should deny delete without authorization header', async () => {
        const response = await request(app)
            .delete('/api/images/1');

        expect(response.status).toBe(401);
    });

    test('should deny delete with incorrect password', async () => {
        const wrongPassword = 'wrong_password';
        const wrongPasswordHash = crypto.createHash('sha256').update(wrongPassword).digest('hex');

        const response = await request(app)
            .delete('/api/images/1')
            .set('Authorization', `Bearer ${wrongPasswordHash}`);

        expect(response.status).toBe(403);
    });

    test('should return 404 when deleting non-existent image', async () => {
        const response = await request(app)
            .delete('/api/images/999999')
            .set('Authorization', `Bearer ${TEST_PASSWORD_HASH}`);

        expect(response.status).toBe(404);
    });
}); 