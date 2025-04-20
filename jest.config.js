export default {
    testEnvironment: 'node',
    testMatch: ['**/server/tests/**/*.test.js'],
    moduleFileExtensions: ['js', 'json'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    setupFilesAfterEnv: ['./server/tests/setup.js'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'server/**/*.js',
        '!server/tests/**',
        '!server/**/*.test.js',
    ],
    transformIgnorePatterns: [
        'node_modules/(?!(jest-mock)/)',
    ],
}; 