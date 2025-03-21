import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { beforeAll, afterAll } from 'vitest';

const prisma = new PrismaClient();

beforeAll(async () => {
    // Drop the database if it exists
    try {
        await prisma.$executeRaw`DROP DATABASE IF EXISTS conference_app_test`;
    } catch (error) {
        console.error('Error dropping test database:', error);
    }

    // Create a new test database
    try {
        await prisma.$executeRaw`CREATE DATABASE conference_app_test`;
    } catch (error) {
        console.error('Error creating test database:', error);
    }

    // Set the DATABASE_URL to point to the test database
    process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
        /conference_app/,
        'conference_app_test'
    );

    // Run migrations and seed the test database
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    execSync('npx prisma db seed', { stdio: 'inherit' });
});

afterAll(async () => {
    // Clean up the test database
    try {
        await prisma.$executeRaw`DROP DATABASE IF EXISTS conference_app_test`;
    } catch (error) {
        console.error('Error cleaning up test database:', error);
    }
    await prisma.$disconnect();
}); 