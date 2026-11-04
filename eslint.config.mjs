import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Custom overrides for non-React render functions
  {
    // Matches any TypeScript file inside the battle feature folder or its subdirectories
    files: ["app/features/battle/**/*.ts"],
    plugins: {
      react: reactPlugin, // Explicitly link the plugin namespace
    },
    rules: {
      "react/require-render-return": "off", 
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
