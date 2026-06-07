import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const PRESET_EXTENDS = {
    base: "./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json",
    wordpress: "./node_modules/@s2j/docs-linter/presets/wordpress/.textlintrc.wp.json",
    swift: "./node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json"
};
const LINT_DOCS_SCRIPT = "s2j-docs-linter ./README.md ./docs/**/*.md";
const FILE_TARGETS = {
    textlintrc: ".textlintrc.json",
    textlintignore: ".textlintignore",
    workflow: ".github/workflows/docs-lint.yml"
};
const VSCODE_TEMPLATE_FILES = [
    { template: "vscode.settings.json", relativePath: ".vscode/settings.json" },
    { template: "vscode.extensions.json", relativePath: ".vscode/extensions.json" },
    { template: "vscode.README.md", relativePath: ".vscode/README.md" },
    {
        template: "vscode.textlint.settings.jsonc.example",
        relativePath: ".vscode/textlint.settings.jsonc.example"
    }
];
const PACKAGE_JSON_SCRIPT_LABEL = "package.json scripts.lint:docs";
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
  .textlintignore
  .vscode/settings.json
  .vscode/extensions.json
  .vscode/README.md
  .vscode/textlint.settings.jsonc.example
  .github/workflows/docs-lint.yml
  package.json scripts.lint:docs (when package.json exists in the output directory)

Note:
  --dry-run cannot be combined with --output or --force.
`;
function templatesDir() {
    return resolve(dirname(fileURLToPath(import.meta.url)), "../templates");
}
function readTemplate(name) {
    return readFileSync(join(templatesDir(), name), "utf8");
}
function buildTextlintRc(preset) {
    return `${JSON.stringify({ extends: [PRESET_EXTENDS[preset]] }, null, 2)}\n`;
}
function resolveFileAction(absolutePath, force) {
    if (!existsSync(absolutePath)) {
        return "create";
    }
    return force ? "overwrite" : "skip";
}
function parseInitArgs(argv) {
    let preset = "base";
    let output;
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
            preset = value;
            continue;
        }
        if (arg.startsWith("--preset=")) {
            const value = arg.slice("--preset=".length);
            if (!(value in PRESET_EXTENDS)) {
                console.error(`❌ Invalid preset: ${value}`);
                process.exit(1);
            }
            preset = value;
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
        },
        hasOutputArg: output !== undefined
    };
}
function validateArgCombinations(dryRun, force, hasOutputArg) {
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
function buildPlan(options) {
    const { preset, outputRoot, force } = options;
    const textlintContent = buildTextlintRc(preset);
    const filePlans = [
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
            label: FILE_TARGETS.textlintignore,
            relativePath: FILE_TARGETS.textlintignore,
            absolutePath: join(outputRoot, FILE_TARGETS.textlintignore),
            content: readTemplate("textlintignore"),
            action: resolveFileAction(join(outputRoot, FILE_TARGETS.textlintignore), force)
        },
        ...VSCODE_TEMPLATE_FILES.map(({ template, relativePath }) => ({
            kind: "file",
            label: relativePath,
            relativePath,
            absolutePath: join(outputRoot, relativePath),
            content: readTemplate(template),
            action: resolveFileAction(join(outputRoot, relativePath), force)
        })),
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
    let packageJsonAction;
    if (!existsSync(packageJsonPath)) {
        packageJsonAction = "missing-package-json";
    }
    else {
        const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
        if (pkg.scripts?.["lint:docs"] && !force) {
            packageJsonAction = "skip";
        }
        else if (pkg.scripts?.["lint:docs"]) {
            packageJsonAction = "overwrite";
        }
        else {
            packageJsonAction = "create";
        }
    }
    const packageJsonPlan = {
        kind: "package-json",
        label: PACKAGE_JSON_SCRIPT_LABEL,
        absolutePath: packageJsonPath,
        action: packageJsonAction
    };
    return [...filePlans, packageJsonPlan];
}
function printDryRun(preset, plan) {
    const wouldCreate = [];
    const wouldSkip = [];
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
    }
    else {
        for (const item of wouldCreate) {
            console.log(`  ${item}`);
        }
    }
    console.log("\nWould skip:");
    if (wouldSkip.length === 0) {
        console.log("  (none)");
    }
    else {
        for (const item of wouldSkip) {
            console.log(`  ${item}`);
        }
    }
}
function logSkipped(label) {
    console.log(`⚠ Skipped ${label} (already exists)`);
}
function logOverwrite(label) {
    console.log(`✔ Overwrite ${label}`);
}
function logCreated(label) {
    console.log(`✔ Created ${label}`);
}
function writeFileTarget(target) {
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
function writePackageJsonTarget(target) {
    if (target.action === "missing-package-json") {
        console.log(`⚠ Skipped ${target.label} (package.json not found)`);
        return "missing-package-json";
    }
    if (target.action === "skip") {
        logSkipped(target.label);
        return "skip";
    }
    const pkg = JSON.parse(readFileSync(target.absolutePath, "utf8"));
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
function executePlan(plan) {
    const outcomes = [];
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
export function runInit(argv) {
    const parsed = parseInitArgs(argv);
    if (parsed.showHelp) {
        console.log(HELP_TEXT);
        return 0;
    }
    const comboError = validateArgCombinations(parsed.options.dryRun, parsed.options.force, parsed.hasOutputArg);
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
//# sourceMappingURL=init.js.map