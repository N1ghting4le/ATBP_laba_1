module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js", "**/tests/**/*.test.ts"],
  reporters: [
    "default",
    [
      "allure-jest",
      {
        resultsDir: "./allure-results",
        cleanResultsDir: true,
      },
    ],
  ],
};
