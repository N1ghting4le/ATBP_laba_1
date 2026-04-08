module.exports = {
  default: `--require-module ts-node/register --require steps/**/*.ts features/**/*.feature --format json:allure-results/cucumber.json`,
};
