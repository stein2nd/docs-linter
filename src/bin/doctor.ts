const HELP_TEXT = `Diagnose S2J Docs Linter setup (not implemented yet).

Usage:
  s2j-docs-linter doctor [options]

Options:
  -h, --help        Show this help
`;

export function runDoctor(argv: string[]): number {
  if (argv.some((arg) => arg === "--help" || arg === "-h")) {
    console.log(HELP_TEXT);
    return 0;
  }

  console.error("❌ doctor command is not implemented yet.");
  return 1;
}
