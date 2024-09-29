import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ['default'],
    environment: "node",
    coverage: {
      provider: 'istanbul',
      reportsDirectory: './coverage'
    }
  },
});