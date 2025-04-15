export default {
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!**/vendor/**'
    ],
    coverageDirectory: 'coverage',
  
    testEnvironment: 'jsdom',
  
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest' // safer regex for file matching
    },
  
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/coverage/',
      'package.json',
      'package-lock.json',
      'reportWebVitals.ts',
      'setupTests.ts',
      'index.tsx'
    ],
  
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.ts',
      '^@/(.*)$': '<rootDir>/src/$1'
    },
  
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/*.{test,spec}.[jt]s?(x)'],
  
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
  