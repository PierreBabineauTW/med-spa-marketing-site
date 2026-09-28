import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // This site is a faithful port of a hand-written static site: its nav, footer,
  // cards and subpages use plain <a> elements because the ported stylesheet
  // targets bare anchors. next/link would render an identical <a> here, so the
  // advisory rule is silenced across the site's own code only.
  {
    files: ["src/components/sites/**", "src/app/**"],
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
    // docs/research/** holds the reference site's own CSS, JS and HTML captured
    // verbatim as evidence. It is a record of someone else's code, kept byte-
    // exact on purpose, so it is neither ours to lint nor ours to fix.
    "docs/research/**",
  ]),
]);

export default eslintConfig;
