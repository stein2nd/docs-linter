# S2J Docs Linter - CHANGELOG

`@s2j/docs-linter` の npm 公開版における主な変更を記録します。

## [1.0.16] - 2026-06-04

- README を npm 主導線に再構成 (Quick Start / Requirements 追加、インストール手順の整理)
- Git Submodule 利用手順を [docs/git_submodule.md](./docs/git_submodule.md) に切り出し (後方互換・非推奨)。README から導線を追加
- [docsMod/npm_usage.md](./docsMod/npm_usage.md) · [docsMod/status.md](./docsMod/status.md) · [docsMod/specs.md](./docsMod/specs.md) など、ドキュメント間の導線を同期
- Bug report テンプレート (`.github/ISSUE_TEMPLATE/bug_report.md`) のコードブロックを `zsh` に統一
- 開発依存 `rollup` を 4.61.1 に更新

## [1.0.15] - 2026-06-02

- ドキュメントに `postinstall` (`patch-wp-prh-colon-quote.cjs`) の説明を追記 — 変更対象は `node_modules/textlint-rule-preset-wp-docs-ja/prh-rules/wordpress.yml` のみ (利用者プロジェクトの設定ファイルは変更しない)

## [1.0.14] - 2026-06-02

- CLI サブコマンド `init` — プロジェクト初期化 (`.textlintrc.json` / VSCode 設定 / GitHub Actions ワークフロー / `lint:docs` 生成)
- CLI サブコマンド `doctor` — 環境診断 (PASS / WARN / FAIL、`--path` 対応)
- CLI エントリポイントをサブコマンドルーター (`init` / `doctor` / lint) に統合

## [1.0.13] - 2026-05-25

- GitHub Actions (npm Trusted Publishing / OIDC) による初の自動 publish
- tag `v*` push 連動の release workflow 運用開始
- tarball artifact (`s2j-docs-linter-v1.0.13`) の GHA 保存

## [1.0.12] - 2026-05-24

- 手動 publish (`npm login` 経由) — ローカル publish 手順の運用確認

## [1.0.11]

- `sudachi-synonyms-dictionary` を `dependencies` に追加
- 利用側で peer 依存不足により lint が失敗する問題を解消

## [1.0.10] - 2026-05-23

- npmjs 初回公開 (`@s2j/docs-linter`)
- CLI `s2j-docs-linter` (互換 `docs-lint`)、presets (`base` / `swift` / `wordpress`)
- tarball 検証 (`verify:tarball`)、artifact 生成 (`pack:artifact`)、publish dry-run 基盤
