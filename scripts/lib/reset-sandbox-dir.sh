#!/usr/bin/env bash
# Recreate a sandbox directory without rm -rf on the live path.
# Cursor sandbox (and similar) may deny deleting `.vscode/**` under `.sandbox/`;
# moving the tree aside avoids EALLOWGIT-style failures during doctor setup.

## @param $1 absolute or relative directory path to recreate empty
reset_sandbox_dir() {
  local dir="$1"
  local parent
  local base

  parent="$(cd "$(dirname "$dir")" && pwd)"
  base="$(basename "$dir")"
  dir="${parent}/${base}"

  mkdir -p "${parent}"

  shopt -s nullglob
  local stale
  for stale in "${dir}.stale."*; do
    rm -rf "${stale}" 2>/dev/null || true
  done
  shopt -u nullglob

  if [ -e "${dir}" ]; then
    stale="${dir}.stale.$$"
    local n=0
    while [ -e "${stale}" ]; do
      n=$((n + 1))
      stale="${dir}.stale.$$.${n}"
    done
    mv "${dir}" "${stale}"
    rm -rf "${stale}" 2>/dev/null || true
  fi

  mkdir -p "${dir}"
}