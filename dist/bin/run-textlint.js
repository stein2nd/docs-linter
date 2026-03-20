#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
//#region src/bin/run-textlint.ts
var __dirname = dirname(fileURLToPath(import.meta.url));
/**
* 1. Config ファイル探索
*/
var DOCS_LINTER_BASE = resolve(__dirname, "../presets/base/.textlintrc.base.json");
var DOCS_LINTER_WP = resolve(__dirname, "../presets/wordpress/.textlintrc.wp.json");
var DOCS_LINTER_SWIFT = resolve(__dirname, "../presets/swift/.textlintrc.swift.json");
var targetConfig = [
	"./.textlintrc",
	"./.textlintrc.json",
	"./.textlintrc.jsonc",
	"./.textlintrc.wp.json",
	"./.textlintrc.swift.json",
	"./tools/docs-linter/.textlintrc.local.json"
].find((p) => existsSync(p)) || DOCS_LINTER_WP || DOCS_LINTER_SWIFT || DOCS_LINTER_BASE;
console.log(`🧩 Using config: ${targetConfig}`);
/**
* 3. textlint 実行
*/
var result = spawnSync("npx", [
	"textlint",
	"--config",
	targetConfig,
	...["./README.md", "./docs/**/*.md"]
], {
	stdio: "inherit",
	shell: true,
	cwd: process.cwd(),
	env: { NODE_PATH: [resolve(__dirname, "../node_modules"), resolve(process.cwd(), "node_modules")].join(":") }
});
if (result.error) {
	console.error("❌ Failed to run textlint:", result.error);
	process.exit(1);
}
process.exit(result.status ?? 0);
//#endregion

//# sourceMappingURL=run-textlint.js.map