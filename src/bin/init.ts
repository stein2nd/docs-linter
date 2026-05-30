import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PRESET_EXTENDS = {
  base: "./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json",
  wordpress: "./node_modules/@s2j/docs-linter/presets/wordpress/.textlintrc.wp.json",
  swift: "./node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json"
} as const;

type InitPreset = keyof typeof PRESET_EXTENDS;

const LINT_DOCS_SCRIPT = "s2j-docs-linter ./README.md ./docs/**/*.md";

const FILE_TARGETS = {
  textlintrc: ".textlintrc.json",
  vscodeSettings: ".vscode/settings.json",
  workflow: ".github/workflows/docs-lint.yml"
} as const;

const PACKAGE_JSON_SCRIPT_LABEL = "package.json scripts.lint:docs";

type TargetAction = "create" | "skip" | "overwrite";

type FileTargetPlan = {
  kind: "file";
  label: string;
  relativePath: string;
  absolutePath: string;
  content: string;
  action: TargetAction;
};

type PackageJsonTargetPlan = {
  kind: "package-json";
  label: string;
  absolutePath: string;
  action: TargetAction | "missing-package-json";
};

type InitTargetPlan = FileTargetPlan | PackageJsonTargetPlan;

type InitOptions = {
  preset: InitPreset;
  outputRoot: string;
  dryRun: boolean;
  force: boolean;
};

const HELP_TEXT = `Initialize S2J Docs Linter project scaffolding.

Usage:
  s2j-docs-linter init [options]

Options:
  --preset <name>    Preset to use: base | wordpress | swift (default: base)
  --output <dir>     Output directory (default: current directory)
  --dry-run          Show planned changes without writing files
  --force            Overwrite existing files
  -h, --help         Show this help

Generated files:
  .textlintrc.json
  .vscode/settings.json
  .github/workflows/docs-lint.yml
  package.json scripts.lint:docs (when package.json exists in the output directory)

Note:
  --dry-run cannot be combined with --output or --force.
`;

function templatesDir(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), "../templates");
}

function readTemplate(name: string): string {
  return readFileSync(join(templatesDir(), name), "utf8");
}

function buildTextlintRc(preset: InitPreset): string {
  return `${JSON.stringify({ extends: [PRESET_EXTENDS[preset]] }, null, 2)}\n`;
}

function resolveFileAction(absolutePath: string, force: boolean): TargetAction {
  if (!existsSync(absolutePath)) {
    return "create";
  }
  return force ? "overwrite" : "skip";
}

function parseInitArgs(argv: string[]) {
  let preset: InitPreset = "base";
  let output: string | undefined;
  let dryRun = false;
  let force = false;
  let showHelp = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      showHelp = true;
      continue;
    }
    if (arg === "--force") {
      force = true;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--output") {
      const value = argv[++i];
      if (!value) {
        console.error("❌ --output requires a directory path.");
        process.exit(1);
      }
      output = value;
      continue;
    }
    if (arg.startsWith("--output=")) {
      output = arg.slice("--output=".length);
      if (!output) {
        console.error("❌ --output requires a directory path.");
        process.exit(1);
      }
      continue;
    }
    if (arg === "--preset") {
      const value = argv[++i];
      if (!value) {
        console.error("❌ --preset requires a value (base, wordpress, or swift).");
        process.exit(1);
      }
      if (!(value in PRESET_EXTENDS)) {
        console.error(`❌ Invalid preset: ${value}`);
        process.exit(1);
      }
      preset = value as InitPreset;
      continue;
    }
    if (arg.startsWith("--preset=")) {
      const value = arg.slice("--preset=".length);
      if (!(value in PRESET_EXTENDS)) {
        console.error(`❌ Invalid preset: ${value}`);
        process.exit(1);
      }
      preset = value as InitPreset;
      continue;
    }

    console.error(`❌ Unknown option: ${arg}`);
    process.exit(1);
  }

  return {
    showHelp,
    options: {
      preset,
      outputRoot: resolve(process.cwd(), output ?? "."),
      dryRun,
      force
    } satisfies InitOptions,
    hasOutputArg: output !== undefined
  };
}

function validateArgCombinations(dryRun: boolean, force: boolean, hasOutputArg: boolean): string | null {
  if (!dryRun) {
    return null;
  }
  if (force && hasOutputArg) {
    return "❌ --dry-run cannot be combined with --output and --force.";
  }
  if (force) {
    return "❌ --dry-run cannot be combined with --force.";
  }
  if (hasOutputArg) {
    return "❌ --dry-run cannot be combined with --output.";
  }
  return null;
}

