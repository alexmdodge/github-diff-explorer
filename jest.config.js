module.exports = {
  preset: 'ts-jest',
  verbose: true,
  collectCoverage: true,
  testEnvironment: 'jest-environment-jsdom-global',
  coverageDirectory: './coverage',
  modulePathIgnorePatterns: [
    '/helpers/',
    '/mock-elements/'
  ]
};