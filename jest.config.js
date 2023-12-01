module.exports = {
    moduleFileExtensions: ['js', 'vue'],
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.vue$': 'vue3-jest',
      '^.+\\.js$': 'babel-jest'
    },
    testMatch: [
      '**/tests/**/*.spec.js'
    ]
  };
  