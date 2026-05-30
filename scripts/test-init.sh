#!/usr/bin/env bash
# INIT command smoke tests — docsMod/cli_tooling_spec.md (init テスト仕様)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

CLI=(node dist/bin/cli.js)
SANDBOX=".sandbox"

pass() { echo "✔ $1"; }
fail() { echo "✖ $1" >&2; exit 1; }

assert_exit() {
  local expected="$1"
  shift
  set +e
  "$@" >/tmp/init-test.out 2>/tmp/init-test.err
  local code=$?
  set -e
  local combined="/tmp/init-test.out"
  cat /tmp/init-test.err >> "$combined"
  if [[ "$code" -ne "$expected" ]]; then
    echo "--- output ---" >&2
    cat "$combined" >&2
    fail "expected exit $expected, got $code: $*"
  fi
}

assert_contains() {
  local needle="$1"
  if ! grep -Fq "$needle" /tmp/init-test.out /tmp/init-test.err 2>/dev/null; then
    echo "--- output ---" >&2
    cat /tmp/init-test.out /tmp/init-test.err >&2
    fail "expected output to contain: $needle"
  fi
}

assert_not_contains() {
  local needle="$1"
  if grep -Fq "$needle" /tmp/init-test.out /tmp/init-test.err 2>/dev/null; then
    fail "expected output NOT to contain: $needle"
  fi
}

assert_file() {
  [[ -f "$1" ]] || fail "missing file: $1"
}

assert_json_extends() {
  local file="$1"
  local expected="$2"
  node -e "
    const fs = require('node:fs');
    const cfg = JSON.parse(fs.readFileSync('$file', 'utf8'));
    const ext = cfg.extends && cfg.extends[0];
    if (ext !== '$expected') {
      console.error('extends mismatch:', ext);
      process.exit(1);
    }
  " || fail "extends mismatch in $file"
}

echo "Building..."
npm run build --silent

rm -rf "$SANDBOX/base" "$SANDBOX/swift" "$SANDBOX/wordpress"
mkdir -p "$SANDBOX"

# INIT-001: Dry Run (default preset)
assert_exit 0 "${CLI[@]}" init --dry-run
assert_contains "Would create"
pass "INIT-001"

# INIT-002: Dry Run + swift preset
assert_exit 0 "${CLI[@]}" init --dry-run --preset swift
assert_contains "Preset:"
assert_contains "swift"
pass "INIT-002"

# INIT-003: Dry Run + wordpress preset
assert_exit 0 "${CLI[@]}" init --dry-run --preset wordpress
assert_contains "Preset:"
assert_contains "wordpress"
pass "INIT-003"

# INIT-004: Output base preset files
assert_exit 0 "${CLI[@]}" init --output "$SANDBOX/base"
assert_file "$SANDBOX/base/.textlintrc.json"
assert_file "$SANDBOX/base/.vscode/settings.json"
assert_file "$SANDBOX/base/.github/workflows/docs-lint.yml"
assert_json_extends "$SANDBOX/base/.textlintrc.json" \
  "./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"
pass "INIT-004"

# INIT-005: Output swift preset
assert_exit 0 "${CLI[@]}" init --preset swift --output "$SANDBOX/swift"
assert_file "$SANDBOX/swift/.textlintrc.json"
assert_json_extends "$SANDBOX/swift/.textlintrc.json" \
  "./node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json"
pass "INIT-005"

# INIT-006: Output wordpress preset
assert_exit 0 "${CLI[@]}" init --preset wordpress --output "$SANDBOX/wordpress"
assert_file "$SANDBOX/wordpress/.textlintrc.json"
assert_json_extends "$SANDBOX/wordpress/.textlintrc.json" \
  "./node_modules/@s2j/docs-linter/presets/wordpress/.textlintrc.wp.json"
pass "INIT-006"

# INIT-007: Re-run without force → skip
assert_exit 0 "${CLI[@]}" init --output "$SANDBOX/base"
assert_contains "⚠ Skipped"
pass "INIT-007"

# INIT-008: Force overwrite
assert_exit 0 "${CLI[@]}" init --output "$SANDBOX/base" --force
assert_contains "✔ Overwrite"
pass "INIT-008"

# INIT-009: Invalid combo dry-run + force
assert_exit 1 "${CLI[@]}" init --dry-run --force
pass "INIT-009"

# INIT-010: Invalid combo dry-run + output
assert_exit 1 "${CLI[@]}" init --dry-run --output "$SANDBOX/base"
pass "INIT-010"

# INIT-011: Invalid combo dry-run + output + force
assert_exit 1 "${CLI[@]}" init --dry-run --output "$SANDBOX/base" --force
pass "INIT-011"

# INIT-012: Invalid preset
assert_exit 1 "${CLI[@]}" init --preset invalid
assert_contains "Invalid preset"
pass "INIT-012"

echo ""
echo "All init tests passed."
