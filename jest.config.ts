import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  testEnvironment: 'node',
  globalSetup: '<rootDir>/jest-global.ts',
  verbose: true,
  testSequencer: './sequencer.js',
  testTimeout: 180000,
  json: true,
  reporters: ['default', 'jest-html-reporters']
};
