import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import _import from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";
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
  allConfig: js.configs.all
});

export default [{
  ignores: [
    "**/dist",
    "**/node_modules",
    "**/node_modules/",
    "**/.DS_Store",
    "**/dist",
    "**/dist-ssr",
    "**/dev-dist",
    "**/*.local",
    "**/cypress*",
    "**/vite.config.mts",
    "**/stats.html",
  ],
}, ...compat.extends(
  "eslint:recommended",
  "plugin:@typescript-eslint/recommended",
  "plugin:@typescript-eslint/eslint-recommended",
  "plugin:jsx-a11y/recommended",
  "plugin:prettier/recommended",
), {
  plugins: {
    "@typescript-eslint": typescriptEslint,
    react,
    import: fixupPluginRules(_import),
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },

    parser: tsParser,
  },

  settings: {
    react: {
      version: "detect",
    },
  },

  rules: {
    "jsx-a11y/anchor-is-valid": "warn",
    "jsx-a11y/no-redundant-roles": "warn",

    "import/order": ["warn", {
      groups: [["builtin", "external"], "parent", "sibling", "index"],

      pathGroups: [{
        pattern: "react",
        group: "external",
        position: "before",
      }],

      pathGroupsExcludedImportTypes: ["builtin"],
      "newlines-between": "always",

      alphabetize: {
        order: "asc",
        caseInsensitive: true,
      },
    }],

    "@typescript-eslint/no-unsafe-function-type": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",

    "@typescript-eslint/no-unused-vars": ["warn", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    }],

    "no-unused-vars": ["warn", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    }],

    "space-before-function-paren": "off",
  },
}];
