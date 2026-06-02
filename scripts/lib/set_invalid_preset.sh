#!/usr/bin/env bash

set -euo pipefail

CONFIG_FILE="${1:?missing .textlintrc.json path}"

if [ ! -f "${CONFIG_FILE}" ]; then
    echo "ERROR: file not found"
    echo "  ${CONFIG_FILE}"
    exit 1
fi

jq '
.extends = [
    "./node_modules/@s2j/docs-linter/presets/invalid/config.json"
]
' "${CONFIG_FILE}" > "${CONFIG_FILE}.tmp"

mv "${CONFIG_FILE}.tmp" "${CONFIG_FILE}"
