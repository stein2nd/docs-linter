import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

type CheckOutcome = "pass" | "warn" | "fail";

type CheckResult = {
  outcome: CheckOutcome;
  label: string;
};

const HELP_TEXT = `Diagnose S2J Docs Linter setup.

Usage:
  s2j-docs-linter doctor [options]

Options:
  --path <dir>      Project root to diagnose (default: current directory)
  -h, --help        Show this help
`;

const CONFIG_FILE = ".textlintrc.json";
const VSCODE_SETTINGS = ".vscode/settings.json";
const WORKFLOW_FILE = ".github/workflows/docs-lint.yml";

function parseDoctorArgs(argv: string[]): { showHelp: boolean; targetRoot: string; invalidOption: string | null } {
  let pathArg: string | undefined;
  let showHelp = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      showHelp = true;
      continue;
    }
    if (arg === "--path") {
      const value = argv[++i];
      if (!value) {
        console.error("❌ --path requires a directory path.");
        return { showHelp: false, targetRoot: process.cwd(), invalidOption: "__path_missing__" };
      }
      pathArg = value;
      continue;
    }
    if (arg.startsWith("--path=")) {
      const value = arg.slice("--path=".length);
      if (!value) {
        console.error("❌ --path requires a directory path.");
        return { showHelp: false, targetRoot: process.cwd(), invalidOption: "__path_missing__" };
      }
      pathArg = value;
      continue;
    }

    return { showHelp: false, targetRoot: process.cwd(), invalidOption: arg };
  }

  return {
    showHelp,
    targetRoot: resolve(process.cwd(), pathArg ?? "."),
    invalidOption: null
  };
}

function printCheck(result: CheckResult): void {
  const icon = result.outcome === "pass" ? "✔" : result.outcome === "warn" ? "⚠" : "✖";
  const prefix = result.outcome === "pass" ? "PASS" : result.outcome === "warn" ? "WARN" : "FAIL";
  console.log(`${icon} ${prefix} ${result.label}`);
}

function printSummary(results: CheckResult[]): void {
  const hasFail = results.some((r) => r.outcome === "fail");
  const hasWarn = results.some((r) => r.outcome === "warn");

  if (hasFail) {
    console.log("✖ FAIL");
    return;
  }
  if (hasWarn) {
    console.log("⚠ WARN");
    return;
  }
  console.log("✔ PASS");
}

function resolveExitCode(results: CheckResult[]): number {
  return results.some((r) => r.outcome === "fail") ? 1 : 0;
}

function hasLocalPackage(root: string, packageName: string): boolean {
  return existsSync(join(root, "node_modules", packageName, "package.json"));
}

function parseNodeVersion(version: string): { major: number; minor: number; patch: number } {
  const normalized = version.startsWith("v") ? version.slice(1) : version;
  const [major, minor = 0, patch = 0] = normalized.split(".").map((part) => Number(part));
  return { major, minor, patch };
}

function compareNodeVersions(
  a: { major: number; minor: number; patch: number },
  b: { major: number; minor: number; patch: number }
): number {
  if (a.major !== b.major) {
    return a.major - b.major;
  }
  if (a.minor !== b.minor) {
    return a.minor - b.minor;
  }
  return a.patch - b.patch;
}

function satisfiesNodeEngine(range: string, currentVersion: string): boolean {
  const trimmed = range.trim();

  if (trimmed.startsWith(">=")) {
    const required = parseNodeVersion(trimmed.slice(2).trim());
    return compareNodeVersions(parseNodeVersion(currentVersion), required) >= 0;
  }
  if (trimmed.startsWith("<=")) {
    const required = parseNodeVersion(trimmed.slice(2).trim());
    return compareNodeVersions(parseNodeVersion(currentVersion), required) <= 0;
  }
  if (trimmed.startsWith(">")) {
    const required = parseNodeVersion(trimmed.slice(1).trim());
    return compareNodeVersions(parseNodeVersion(currentVersion), required) > 0;
  }
  if (trimmed.startsWith("<")) {
    const required = parseNodeVersion(trimmed.slice(1).trim());
    return compareNodeVersions(parseNodeVersion(currentVersion), required) < 0;
  }

  const required = parseNodeVersion(trimmed);
  return compareNodeVersions(parseNodeVersion(currentVersion), required) >= 0;
}

