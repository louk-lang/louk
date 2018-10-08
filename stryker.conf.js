module.exports = function(config) {
  config.set({
    mutator: "typescript",
    packageManager: "npm",
    reporters: ["html", "clear-text", "progress"],
    testRunner: "mocha",
    transpilers: ["typescript"],
    testFramework: "mocha",
    tsconfigFile: "tsconfig.json",
    coverageAnalysis: "perTest",
    mutate: ["src/**/*.ts"]
  });
};
