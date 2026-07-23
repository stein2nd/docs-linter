# S2J Docs Linter - CHANGELOG

`@s2j/docs-linter` の npm 公開版における主な変更を記録します。

## [Unreleased]

## [1.0.21] - 2026-07-23

* `.npmrc` に `allow-git=root` を追加 — npm **12** 以降で Git 依存 (`textlint-rule-preset-wp-docs-ja`) の取得を許可し、開発時の `npm install` で `EALLOWGIT` が出ないようにした
* `engines.npm` を `>=10 <11.12.0 || >=11.12.1 || >=12` に更新 — npm 12 を明示的にサポート (最低 v10、不具合のある v11.12.0 のみ除外)
* README に「npm 12 と Git 依存」を追加 — 利用側向けの `--allow-git=root` / `.npmrc` 手順、`EBADENGINE` 対策、依存更新チェックリストと `install:compat` の説明を整理
* 依存関係を更新 — `@types/node` ^26.1.1、`typescript` ^7.0.2、`vite` ^8.1.5、`rollup` ^4.62.2、`textlint-rule-preset-swift-docs-ja` ^1.0.3、`textlint-rule-ja-space-around-code` / `textlint-rule-ja-space-between-half-and-full-width` ^3.0.2 など
* `lint:wp` の対象 glob に `**/**/*.md` を追加 — ネストした Markdown も lint 対象に
* ドキュメント表記を統一 — 「以下」→「下記」、「読み込み」→「ロード」、`idempotent` →「冪等 (べきとう)」、SLA の日本語注釈など (README、CONTRIBUTING、`docs/` 配下)

## [1.0.20] - 2026-06-15

* ドキュメント再構成 — 仕様書を `docs/specifications/`、CLI ドキュメントを `docs/cli/` に整理。`cli_tooling_spec.md` から `init.md`、`doctor.md` を分割
* `git_submodule.md`、`semantic_release_evaluation.md` を `docs/archive/` に移動
* `no-dead-link` に `ignoreRedirects: true` を設定 (root、`presets/base`、examples)。root では npmjs.com 向け `preferGET` も追加
* README、`specs.md`、archive/mod-npm、examples、GHA ワークフロー内コメントのリンクを新パスに同期

## [1.0.19] - 2026-06-14

* ドキュメント整理 — `docsMod/` を `docs/` に移行、npm モジュール化 initiative を `docs/archive/mod-npm/` にアーカイブ
* `docs/specs.md` を仕様ハブとして再構成、`docs/archive/README.md` に完了 initiative 導線を追加
* README、CONTRIBUTING、各仕様書、examples、GHA コメント内のリンクを新パスに更新

## [1.0.18] - 2026-06-10

* `textlint-rule-preset-swift-docs-ja` を npm 公開 (`^1.0.2`) — 依存を GitHub 参照から registry 取得に切り替え
* `npm install` 時に GitHub SSH 認証が不要になり、Swift プリセットの導入が簡素化

## [1.0.17] - 2026-06-08

* ライセンスを GPL-2.0-or-later から **GPL-3.0-or-later** に変更
* `init` の生成物を拡張 — `.vscode/extensions.json` / `.vscode/README.md` / `.vscode/textlint.settings.jsonc.example` / `.textlintignore` を追加
* `init` が生成する `.vscode/settings.json` を更新 (`${workspaceFolder}` 形式、拡張未対応の `textlint.enable` / `defaultFormatter` を削除)
* リポジトリ用 `.textlintignore` を追加 (init テンプレート README を lint 対象外)
* `.gitignore` で `.vscode/` 配下の追跡対象ファイルを拡張

## [1.0.16] - 2026-06-04

* README を npm 主導線に再構成 (Quick Start / Requirements 追加、インストール手順の整理)
* Git Submodule 利用手順を [docs/archive/git_submodule.md](./docs/archive/git_submodule.md) に切り出し (後方互換・非推奨)。README から導線を追加
* [docs/cli/npm_usage.md](./docs/cli/npm_usage.md)、[docs/archive/mod-npm/status.md](./docs/archive/mod-npm/status.md)、[docs/specs.md](./docs/specs.md) など、ドキュメント間の導線を同期
* Bug report テンプレート (`.github/ISSUE_TEMPLATE/bug_report.md`) のコードブロックを `zsh` に統一
* 開発依存 `rollup` を 4.61.1 に更新

## [1.0.15] - 2026-06-02

* ドキュメントに `postinstall` (`patch-wp-prh-colon-quote.cjs`) の説明を追記 — 変更対象は `node_modules/textlint-rule-preset-wp-docs-ja/prh-rules/wordpress.yml` のみ (ユーザープロジェクトの設定ファイルは変更しない)

## [1.0.14] - 2026-06-02

* CLI サブコマンド `init` — プロジェクト初期化 (`.textlintrc.json` / VSCode 設定 / GitHub Actions ワークフロー / `lint:docs` 生成)
* CLI サブコマンド `doctor` — 環境診断 (PASS / WARN / FAIL、`--path` 対応)
* CLI エントリポイントをサブコマンドルーター (`init` / `doctor` / lint) に統合

## [1.0.13] - 2026-05-25

* GitHub Actions (npm Trusted Publishing / OIDC) による初の自動 publish
* tag `v*` push 連動の release workflow 運用開始
* tarball artifact (`s2j-docs-linter-v1.0.13`) の GHA 保存

## [1.0.12] - 2026-05-24

* 手動 publish (`npm login` 経由) — ローカル publish 手順の運用確認

## [1.0.11]

* `sudachi-synonyms-dictionary` を `dependencies` に追加
* 利用側で peer 依存不足により lint が失敗する問題を解消

## [1.0.10] - 2026-05-23

* npmjs 初回公開 (`@s2j/docs-linter`)
* CLI `s2j-docs-linter` (互換 `docs-lint`)、presets (`base` / `swift` / `wordpress`)
* tarball 検証 (`verify:tarball`)、artifact 生成 (`pack:artifact`)、publish dry-run 基盤
