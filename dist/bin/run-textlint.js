#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
//#region src/bin/run-textlint.ts
var packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
var PRESETS = {
	base: resolve(packageRoot, "presets/base/.textlintrc.base.json"),
	wordpress: resolve(packageRoot, "presets/wordpress/.textlintrc.wp.json"),
	wp: resolve(packageRoot, "presets/wordpress/.textlintrc.wp.json"),
	swift: resolve(packageRoot, "presets/swift/.textlintrc.swift.json")
};
var DEFAULT_PRESET = PRESETS.wordpress;
var USER_CONFIG_CANDIDATES = [
	"./.textlintrc",
	"./.textlintrc.json",
	"./.textlintrc.jsonc",
	"./.textlintrc.wp.json",
	"./.textlintrc.swift.json",
	"./tools/docs-linter/.textlintrc.local.json"
];
function parseArgs(argv) {
	let profile;
	const lintTargets = [];
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--profile") {
			const value = argv[++i];
			if (!value) {
				console.error("❌ --profile requires a value (base, wordpress, wp, or swift).");
				process.exit(1);
			}
			if (!(value in PRESETS)) {
				console.error(`❌ Unknown profile: ${value}`);
				process.exit(1);
			}
			profile = value;
			continue;
		}
		if (arg.startsWith("--profile=")) {
			const value = arg.slice(10);
			if (!(value in PRESETS)) {
				console.error(`❌ Unknown profile: ${value}`);
				process.exit(1);
			}
			profile = value;
			continue;
		}
		lintTargets.push(arg);
	}
	return {
		profile,
		lintTargets: lintTargets.length > 0 ? lintTargets : ["./README.md", "./docs/**/*.md"]
	};
}
function resolveTargetConfig(profile) {
	const userConfig = USER_CONFIG_CANDIDATES.find((p) => existsSync(p));
	if (userConfig) return userConfig;
	if (profile) return PRESETS[profile];
	return DEFAULT_PRESET;
}
function buildNodePath() {
	const paths = [resolve(packageRoot, "node_modules"), resolve(process.cwd(), "node_modules")];
	if ({}.NODE_PATH) paths.push({}.NODE_PATH);
	return paths.join(":");
}
var { profile, lintTargets } = parseArgs(process.argv.slice(2));
var targetConfig = resolveTargetConfig(profile);
console.log(`🧩 Using config: ${targetConfig}`);
var result = spawnSync("npx", [
	"textlint",
	"--config",
	targetConfig,
	...lintTargets
], {
	stdio: "inherit",
	shell: true,
	cwd: process.cwd(),
	env: { NODE_PATH: buildNodePath() }
});
if (result.error) {
	console.error("❌ Failed to run textlint:", result.error);
	process.exit(1);
}
process.exit(result.status ?? 0);
//#endregion

//# sourceMappingURL=run-textlint.js.map