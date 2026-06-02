#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

source "${ROOT_DIR}/scripts/lib/assert.sh"
source "${ROOT_DIR}/scripts/lib/set_invalid_preset.sh"
source "${ROOT_DIR}/scripts/lib/doctor-fixture.sh"

CLI="node dist/bin/cli.js"
PASS_DIR="${ROOT_DIR}/.sandbox/doctor/pass"
NO_TEXTLINT_DIR="${ROOT_DIR}/.sandbox/doctor/no-textlint"


log_test "DOCTOR-001"
prepare_pass_fixture
run_doctor "${PASS_DIR}"
assert_exit_code "${STATUS}" 0
assert_contains "${OUTPUT}" "✔ PASS Config"
assert_contains "${OUTPUT}" "✔ PASS Preset"
assert_contains "${OUTPUT}" "✔ PASS VSCode"
assert_contains "${OUTPUT}" "✔ PASS GitHub Actions"
assert_contains "${OUTPUT}" "✔ PASS Node.js"
assert_contains "${OUTPUT}" "✔ PASS textlint"
assert_contains "${OUTPUT}" "✔ PASS"
assert_not_contains "${OUTPUT}" "⚠ WARN"
assert_not_contains "${OUTPUT}" "✖ FAIL"
pass_test "DOCTOR-001"


log_test "DOCTOR-002"
prepare_pass_fixture
run_doctor "${PASS_DIR}"
assert_exit_code "${STATUS}" 0
assert_contains "${OUTPUT}" "✔ PASS Node.js"
pass_test "DOCTOR-002"


log_test "DOCTOR-013"
prepare_pass_fixture
set_package_node_engine "${PASS_DIR}/package.json" ">=99"
run_doctor "${PASS_DIR}"
assert_exit_code "${STATUS}" 1
assert_contains "${OUTPUT}" "✖ FAIL Node.js"
pass_test "DOCTOR-013"


log_test "DOCTOR-010"
prepare_pass_fixture
run_doctor "${PASS_DIR}"
assert_exit_code "${STATUS}" 0
assert_contains "${OUTPUT}" "✔ PASS Node.js (skip)"
pass_test "DOCTOR-010"


log_test "DOCTOR-009"
prepare_pass_fixture
prepare_no_textlint_fixture
run_doctor "${NO_TEXTLINT_DIR}"
assert_exit_code "${STATUS}" 1
assert_contains "${OUTPUT}" "✖ FAIL textlint"
pass_test "DOCTOR-009"


log_test "DOCTOR-003"
prepare_pass_fixture
run_doctor "${PASS_DIR}"
assert_exit_code "${STATUS}" 0
assert_contains "${OUTPUT}" "✔ PASS Config"
pass_test "DOCTOR-003"


log_test "DOCTOR-007"
prepare_pass_fixture
remove_config "${PASS_DIR}/.textlintrc.json"
run_doctor "${PASS_DIR}"
assert_exit_code "${STATUS}" 1
assert_contains "${OUTPUT}" "✖ FAIL Config"
pass_test "DOCTOR-007"


log_test "DOCTOR-004"
prepare_pass_fixture
run_doctor "${PASS_DIR}"
assert_exit_code "${STATUS}" 0
assert_contains "${OUTPUT}" "✔ PASS Preset"
pass_test "DOCTOR-004"


log_test "DOCTOR-008"
prepare_pass_fixture
set_invalid_preset "${PASS_DIR}/.textlintrc.json"
run_doctor "${PASS_DIR}"
assert_exit_code "${STATUS}" 1
assert_contains "${OUTPUT}" "✖ FAIL Preset"
pass_test "DOCTOR-008"


log_test "DOCTOR-005"
prepare_pass_fixture
run_doctor "${PASS_DIR}"
assert_exit_code "${STATUS}" 0
assert_contains "${OUTPUT}" "✔ PASS VSCode"
pass_test "DOCTOR-005"


log_test "DOCTOR-011"
prepare_pass_fixture
remove_vscode_settings "${PASS_DIR}/.vscode/settings.json"
run_doctor "${PASS_DIR}"
assert_exit_code "${STATUS}" 0
assert_contains "${OUTPUT}" "⚠ WARN VSCode"
pass_test "DOCTOR-011"


log_test "DOCTOR-006"
prepare_pass_fixture
run_doctor "${PASS_DIR}"
assert_exit_code "${STATUS}" 0
assert_contains "${OUTPUT}" "✔ PASS GitHub Actions"
pass_test "DOCTOR-006"


log_test "DOCTOR-012"
prepare_pass_fixture
remove_workflow "${PASS_DIR}/.github/workflows/docs-lint.yml"
run_doctor "${PASS_DIR}"
assert_exit_code "${STATUS}" 0
assert_contains "${OUTPUT}" "⚠ WARN GitHub Actions"
pass_test "DOCTOR-012"


log_test "DOCTOR-015"
prepare_pass_fixture
OUTPUT="$(${CLI} doctor --help)"
assert_exit_code "${STATUS}" 0
assert_contains "${OUTPUT}" "Usage:"
pass_test "DOCTOR-015"


log_test "DOCTOR-014"
prepare_pass_fixture
OUTPUT="$(${CLI} doctor --unknown)"
assert_exit_code "${STATUS}" 1
assert_contains "${OUTPUT}" "Invalid option"
pass_test "DOCTOR-014"

echo
echo "All doctor tests passed."


## @return $PASS_DIR directory to run doctor command with pass fixture
## @return $STATUS exit code of doctor command
## @return $OUTPUT output of doctor command
prepare_pass_fixture() {
    "${ROOT_DIR}/scripts/helpers/setup-doctor-pass.sh"
}

## @return $NO_TEXTLINT_DIR directory to run doctor command with no textlint
## @return $STATUS exit code of doctor command
## @return $OUTPUT output of doctor command
prepare_no_textlint_fixture() {
    rm -rf "${NO_TEXTLINT_DIR}"

    mkdir -p "${NO_TEXTLINT_DIR}/node_modules"

    cp "${ROOT_DIR}/scripts/fixtures/doctor/pass/package.json" "${NO_TEXTLINT_DIR}/package.json"
}

## @param $1 target directory to run doctor command
## @return $STATUS exit code of doctor command
## @return $OUTPUT output of doctor command
## @return $STATUS exit code of doctor command
run_doctor() {
    local target="$1"

    set +e
    OUTPUT="$(${CLI} doctor --path "${target}" 2>&1)"
    STATUS=$?
    set -e
}

## @param $1 test name
## @return $STATUS exit code of command
pass() {
    echo "✔ $1"
}

## @param $1 test name
## @return $STATUS exit code of command
fail() {
    echo "✖ $1"
    exit 1
}

## @param $1 output to check
## @param $2 expected output to contain
## @return $STATUS exit code of command
## @return $OUTPUT output of command
assert_contains() {
    local output="$1"
    local expected="$2"

    if echo "${output}" | grep -Fq "${expected}"; then
        return 0
    fi

    echo "Expected:"
    echo "  ${expected}"
    echo
    echo "Actual:"
    echo "${output}"

    exit 1
}
