module.exports = function() {
  return {
    files: [
      'src/**/*.ts',
      'dist/**/*.js',
      'test/config.js',
      'test/samples/*.louk',
      'README.md'
    ],
    tests: [
      'test/**/*.js'
    ],
    env: {
      type: 'node'
    },
    debug: true
  };
};
