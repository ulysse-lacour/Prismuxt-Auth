import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([
  {
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parser: {
          ts: typescriptParser,
        },
      },
    },
  },

  { ignores: ["**/node_modules/**", "**/.nuxt/**", "**/.output/**", "**/app/components/ui/**"] },

  {
    rules: {
      "no-console": "off",
      "prettier/prettier": "off",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "vue/multi-word-component-names": "off",
      semi: "off",
      "vue/html-self-closing": "off",
      "vue/v-on-style": "off",
      "vue/no-v-html": "off",
      "vue/require-default-prop": "off",
    },
  },
]);
