const { test, expect } = require('@playwright/test');
const crypto = require('crypto');

test('Upload and retrieve image', async ({ request }) => {
    // Compute admin token hash
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_admin_password';
    const ADMIN_PASSWORD_HASH = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest('hex');

    // Create a test image file
    const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

    // Upload image
    const uploadResponse = await request.post('/api/images/upload', {
        headers: {
            'Authorization': `Bearer ${ADMIN_PASSWORD_HASH}`
        },
        multipart: {
            image: {
                name: 'test.png',
                mimeType: 'image/png',
                buffer: testImage
            }
        }
    });

    expect(uploadResponse.ok()).toBeTruthy();
    const uploadResult = await uploadResponse.json();
    expect(uploadResult).toHaveProperty('id');
    expect(uploadResult.filename).toBe('test.png');
    expect(uploadResult.mimeType).toBe('image/png');

    // Retrieve image
    const getResponse = await request.get(`/api/images/${uploadResult.id}`);
    expect(getResponse.ok()).toBeTruthy();
    expect(getResponse.headers()['content-type']).toBe('image/png');
}); 