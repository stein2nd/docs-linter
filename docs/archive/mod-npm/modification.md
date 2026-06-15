# 📘 S2J Docs Linter - Modification

npm モジュール化改修の進行管理資料です。
確定した仕様は [docs/specs.md](../../specs.md) に移行済みです。

## 確定仕様 (docs/ に移行済み)

| ファイル | 概要 |
|----------|------|
| [npm_package_spec.md](../../specifications/npm_package_spec.md) | `@s2j/docs-linter` npm パッケージ仕様 |
| [npm_usage.md](../../cli/npm_usage.md) | npm 使い方ガイド |
| [cli_tooling_spec.md](../../specifications/cli_tooling_spec.md) | CLI 共通方針 |
| [init.md](../../cli/init.md) | `init` コマンド仕様 |
| [doctor.md](../../cli/doctor.md) | `doctor` コマンド仕様 |
| [npm_auth_secret_manage_spec.md](../../specifications/npm_auth_secret_manage_spec.md) | Trusted Publishing (OIDC) 認証 |
| [release.md](../../release.md) | GHA tag publish 手順 |
| [versioning_policy.md](../../versioning_policy.md) | SemVer 方針 |
| [maintenance_policy.md](../../maintenance_policy.md) | メンテナンス方針 |
| [git_submodule.md](../git_submodule.md) | Git Submodule (非推奨・後方互換) |

## 改修概要

Git Submodule 型の shared lint モジュールから、npm レジストリ上の **`@s2j/docs-linter`** パッケージへの移行。

| フェーズ | 内容 | 状態 |
|----------|------|------|
| フェーズ 1 | npm 配布基盤 (メタデータ、CLI、`files`、tarball 検証) | ✅ クローズ |
| フェーズ 2 | GitHub Actions OIDC publish | ✅ クローズ |
| フェーズ 3 | 利用側 Submodule → npm 移行 (9リポ) | ✅ クローズ |
| フェーズ 4 | OSS 成熟度 (SemVer、CHANGELOG、CI、CONTRIBUTING、CLI ツール) | ✅ クローズ |

## 記録

| ファイル | 概要 |
|----------|------|
| [status.md](./status.md) | フェーズ1–4進捗、完了条件、Backlog |
