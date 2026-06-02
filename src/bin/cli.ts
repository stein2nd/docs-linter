#!/usr/bin/env node

import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { runDoctor } from "./doctor.js";
import { runInit } from "./init.js";
import { LINT_HELP_TEXT, runLint, showLintVersion } from "./run-textlint.js";

const require = createRequire(import.meta.url);

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export const PACKAGE_VERSION =
  (require(join(packageRoot, "package.json")) as { version?: string }).version ?? "unknown";

const CLI_HELP_TEXT = `S2J Docs Linter — documentation linting toolkit.

Usage:
  s2j-docs-linter <command> [options]
  s2j-docs-linter [lint options] [files...]

Commands:
  init              Generate project scaffolding
  doctor            Diagnose setup
  (default)         Run textlint via bundled wrapper

Run "s2j-docs-linter init --help" or "s2j-docs-linter --help" for details.
`;

function showCliHelp(): void {
  console.log(CLI_HELP_TEXT);
  console.log(LINT_HELP_TEXT);
}

function main(): number {
  const argv = process.argv.slice(2);

  if (argv.length === 0) {
    return runLint([]);
  }

  const first = argv[0];

  if (first === "init") {
    return runInit(argv.slice(1));
  }

  if (first === "doctor") {
    return runDoctor(argv.slice(1));
  }

  if (first === "--help" || first === "-h") {
    showCliHelp();
    return 0;
  }

  if (first === "--version" || first === "-V") {
    showLintVersion();
    return 0;
  }

  return runLint(argv);
}

const exitCode = main();
process.exit(exitCode);
