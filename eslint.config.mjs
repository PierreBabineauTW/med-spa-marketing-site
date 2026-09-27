import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // The UPKEEP clone is a faithful port of a hand-written static site: its nav,
  // footer and cards use plain <a> elements because the ported stylesheet targets
  // bare anchors and most linked routes are not part of this single-page clone.
  // next/link would render an identical <a> here, so silence the advisory rule for
  // the clone's component tree only.
  {
    files: ["src/components/sites/**"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
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
