import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ✅ Ignore specific folders in ESLint v9+
  {
    ignores: [
      "node_modules",
      ".next",
      "dist",
      ".prisma",
      "app/generated",
      "components/magicui",
      "components/ui",
      "hooks",
    ],
  },

  // ✅ Use existing Next.js + TypeScript config via compat
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
