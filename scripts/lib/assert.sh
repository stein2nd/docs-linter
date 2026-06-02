#!/usr/bin/env bash

## @param $1 actual output
## @param $2 expected output to contain
## @return $STATUS exit code of command
assert_contains() {
    local actual="$1"
    local expected="$2"

    if printf '%s\n' "${actual}" | grep -Fq "${expected}"; then
        return 0
    fi

    echo "ASSERT FAILED: expected output to contain:"
    echo "  ${expected}"
    echo
    echo "ACTUAL:"
    echo "${actual}"

    exit 1
}

## @param $1 actual output
## @param $2 unexpected output to not contain
## @return $STATUS exit code of command
assert_not_contains() {
    local actual="$1"
    local unexpected="$2"

    if printf '%s\n' "${actual}" | grep -Fq "${unexpected}"; then
        echo "ASSERT FAILED: unexpected output found:"
        echo "  ${unexpected}"
        echo
        echo "ACTUAL:"
        echo "${actual}"

        exit 1
    fi
}

## @param $1 actual exit code
## @param $2 expected exit code
## @return $STATUS exit code of command
assert_exit_code() {
    local actual="$1"
    local expected="$2"

    if [ "${actual}" -eq "${expected}" ]; then
        return 0
    fi

    echo "ASSERT FAILED: exit code mismatch"
    echo "EXPECTED: ${expected}"
    echo "ACTUAL:   ${actual}"

    exit 1
}

## @param $1 file to check
## @return $STATUS exit code of command
assert_file_exists() {
    local file="$1"

    if [ -f "${file}" ]; then
        return 0
    fi

    echo "ASSERT FAILED: file not found"
    echo "  ${file}"

    exit 1
}

## @param $1 file to check
## @return $STATUS exit code of command
assert_file_not_exists() {
    local file="$1"

    if [ ! -e "${file}" ]; then
        return 0
    fi

    echo "ASSERT FAILED: file exists"
    echo "  ${file}"

    exit 1
}

## @param $1 test name
log_test() {
    echo
    echo "========================================"
    echo "$1"
    echo "========================================"
}

## @param $1 test name
pass_test() {
    echo "✔ $1"
}
