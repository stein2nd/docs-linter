#!/usr/bin/env bash

## @param $1 .textlintrc.json path
## @return $STATUS exit code of command
set_invalid_preset() {
    local config_file="$1"

    if [ ! -f "${config_file}" ]; then
        echo "ERROR: file not found"
        echo "  ${config_file}"
        exit 1
    fi

    jq '
.extends = [
    "./node_modules/@s2j/docs-linter/presets/invalid/config.json"
]
' "${config_file}" > "${config_file}.tmp"

    mv "${config_file}.tmp" "${config_file}"
}

## @param $1 package.json path
## @param $2 version
set_package_node_engine() {
    local package_json="$1"
    local version="$2"

    jq --arg version "${version}" '.engines.node = $version' "${package_json}" > "${package_json}.tmp"

    mv "${package_json}.tmp" "${package_json}"
}

## @param $1 .textlintrc.json path
remove_config() {
    rm -f "$1"
}

## @param $1 package.json path
remove_package_json() {
    rm -f "$1"
}

## @param $1 .vscode/settings.json path
remove_vscode_settings() {
    rm -f "$1"
}

## @param $1 .github/workflows/docs-lint.yml path
remove_workflow() {
    rm -f "$1"
}
