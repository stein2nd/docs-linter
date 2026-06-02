#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
TARGET_DIR="${ROOT_DIR}/.sandbox/doctor/pass"

rm -rf "${ROOT_DIR}/.sandbox/doctor"
mkdir -p "${ROOT_DIR}/.sandbox/doctor"

echo "[doctor] create package tarball"

pushd "${ROOT_DIR}" >/dev/null

TARBALL="$(npm pack | tail -n 1)"

popd >/dev/null

echo "[doctor] copy fixture"

cp -R "${ROOT_DIR}/scripts/fixtures/doctor/pass" "${TARGET_DIR}"

pushd "${TARGET_DIR}" >/dev/null

npm install --no-package-lock --no-save textlint "${ROOT_DIR}/${TARBALL}"

popd >/dev/null

echo "[doctor] setup complete"
