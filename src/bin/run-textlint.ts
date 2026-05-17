#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "../..");

const PRESETS = {
  base: resolve(packageRoot, "presets/base/.textlintrc.base.json"),
  wordpress: resolve(packageRoot, "presets/wordpress/.textlintrc.wp.json"),
  wp: resolve(packageRoot, "presets/wordpress/.textlintrc.wp.json"),
  swift: resolve(packageRoot, "presets/swift/.textlintrc.swift.json")
} as const;

const DEFAULT_PRESET = PRESETS.wordpress;

const USER_CONFIG_CANDIDATES = [
  "./.textlintrc",
  "./.textlintrc.json",
  "./.textlintrc.jsonc",
  "./.textlintrc.wp.json",
  "./.textlintrc.swift.json",
  "./tools/docs-linter/.textlintrc.local.json"
];

type ProfileName = keyof typeof PRESETS;

function parseArgs(argv: string[]) {
  let profile: ProfileName | undefined;
  const lintTargets: string[] = [];

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
      profile = value as ProfileName;
      continue;
    }
    if (arg.startsWith("--profile=")) {
      const value = arg.slice("--profile=".length);
      if (!(value in PRESETS)) {
        console.error(`❌ Unknown profile: ${value}`);
        process.exit(1);
      }
      profile = value as ProfileName;
      continue;
    }
    lintTargets.push(arg);
  }

  return {
    profile,
    lintTargets: lintTargets.length > 0 ? lintTargets : ["./README.md", "./docs/**/*.md"]
  };
}

function resolveTargetConfig(profile: ProfileName | undefined): string {
  const userConfig = USER_CONFIG_CANDIDATES.find((p) => existsSync(p));
  if (userConfig) {
    return userConfig;
  }
  if (profile) {
    return PRESETS[profile];
  }
  return DEFAULT_PRESET;
}

function buildNodePath(): string {
  const paths = [
    resolve(packageRoot, "node_modules"),
    resolve(process.cwd(), "node_modules")
  ];
  if (process.env.NODE_PATH) {
    paths.push(process.env.NODE_PATH);
  }
  return paths.join(":");
}

const { profile, lintTargets } = parseArgs(process.argv.slice(2));
const targetConfig = resolveTargetConfig(profile);

console.log(`🧩 Using config: ${targetConfig}`);

const result = spawnSync("npx", ["textlint", "--config", targetConfig, ...lintTargets], {
  stdio: "inherit",
  shell: true,
  cwd: process.cwd(),
  env: {
    ...process.env,
    NODE_PATH: buildNodePath()
  }
});

if (result.error) {
  console.error("❌ Failed to run textlint:", result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
