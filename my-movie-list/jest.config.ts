export { };
export default {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts',
    '!**/vendor/**'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
 
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage",
    "package.json",
    "package-lock.json",
    "reportWebVitals.ts",
    "setupTests.ts",
    "index.tsx"
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testMatch: ['**/*.test.ts?(x)', '**/*.spec.ts?(x)'],
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
}