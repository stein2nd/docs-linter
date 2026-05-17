#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "../..");

const PACKAGE_VERSION =
  (require(join(packageRoot, "package.json")) as { version?: string }).version ?? "unknown";

const HELP_TEXT = `S2J Docs Linter — textlint wrapper for Swift, WordPress, and general docs.

Usage:
  s2j-docs-linter [options] [files...]

Options:
  --profile <name>   Use bundled preset: base | wordpress | wp | swift
  -h, --help         Show this help
  -V, --version      Show package version

Config resolution (first match wins):
  1. Project config: .textlintrc, .textlintrc.json, .textlintrc.jsonc,
     .textlintrc.wp.json, .textlintrc.swift.json,
     tools/docs-linter/.textlintrc.local.json
  2. --profile bundled preset under presets/
  3. Default: WordPress preset

Examples:
  s2j-docs-linter
  s2j-docs-linter --profile swift ./README.md ./docs/**/*.md
  s2j-docs-linter --profile base ./docs/**/*.md
`;

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

function isHelpOrVersion(arg: string): boolean {
  return arg === "--help" || arg === "-h" || arg === "--version" || arg === "-V";
}

function parseArgs(argv: string[]) {
  let profile: ProfileName | undefined;
  const lintTargets: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (isHelpOrVersion(arg)) {
      continue;
    }
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

function resolveTextlintBin(): string {
  const candidates = [
    resolve(packageRoot, "node_modules/textlint/bin/textlint.js"),
    resolve(process.cwd(), "node_modules/textlint/bin/textlint.js")
  ];
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    console.error("❌ textlint is not installed. Install @s2j/docs-linter (includes textlint as a dependency).");
    process.exit(1);
  }
  return found;
}

const rawArgv = process.argv.slice(2);

if (rawArgv.some((arg) => arg === "--help" || arg === "-h")) {
  console.log(HELP_TEXT);
  process.exit(0);
}

if (rawArgv.some((arg) => arg === "--version" || arg === "-V")) {
  console.log(PACKAGE_VERSION);
  process.exit(0);
}

const { profile, lintTargets } = parseArgs(rawArgv);
const targetConfig = resolveTargetConfig(profile);

console.log(`🧩 Using config: ${targetConfig}`);

const textlintBin = resolveTextlintBin();
const result = spawnSync(process.execPath, [textlintBin, "--config", targetConfig, ...lintTargets], {
  stdio: "inherit",
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
