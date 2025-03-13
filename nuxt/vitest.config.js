import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",

    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["**/*.ts", "**/*.vue"],
      exclude: [
        "node_modules",
        "dist",
        "public",
        "**/*.config.ts",
        "**/*.spec.ts",
        "**/ui/**",
        "**/lib/**",
        "**/utils/**",
        "**/test/**",
        "**/coverage/**",
      ],
    },
  },
});