function readJsonFile(path: string): unknown | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as unknown;
  } catch {
    return null;
  }
}

function normalizeExtends(value: unknown): string[] | null {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }

    return value.every((entry) => typeof entry === "string") ? value : null;
  }

  return null;
}

function checkPackageJson(targetRoot: string): CheckResult {
  const packageJsonPath = join(targetRoot, "package.json");
  if (existsSync(packageJsonPath)) {
    return { outcome: "pass", label: "package.json" };
  }
  return { outcome: "warn", label: "package.json" };
}

function checkNodeJs(targetRoot: string): CheckResult {
  const packageJsonPath = join(targetRoot, "package.json");
  if (!existsSync(packageJsonPath)) {
    return { outcome: "pass", label: "Node.js (skip)" };
  }

  const packageJson = readJsonFile(packageJsonPath) as { engines?: { node?: string } } | null;
  const enginesNode = packageJson?.engines?.node;

  if (!enginesNode || typeof enginesNode !== "string") {
    return { outcome: "pass", label: "Node.js" };
  }

  const currentVersion = process.versions.node;
  if (satisfiesNodeEngine(enginesNode, currentVersion)) {
    return { outcome: "pass", label: "Node.js" };
  }

  return { outcome: "fail", label: "Node.js" };
}

function checkConfig(targetRoot: string): CheckResult {
  const configPath = join(targetRoot, CONFIG_FILE);
  if (existsSync(configPath)) {
    return { outcome: "pass", label: "Config" };
  }
  return { outcome: "fail", label: "Config" };
}

function checkPreset(targetRoot: string): CheckResult {
  const configPath = join(targetRoot, CONFIG_FILE);
  const config = readJsonFile(configPath) as { extends?: unknown } | null;
  const entries = normalizeExtends(config?.extends);

  if (!entries) {
    return { outcome: "fail", label: "Preset" };
  }

  const configDir = dirname(configPath);
  const allResolved = entries.every((entry) => existsSync(resolve(configDir, entry)));

  if (allResolved) {
    return { outcome: "pass", label: "Preset" };
  }

  return { outcome: "fail", label: "Preset" };
}

function checkTextlint(targetRoot: string): CheckResult {
  if (hasLocalPackage(targetRoot, "textlint")) {
    return { outcome: "pass", label: "textlint" };
  }
  return { outcome: "fail", label: "textlint" };
}

function checkVscode(targetRoot: string): CheckResult {
  const settingsPath = join(targetRoot, VSCODE_SETTINGS);
  if (existsSync(settingsPath)) {
    return { outcome: "pass", label: "VSCode" };
  }
  return { outcome: "warn", label: "VSCode" };
}

function checkGitHubActions(targetRoot: string): CheckResult {
  const workflowPath = join(targetRoot, WORKFLOW_FILE);
  if (existsSync(workflowPath)) {
    return { outcome: "pass", label: "GitHub Actions" };
  }
  return { outcome: "warn", label: "GitHub Actions" };
}

function runChecks(targetRoot: string): CheckResult[] {
  const results: CheckResult[] = [];

  results.push(checkPackageJson(targetRoot));
  results.push(checkNodeJs(targetRoot));

  const configResult = checkConfig(targetRoot);
  results.push(configResult);

  if (configResult.outcome === "pass") {
    results.push(checkPreset(targetRoot));
  }

  results.push(checkTextlint(targetRoot));
  results.push(checkVscode(targetRoot));
  results.push(checkGitHubActions(targetRoot));

  return results;
}

export function runDoctor(argv: string[]): number {
  const parsed = parseDoctorArgs(argv);

  if (parsed.showHelp) {
    console.log(HELP_TEXT);
    return 0;
  }

  if (parsed.invalidOption) {
    if (parsed.invalidOption === "__path_missing__") {
      return 1;
    }
    console.error(`Invalid option: ${parsed.invalidOption}`);
    return 1;
  }

  const results = runChecks(parsed.targetRoot);

  for (const result of results) {
    printCheck(result);
  }

  printSummary(results);

  return resolveExitCode(results);
}
