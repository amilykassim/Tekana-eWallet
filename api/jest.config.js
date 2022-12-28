module.exports = {
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  testMatch: ['**/test/**/*.spec.ts', '**/test/**/*.e2e.spec.ts'],
  bail: true,
  clearMocks: true,
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  modulePaths: ['<rootDir>', './src', './test'],
  moduleDirectories: ['node_modules', '/src'],
  transformIgnorePatterns: ['node_modules/(?!(react-native|react-native-cookies)/)'],
  // globalSetup: `${__dirname}/test/global.setup.ts`,
  restoreMocks: true
};