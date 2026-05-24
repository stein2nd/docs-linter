#!/usr/bin/env node
/**
 * Verify git tag matches package.json version before npm publish.
 *
 * Usage:
 *   node ./scripts/verify-release-tag.cjs v1.0.12
 *   GITHUB_REF_NAME=v1.0.12 node ./scripts/verify-release-tag.cjs
 */
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const tag = process.argv[2] || process.env.GITHUB_REF_NAME;
if (!tag) {
  fail("Usage: node ./scripts/verify-release-tag.cjs <tag> (e.g. v1.0.12)");
}

if (!tag.startsWith("v")) {
  fail(`Tag must start with "v" (got: ${tag})`);
}

const tagVersion = tag.slice(1);
const pkgPath = join(process.cwd(), "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

if (!pkg.version) {
  fail("package.json must define version.");
}

if (tagVersion !== pkg.version) {
  fail(
    `Tag/version mismatch: tag ${tag} implies ${tagVersion}, but package.json version is ${pkg.version}.`
  );
}

console.log(`✅ Release tag ${tag} matches package.json version ${pkg.version}`);
