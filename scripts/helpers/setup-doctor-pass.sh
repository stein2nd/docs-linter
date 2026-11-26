#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

# shellcheck source=../lib/reset-sandbox-dir.sh
source "${ROOT_DIR}/scripts/lib/reset-sandbox-dir.sh"
# shellcheck source=../lib/doctor-sandbox-paths.sh
source "${ROOT_DIR}/scripts/lib/doctor-sandbox-paths.sh"

configure_doctor_sandbox_paths "${ROOT_DIR}"
TARGET_DIR="${DOCTOR_PASS_DIR}"

if [ "${DOCTOR_USE_IN_TREE_FIXTURE}" = "1" ]; then
  git -C "${ROOT_DIR}" restore --worktree --source=HEAD -- scripts/fixtures/doctor/pass 2>/dev/null || true
  reset_sandbox_dir "${TARGET_DIR}/node_modules"
else
  reset_sandbox_dir "${DOCTOR_SANDBOX_ROOT}"
  cp -R "${ROOT_DIR}/scripts/fixtures/doctor/pass" "${TARGET_DIR}"
fi

echo "[doctor] create package tarball"

pushd "${ROOT_DIR}" >/dev/null

TARBALL="$(npm pack | tail -n 1)"

popd >/dev/null

echo "[doctor] copy fixture (target: ${TARGET_DIR})"

pushd "${TARGET_DIR}" >/dev/null

# textlint のみ npm 経由で入れる。tarball は npm install しない —
# @s2j/docs-linter 依存の Git 取得 (npm 12 EALLOWGIT / allow-git=root の推移的非対象) を避ける。
npm install --no-package-lock --no-save textlint

DOCS_LINTER_DIR="node_modules/@s2j/docs-linter"
mkdir -p "${DOCS_LINTER_DIR}"
tar -xzf "${ROOT_DIR}/${TARBALL}" -C "${DOCS_LINTER_DIR}" --strip-components=1 package

rm -f "${ROOT_DIR}/${TARBALL}"

popd >/dev/null

echo "[doctor] setup complete"