#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 1. Config ファイル探索
 */
const DOCS_LINTER_BASE = resolve(__dirname, "../base/.textlintrc.base.json");
const DOCS_LINTER_WP = resolve(__dirname, "../wordpress/.textlintrc.wp.json");
const DOCS_LINTER_SWIFT = resolve(__dirname, "../swift/.textlintrc.swift.json");

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

/**
 * 2. 実行対象パス設定
 */
const lintTargets = [
  "./README.md",
  "./docs/**/*.md"
];

/**
 * 3. textlint 実行
 */
const result = spawnSync("npx", ["textlint", "--config", targetConfig, ...lintTargets], {
  stdio: "inherit",
  shell: true,
  cwd: process.cwd(),
  env: {
    ...process.env,
    NODE_PATH: [
      resolve(__dirname, "../node_modules"),
      resolve(process.cwd(), "node_modules")
    ].join(":")
  }
});

if (result.error) {
  console.error("❌ Failed to run textlint:", result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
