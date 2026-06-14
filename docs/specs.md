# 📘 S2J Docs Linter - SPECS

確定した仕様ドキュメントへの導線です。

## 仕様書一覧

| ファイル | 概要 |
|---|---|
| [npm_usage.md](./npm_usage.md) | 使い方 (`install` / CLI / `init` / `doctor` / CI / VSCode) |
| [npm_package_spec.md](./npm_package_spec.md) | npm パッケージ仕様 (`@s2j/docs-linter`、CLI、互換、移行) |
| [cli_tooling_spec.md](./cli_tooling_spec.md) | CLI ツール仕様 (`init` / `doctor`、テスト仕様) |
| [git_submodule.md](./git_submodule.md) | Git Submodule 利用 (非推奨・後方互換) |
| [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) | npm 認証・シークレット管理 (OIDC / Trusted Publishing) |
| [release.md](./release.md) | npm リリース手順 (GHA tag publish、CHANGELOG) |
| [versioning_policy.md](./versioning_policy.md) | SemVer 方針 (MAJOR / MINOR / PATCH) |
| [maintenance_policy.md](./maintenance_policy.md) | メンテナンス方針 (リリース / CI / 依存 / セキュリティ) |
| [semantic_release_evaluation.md](./semantic_release_evaluation.md) | semantic-release 採用可否評価 (結論: 非採用) |

## ロードマップ

npm モジュール化 initiative (フェーズ1–4) は **クローズ** 済みです。進捗の詳細は [archive/mod-npm/status.md](./archive/mod-npm/status.md) をご覧ください。

| フェーズ | 概要 |
|---|---|
| フェーズ1 | npm パッケージの基盤構築 |
| フェーズ2 | GitHub Actions による OIDC 公開 |
| フェーズ3 | コンシューマーの移行完了 |
| フェーズ4 | OSS 運用の成熟度向上 |

## 進行管理

| 種別 | 場所 |
|------|------|
| 完了した改修 | [archive/](./archive/README.md) |
