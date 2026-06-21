import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
  ]),
  {
    rules: {
      "no-console": ["warn", { allow: ["error", "warn"] }],
      "prefer-const": "error",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
      }],
    },
  },
  {
    files: ["lib/**/*.ts", "hooks/**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": ["warn", {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      }],
      "no-magic-numbers": ["warn", {
        ignore: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 20, 22, 24, 30, 36, 40, 50, 52, 53, 60, 80, 100, 150, 300, 520, 1000, 1024, 2000, 5000],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
      }],
    },
  }
]);

export default eslintConfig;
