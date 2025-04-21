const request = require('supertest');
const express = require('express');
const adminRouter = require('../routes/protected/admin.routes.cjs');
const crypto = require('crypto');

// Create test app
const app = express();
app.use(express.json());
app.use('/admin', adminRouter);

// Test password and its hash
const TEST_PASSWORD = 'test_admin_password';
const TEST_PASSWORD_HASH = crypto.createHash('sha256').update(TEST_PASSWORD).digest('hex');

describe('Admin Routes Authentication', () => {
    // Mock environment variable for testing
    beforeAll(() => {
        process.env.ADMIN_PASSWORD = TEST_PASSWORD;
    });

    test('should allow access with correct password', async () => {
        const response = await request(app)
            .get('/admin/test')
            .set('Authorization', `Bearer ${TEST_PASSWORD_HASH}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    });

    test('should deny access with incorrect password', async () => {
        const wrongPassword = 'wrong_password';
        const wrongPasswordHash = crypto.createHash('sha256').update(wrongPassword).digest('hex');

        const response = await request(app)
            .get('/admin/test')
            .set('Authorization', `Bearer ${wrongPasswordHash}`);

        expect(response.status).toBe(403);
    });

    test('should deny access without authorization header', async () => {
        const response = await request(app)
            .get('/admin/test');

        expect(response.status).toBe(401);
    });

    test('should deny access with invalid authorization format', async () => {
        const response = await request(app)
            .get('/admin/test')
            .set('Authorization', 'InvalidFormat');

        expect(response.status).toBe(401);
    });
}); 