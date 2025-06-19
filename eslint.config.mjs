import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactNative from "eslint-plugin-react-native";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(["**/node_modules/", "**/*.config.js"]),
  {
    extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react/recommended"),

    plugins: {
      "@typescript-eslint": typescriptEslint,
      react,
      "react-native": reactNative,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "no-fallthrough": "off",
    },

    ignores: ["node_modules", "*.config.ts"],
  },
]);
