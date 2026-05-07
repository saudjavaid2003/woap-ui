import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // This section allows you to customize rules
    rules: {
      // Disables the warning for using 'any'
      '@typescript-eslint/no-explicit-any': 'off', 
      // Disables the warning for empty objects/types
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  // Global ignores must be in their own configuration object or via globalIgnores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;