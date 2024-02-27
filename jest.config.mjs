import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  testTimeout: 30000,
  globalTeardown: './jest.teardown.ts',
  globalSetup: './jest.setup.ts',
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: [
    '<rootDir>/src/lib/__mocks__/singleton.ts',
    '<rootDir>/src/lib/__mocks__/mockedS3.ts',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
