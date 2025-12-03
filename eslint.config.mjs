import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add rules overrides
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",   // ignore unused vars
      "@typescript-eslint/no-explicit-any": "off",  // allow 'any' types
      "react-hooks/exhaustive-deps": "off",         // ignore missing deps in useEffect
    },
  },
];

export default eslintConfig;
