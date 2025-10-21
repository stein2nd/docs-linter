import fs from "node:fs";
import path from "node:path";

const targetPath = path.resolve("./.npmignore");

const content = `# =====================================================================
# npm package ignore rules for docs-linter
# Optimized for: Node + Vite + TypeScript + textlint
# ---------------------------------------------------------------------
# Purpose:
#  - Prevent gitignore-fallback warning
#  - Keep only necessary runtime files (dist/, package.json, README.md)
#  - Exclude development, build, and test artifacts
# =====================================================================

node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-lock.yaml
package-lock.json

dist/
.cache/
.temp/
tmp/
coverage/
.vite/
vite.config.ts.timestamp*

src/
assets/
scripts/
examples/
test/
tests/
__tests__/
__mocks__/
docs/
notes/

*.config.js
*.config.cjs
*.config.mjs
*.config.ts
*.rc
*.rc.json
*.rc.js
*.rc.ts
tsconfig.json
tsconfig.*.json
eslint.*
.prettier*
.stylelint*
babel.*
.rollup.*
webpack.*
.postcss*
.jest*
.editorconfig
.gitignore
.gitattributes
.npmignore
.gitmodules
.env
.env.*
.DS_Store

.github/
.gitlab/
.vscode/
.idea/
.ci/
.circleci/
.husky/
.lintstagedrc*
commitlint.*

!dist/
!package.json
!README.md
!LICENSE*
`;

fs.writeFileSync(targetPath, content);
console.log("✅ .npmignore has been generated successfully.");
