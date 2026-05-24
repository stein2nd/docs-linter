#!/usr/bin/env node
/**
 * Verify npm registry login before publish (@s2j/docs-linter).
 *
 * Usage:
 *   node ./scripts/check-npm-auth.cjs           # npm whoami + registry (check only)
 *   node ./scripts/check-npm-auth.cjs --publish # check, then npm publish --access public
 */
const { execSync, spawnSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const shouldPublish = process.argv.includes("--publish");

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function runNpm(args, { inherit = false } = {}) {
  return spawnSync("npm", args, {
    encoding: "utf8",
    stdio: inherit ? "inherit" : "pipe"
  });
}

function getRegistry() {
  const result = runNpm(["config", "get", "registry"]);
  if (result.status !== 0) {
    fail("Could not read npm registry URL. Run `npm config get registry` manually.");
  }
  return (result.stdout || "").trim();
}

function getPackageMeta() {
  const pkgPath = join(process.cwd(), "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (!pkg.name || !pkg.version) {
    fail("package.json must define name and version.");
  }
  return { name: pkg.name, version: pkg.version };
}

function checkAuth() {
  const registry = getRegistry();
  const { name, version } = getPackageMeta();

  console.log(`📦 Publish target: ${name}@${version}`);
  console.log(`🔗 Registry: ${registry}`);

  const whoami = runNpm(["whoami"]);
  if (whoami.status !== 0) {
    const err = (whoami.stderr || whoami.stdout || "").trim();
    console.error(err ? `\n${err}\n` : "");
    fail(
      "Not logged in to npm. Run `npm login`, then `npm whoami`, then `npm run publish:public`."
    );
  }

  const username = (whoami.stdout || "").trim();
  if (!username) {
    fail("npm whoami returned empty. Run `npm login` and try again.");
  }

  console.log(`✅ Logged in as: ${username}`);
  return { registry, name, version, username };
}

checkAuth();

if (shouldPublish) {
  console.log("\n🚀 Running: npm publish --access public\n");
  const publish = runNpm(["publish", "--access", "public"], { inherit: true });
  process.exit(publish.status ?? 1);
}

console.log("\n💡 To publish after login: npm run publish:public");
