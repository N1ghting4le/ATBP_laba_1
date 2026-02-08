import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const presetConfig = createDefaultEsmPreset();

const config: Config = {
  ...presetConfig,
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverage: true,
  coverageProvider: 'v8',
};

export default config;
