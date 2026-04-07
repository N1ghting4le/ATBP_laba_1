import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const presetConfig = createDefaultEsmPreset();

const config: Config = {
  ...presetConfig,
  testMatch: ["**/tests/**/*.test.ts"],
  testEnvironment: "allure-jest/node",
};

export default config;
