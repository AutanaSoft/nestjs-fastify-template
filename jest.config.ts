import { Config } from 'jest';

const config: Config = {
  transform: {
    '^.+\\.(t|j)s$': [
      '@swc/jest',
      {
        configFile: '.swcrc',
      },
    ],
  },
  cacheDirectory: '.temp/jest/cache',
  collectCoverage: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '\\.(e2e-spec|spec|e2e)\\.ts$',
  testEnvironment: 'node',
  clearMocks: true,
};

export default config;
