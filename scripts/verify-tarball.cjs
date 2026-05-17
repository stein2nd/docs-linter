#!/usr/bin/env node
/**
 * Verify npm pack tarball contents for @s2j/docs-linter (phase 1 publishing).
 */
const { execSync } = require("node:child_process");
const { existsSync, mkdtempSync, readFileSync, rmSync } = require("node:fs");
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
  "package/scripts/patch-wp-prh-colon-quote.cjs"
];

const FORBIDDEN_PREFIXES = ["package/src/", "package/examples/", "package/docs/"];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function main() {
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

  const workDir = mkdtempSync(join(tmpdir(), "docs-linter-pack-"));
  let tarballPath;

  try {
    const packOutput = execSync(`npm pack --pack-destination "${workDir}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"]
    });
    const tarballName = packOutput.trim().split("\n").pop();
    tarballPath = join(workDir, tarballName);
    if (!existsSync(tarballPath)) {
      fail(`tarball not found: ${tarballPath}`);
    }

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

    const pkgJsonPath = "package/package.json";
    if (!listing.includes(pkgJsonPath)) {
      fail("missing package/package.json in tarball");
    }

    console.log(`✅ tarball verified (${listing.length} entries, ${tarballPath})`);
  } finally {
    if (workDir && existsSync(workDir)) {
      rmSync(workDir, { recursive: true, force: true });
    }
  }
}

main();