function buildPlan(options: InitOptions): InitTargetPlan[] {
  const { preset, outputRoot, force } = options;
  const textlintContent = buildTextlintRc(preset);

  const filePlans: FileTargetPlan[] = [
    {
      kind: "file",
      label: FILE_TARGETS.textlintrc,
      relativePath: FILE_TARGETS.textlintrc,
      absolutePath: join(outputRoot, FILE_TARGETS.textlintrc),
      content: textlintContent,
      action: resolveFileAction(join(outputRoot, FILE_TARGETS.textlintrc), force)
    },
    {
      kind: "file",
      label: FILE_TARGETS.vscodeSettings,
      relativePath: FILE_TARGETS.vscodeSettings,
      absolutePath: join(outputRoot, FILE_TARGETS.vscodeSettings),
      content: readTemplate("vscode.settings.json"),
      action: resolveFileAction(join(outputRoot, FILE_TARGETS.vscodeSettings), force)
    },
    {
      kind: "file",
      label: FILE_TARGETS.workflow,
      relativePath: FILE_TARGETS.workflow,
      absolutePath: join(outputRoot, FILE_TARGETS.workflow),
      content: readTemplate("docs-lint.yml"),
      action: resolveFileAction(join(outputRoot, FILE_TARGETS.workflow), force)
    }
  ];

  const packageJsonPath = join(outputRoot, "package.json");
  let packageJsonAction: PackageJsonTargetPlan["action"];

  if (!existsSync(packageJsonPath)) {
    packageJsonAction = "missing-package-json";
  } else {
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      scripts?: Record<string, string>;
    };
    if (pkg.scripts?.["lint:docs"] && !force) {
      packageJsonAction = "skip";
    } else if (pkg.scripts?.["lint:docs"]) {
      packageJsonAction = "overwrite";
    } else {
      packageJsonAction = "create";
    }
  }

  const packageJsonPlan: PackageJsonTargetPlan = {
    kind: "package-json",
    label: PACKAGE_JSON_SCRIPT_LABEL,
    absolutePath: packageJsonPath,
    action: packageJsonAction
  };

  return [...filePlans, packageJsonPlan];
}

function printDryRun(preset: InitPreset, plan: InitTargetPlan[]): void {
  const wouldCreate: string[] = [];
  const wouldSkip: string[] = [];

  for (const target of plan) {
    if (target.action === "missing-package-json") {
      wouldSkip.push(target.label);
      continue;
    }
    if (target.action === "create") {
      wouldCreate.push(target.kind === "file" ? target.relativePath : target.label);
      continue;
    }
    if (target.action === "skip") {
      wouldSkip.push(target.kind === "file" ? target.relativePath : target.label);
    }
  }

  console.log("[Dry Run]\n");
  console.log("Preset:");
  console.log(`  ${preset}\n`);
  console.log("Would create:");
  if (wouldCreate.length === 0) {
    console.log("  (none)");
  } else {
    for (const item of wouldCreate) {
      console.log(`  ${item}`);
    }
  }
  console.log("\nWould skip:");
  if (wouldSkip.length === 0) {
    console.log("  (none)");
  } else {
    for (const item of wouldSkip) {
      console.log(`  ${item}`);
    }
  }
}

function logSkipped(label: string): void {
  console.log(`⚠ Skipped ${label} (already exists)`);
}

function logOverwrite(label: string): void {
  console.log(`✔ Overwrite ${label}`);
}

function logCreated(label: string): void {
  console.log(`✔ Created ${label}`);
}

function writeFileTarget(target: FileTargetPlan): TargetAction {
  if (target.action === "skip") {
    logSkipped(target.label);
    return "skip";
  }

  mkdirSync(dirname(target.absolutePath), { recursive: true });
  writeFileSync(target.absolutePath, target.content, "utf8");

  if (target.action === "overwrite") {
    logOverwrite(target.label);
    return "overwrite";
  }

  logCreated(target.label);
  return "create";
}

function writePackageJsonTarget(target: PackageJsonTargetPlan): TargetAction | "missing-package-json" {
  if (target.action === "missing-package-json") {
    console.log(`⚠ Skipped ${target.label} (package.json not found)`);
    return "missing-package-json";
  }

  if (target.action === "skip") {
    logSkipped(target.label);
    return "skip";
  }

  const pkg = JSON.parse(readFileSync(target.absolutePath, "utf8")) as {
    scripts?: Record<string, string>;
  };
  pkg.scripts = {
    ...pkg.scripts,
    "lint:docs": LINT_DOCS_SCRIPT
  };
  writeFileSync(target.absolutePath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");

  if (target.action === "overwrite") {
    logOverwrite(target.label);
    return "overwrite";
  }

  logCreated(target.label);
  return "create";
}

function executePlan(plan: InitTargetPlan[]): void {
  const outcomes: Array<TargetAction | "missing-package-json"> = [];

  for (const target of plan) {
    if (target.kind === "file") {
      outcomes.push(writeFileTarget(target));
      continue;
    }
    outcomes.push(writePackageJsonTarget(target));
  }

  const changed = outcomes.filter((outcome) => outcome === "create" || outcome === "overwrite");
  const skipped = outcomes.filter((outcome) => outcome === "skip" || outcome === "missing-package-json");

  console.log(`\nDone. ${changed.length} created/updated, ${skipped.length} skipped.`);

  if (changed.length === 0) {
    console.log("⚠ No files were created or updated. Use --force to overwrite existing files.");
  }
}

export function runInit(argv: string[]): number {
  const parsed = parseInitArgs(argv);

  if (parsed.showHelp) {
    console.log(HELP_TEXT);
    return 0;
  }

  const comboError = validateArgCombinations(
    parsed.options.dryRun,
    parsed.options.force,
    parsed.hasOutputArg
  );
  if (comboError) {
    console.error(comboError);
    return 1;
  }

  const plan = buildPlan(parsed.options);

  if (parsed.options.dryRun) {
    printDryRun(parsed.options.preset, plan);
    return 0;
  }

  executePlan(plan);
  return 0;
}
