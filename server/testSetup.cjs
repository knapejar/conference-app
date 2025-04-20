const mockPrismaClient = {
    question: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    presentation: {
        findUnique: jest.fn(),
    },
    conference: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    },
};

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => mockPrismaClient)
}));

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});

// Export the mocked Prisma client for use in tests
module.exports = { prisma: mockPrismaClient }; 