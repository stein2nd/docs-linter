#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
var define_process_env_default = {};
const __dirname$1 = dirname(fileURLToPath(import.meta.url));
const DOCS_LINTER_BASE = resolve(__dirname$1, "../presets/base/.textlintrc.base.json");
const DOCS_LINTER_WP = resolve(__dirname$1, "../presets/wordpress/.textlintrc.wp.json");
const DOCS_LINTER_SWIFT = resolve(__dirname$1, "../presets/swift/.textlintrc.swift.json");
const USER_CONFIG_CANDIDATES = [
  "./.textlintrc",
  "./.textlintrc.json",
  "./.textlintrc.jsonc",
  "./.textlintrc.wp.json",
  "./.textlintrc.swift.json",
  "./tools/docs-linter/.textlintrc.local.json"
];
const userConfig = USER_CONFIG_CANDIDATES.find((p) => existsSync(p));
const targetConfig = userConfig || DOCS_LINTER_WP || DOCS_LINTER_SWIFT || DOCS_LINTER_BASE;
console.log(`🧩 Using config: ${targetConfig}`);
const lintTargets = [
  "./README.md",
  "./docs/**/*.md"
];
const result = spawnSync("npx", ["textlint", "--config", targetConfig, ...lintTargets], {
  stdio: "inherit",
  shell: true,
  cwd: process.cwd(),
  env: {
    ...define_process_env_default,
    NODE_PATH: [
      resolve(__dirname$1, "../node_modules"),
      resolve(process.cwd(), "node_modules")
    ].join(":")
  }
});
if (result.error) {
  console.error("❌ Failed to run textlint:", result.error);
  process.exit(1);
}
process.exit(result.status ?? 0);
//# sourceMappingURL=run-textlint.js.map
