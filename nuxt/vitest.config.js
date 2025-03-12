import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      enabled: true,
      reporter: ["text"],
      exclude: [
        "node_modules",
        "dist",
        "public",
        "i18n",
        "**/assets",
        "lib",
        "plugins",
        "prisma",
        "types",
        "eslint.config.mjs",
        "nuxt.config.ts",
        "tailwind.config.js",
        "vitest.config.js",
        "i18n.config.ts",
        "**/.nuxt",
        "**/.output",
        "**/.vscode",
        "**/.git",
        "**/.github",
        "**/.husky",
        "**/.pnpm-store",
        "**/ui/**",
      ],
    },
  },
});
