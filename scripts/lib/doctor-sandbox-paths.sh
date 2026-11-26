#!/usr/bin/env bash

## Returns 0 when a new `.vscode` directory can be created under $1.
workspace_vscode_creatable() {
  local base="$1"
  local probe="${base}/.doctor-vscode-probe-$$"

  mkdir -p "${base}" 2>/dev/null || return 1
  if mkdir "${probe}/.vscode" 2>/dev/null; then
    rm -rf "${probe}" 2>/dev/null || true
    return 0
  fi
  rm -rf "${probe}" 2>/dev/null || true
  return 1
}

## @param $1 repo root
## Prints doctor sandbox root directory (no trailing pass).
configure_doctor_sandbox_paths() {
  local root_dir="$1"
  local in_tree="${root_dir}/scripts/fixtures/doctor/pass"
  local isolated="${root_dir}/.sandbox/doctor"

  if workspace_vscode_creatable "${root_dir}/.sandbox"; then
    DOCTOR_SANDBOX_ROOT="${isolated}"
    DOCTOR_USE_IN_TREE_FIXTURE=0
  else
    DOCTOR_SANDBOX_ROOT="${in_tree}"
    DOCTOR_USE_IN_TREE_FIXTURE=1
  fi

  DOCTOR_PASS_DIR="${DOCTOR_SANDBOX_ROOT}"
  if [ "${DOCTOR_USE_IN_TREE_FIXTURE}" = "0" ]; then
    DOCTOR_PASS_DIR="${DOCTOR_SANDBOX_ROOT}/pass"
  fi

  if [ "${DOCTOR_USE_IN_TREE_FIXTURE}" = "0" ]; then
    DOCTOR_NO_TEXTLINT_DIR="${DOCTOR_SANDBOX_ROOT}/no-textlint"
  else
    DOCTOR_NO_TEXTLINT_DIR="${root_dir}/.sandbox/doctor/no-textlint"
  fi

  export DOCTOR_SANDBOX_ROOT DOCTOR_PASS_DIR DOCTOR_NO_TEXTLINT_DIR DOCTOR_USE_IN_TREE_FIXTURE
}