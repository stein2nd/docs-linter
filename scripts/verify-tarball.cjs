#!/usr/bin/env node
/**
 * Verify npm pack tarball contents for @s2j/docs-linter (phase 1 publishing).
 *
 * Default: pack into a temp directory (no repo pollution).
 * --from-artifacts: verify ./artifacts/s2j-docs-linter-<version>.tgz (after npm run pack:artifact).
 */
const { execSync } = require("node:child_process");
const { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } = require("node:fs");
const { join } = require("node:path");
const { tmpdir } = require("node:os");

const REQUIRED_PATHS = [
  "package/LICENSE",
  "package/README.md",
  "package/package.json",
  "package/dist/bin/run-textlint.js",
  "package/dist/scripts/setup-npmignore.js",
  "package/presets/base/.textlintrc.base.json",
  "package/presets/swift/.textlintrc.swift.json",
  "package/presets/wordpress/.textlintrc.wp.json",
  "package/base/.textlintrc.base.json",
  "package/swift/.textlintrc.swift.json",
  "package/wordpress/.textlintrc.wp.json",
  "package/scripts/patch-wp-prh-colon-quote.cjs"
];

const FORBIDDEN_PREFIXES = ["package/src/", "package/examples/", "package/docs/"];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function verifyTarballListing(tarballPath) {
  const listing = execSync(`tar -tzf "${tarballPath}"`, { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);

  for (const required of REQUIRED_PATHS) {
    if (!listing.includes(required)) {
      fail(`missing required path in tarball: ${required}`);
    }
  }

  for (const entry of listing) {
    for (const forbidden of FORBIDDEN_PREFIXES) {
      if (entry.startsWith(forbidden)) {
        fail(`forbidden path in tarball: ${entry}`);
      }
    }
  }

  if (!listing.includes("package/package.json")) {
    fail("missing package/package.json in tarball");
  }

  console.log(`✅ tarball verified (${listing.length} entries, ${tarballPath})`);
}

function resolveArtifactTarball(version) {
  const artifactsDir = join(process.cwd(), "artifacts");
  const expectedName = `s2j-docs-linter-${version}.tgz`;
  const expectedPath = join(artifactsDir, expectedName);
  if (existsSync(expectedPath)) {
    return expectedPath;
  }

  if (!existsSync(artifactsDir)) {
    fail(`artifacts directory not found: ${artifactsDir} (run npm run pack:artifact first)`);
  }

  const matches = readdirSync(artifactsDir).filter((name) => name.endsWith(".tgz"));
  if (matches.length === 1) {
    return join(artifactsDir, matches[0]);
  }

  fail(
    `expected tarball not found: ${expectedPath}` +
      (matches.length ? ` (found: ${matches.join(", ")})` : "")
  );
}

function main() {
  const fromArtifacts = process.argv.includes("--from-artifacts");
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));

  if (pkg.name !== "@s2j/docs-linter") {
    fail(`expected package name @s2j/docs-linter, got ${pkg.name}`);
  }
  if (!pkg.version) {
    fail("package.json.version is required");
  }
  if (!pkg.bin?.["s2j-docs-linter"]) {
    fail("package.json.bin.s2j-docs-linter is required");
  }

  if (fromArtifacts) {
    verifyTarballListing(resolveArtifactTarball(pkg.version));
    return;
  }

  const workDir = mkdtempSync(join(tmpdir(), "docs-linter-pack-"));

  try {
    const packOutput = execSync(`npm pack --pack-destination "${workDir}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"]
    });
    const tarballName = packOutput.trim().split("\n").pop();
    const tarballPath = join(workDir, tarballName);
    if (!existsSync(tarballPath)) {
      fail(`tarball not found: ${tarballPath}`);
    }
    verifyTarballListing(tarballPath);
  } finally {
    if (existsSync(workDir)) {
      rmSync(workDir, { recursive: true, force: true });
    }
  }
}

main();
