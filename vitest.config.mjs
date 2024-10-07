import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ['default'],
    environment: "node",
    coverage: {
      provider: 'istanbul',
      reportsDirectory: './coverage',
      exclude: ['src/inline-src/inline-src-main.ts', ...coverageConfigDefaults.exclude]
    }
  },
});