import { jest } from '@jest/globals';

// Mock console.error to keep test output clean
console.error = jest.fn();

// Set test timeout
jest.setTimeout(10000);

// Global mock state
global.mockState = {
    questions: [],
    presentations: []
};

// Add any global test setup here
beforeEach(() => {
    // Reset mock state before each test
    global.mockState = {
        questions: [],
        presentations: [{ id: 1 }]
    };
});

afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
    global.mockState = {
        questions: [],
        presentations: []
    };
}); 