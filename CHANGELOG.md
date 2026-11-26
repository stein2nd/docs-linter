# S2J Docs Linter - CHANGELOG

`@s2j/docs-linter` の npm 公開版における主な変更を記録します。

## [Unreleased]

## [1.0.36] - 2026-11-26

* `engines.node` を `>=22.12.0` に更新 (textlint v16系と整合)
* README / `init` 生成ワークフロー / ドキュメントの Node 前提を v22.12に統一
* `vite.config.ts` の `build.target` を `node22` にし、本番ビルドは tsc である旨をコメント
* `setup-doctor-pass.sh` で `@s2j/docs-linter` を tarball 展開のみ配置 (npm 12 `EALLOWGIT` 回避)
* `scripts/lib/reset-sandbox-dir.sh` / `doctor-sandbox-paths.sh` — Cursor サンドボックス向け (`.vscode` 作成不可時は in-tree フィクスチャ + `git restore`、DOCTOR-011は `.vscode` なし複製先で検証)

## [1.0.35] - 2026-11-26

* CLI の `NODE_PATH` 連結に `path.delimiter` を使用 (Windows では `;`) — Issue #1
* README / `docs/cli/npm_usage.md` に Windows 向け scripts 方針を追記 (CLI 推奨・`cross-env` は利用側の移行期オプション) — Issue #1
* Vite v8 (Rolldown) に合わせ、直接の `rollup` devDependency と `overrides` を削除
* `tsconfig.build.json` に `rootDir` / `outDir` / `include` を明示 (TypeScript v7の出力レイアウト警告回避)
* README のバッジを Rollup から Rolldown に更新
* `no-dead-link` で `https://www.gnu.org` を `ignore`（到達不能・タイムアウト時の誤検出回避。GPL バッジ用の安定 URL）

## [1.0.34] - 2026-11-20

* CI / npm publish ワークフローを更新 — `ubuntu-24.04` に固定、`actions/checkout@v5`、`actions/setup-node@v5`、`upload-artifact@v6`、`action-gh-release@v3` (Node v24ランタイム向け)

## [1.0.33] - 2026-11-20

* 依存関係を更新 — `textlint` ^16.1.1、`textlint-rule-preset-swift-docs-ja` ^1.0.15、`textlint-rule-preset-jtf-style` ^3.1.0、`textlint-rule-ja-space-around-code` / `textlint-rule-ja-space-between-half-and-full-width` ^3.1.0、`sudachi-synonyms-dictionary` ^20.0.1、`vite` ^8.3.8、`rollup` ^4.68.7
* README のバッジを更新 — textlint v16.1、Rollup v4.68

## [1.0.32] - 2026-11-05

* WordPress PRH の「の分 → のぶん」ルールによる「の分母」「の分子」の誤検出を、`patch-wp-prh-colon-quote.cjs` (除外文字に「母」「子」) とプリセット allowlist で回避
* 依存関係を更新 — `textlint-rule-preset-swift-docs-ja` ^1.0.13、`vite` ^8.3.6、`rollup` ^4.67.5
* README のバッジを更新 — Rollup v4.67

## [1.0.31] - 2026-10-29

* 依存関係を更新 — `textlint-rule-preset-swift-docs-ja` ^1.0.12、`@types/node` ^26.6.6、`rollup` ^4.66.0
* README のバッジを更新 — Rollup v4.66

## [1.0.30] - 2026-10-24

* 依存関係を更新 — `sudachi-synonyms-dictionary` 20.0.0以降、`textlint-rule-preset-swift-docs-ja` ^1.0.11、`textlint-rule-ja-space-around-code` / `textlint-rule-ja-space-between-half-and-full-width` ^3.0.4、`textlint-rule-prh` ^6.1.1、`vite` ^8.3.5、`rollup` ^4.65.0
* README のバッジを更新 — Rollup v4.65

## [1.0.29] - 2026-10-15

* 依存関係を更新 — `textlint-rule-preset-swift-docs-ja` ^1.0.10、`@types/node` ^26.6.5、`vite` ^8.3.4、`rollup` ^4.64.6

## [1.0.28] - 2026-10-15

* base プリセット allowlist: 見出しの公式 id アンカー `{#…}` を固有名詞 (PRH) 等の対象外に (`/\{#[^}]+\}/`)

## [1.0.27] - 2026-10-04

* プリセット (base / Swift / WordPress) とルート設定の allowlist に誤検出除外を追加 — リファラー、エントリー / エントリ、レイヤー / レイヤ (プレイヤーは対象外)、ローダー、スクロール、ロールバック、「の分担」、など
* WordPress プリセットの allowlist に `@wordpress/*` パッケージ名を追加
* 依存関係を更新 — `textlint-rule-preset-swift-docs-ja` ^1.0.9、`rollup` ^4.64.0
* README のバッジを更新 — Rollup v4.64

## [1.0.26] - 2026-10-02

* 依存関係を更新 — `textlint-rule-preset-swift-docs-ja` ^1.0.8、`@types/node` ^26.6.4、`vite` ^8.3.2、`rollup` ^4.63.6
* `.vscode/settings.json` で JSON Schema のダウンロードと npm スクリプトエクスプローラーを有効化

## [1.0.25] - 2026-09-26

* 依存関係を更新 — `textlint-rule-preset-swift-docs-ja` ^1.0.7、`@types/node` ^26.6.3、`vite` ^8.3.1、`rollup` ^4.63.5
* README のバッジを更新 — Vite v8.3

## [1.0.24] - 2026-09-09

* WordPress PRH の「の分 → のぶん」ルールが「の分担」を「のぶん担」と誤検出する問題を、`patch-wp-prh-colon-quote.cjs` で除外文字に「担」を足して回避
* README / `docs/cli/npm_usage.md` に上記 postinstall パッチの説明を追記
* 依存関係を更新 — `textlint-rule-preset-swift-docs-ja` ^1.0.6、`@types/node` ^26.5.0

## [1.0.23] - 2026-08-31

* 依存関係を更新 — `textlint-rule-preset-swift-docs-ja` ^1.0.5、`@types/node` ^26.4.0、`vite` ^8.2.2、`rollup` ^4.63.1
* README のバッジを更新 — Rollup v4.63

## [1.0.22] - 2026-08-08

* 依存関係を更新 — `sudachi-synonyms-dictionary` ^19.0.0 (同義語辞書 v19.x)、`textlint` ^15.8.0、`textlint-rule-preset-swift-docs-ja` ^1.0.4、`textlint-rule-ja-space-around-code` / `textlint-rule-ja-space-between-half-and-full-width` ^3.0.3、`@types/node` ^26.2.0、`vite` ^8.2.1、`rollup` ^4.62.4
* README のバッジを更新 — textlint v15.8、Vite v8.2

## [1.0.21] - 2026-07-23

* `.npmrc` に `allow-git=root` を追加 — npm **12** 以降で Git 依存 (`textlint-rule-preset-wp-docs-ja`) の取得を許可し、開発時の `npm install` で `EALLOWGIT` が出ないようにした
* `engines.npm` を `>=10 <11.12.0 || >=11.12.1 || >=12` に更新 — npm 12 を明示的にサポート (最低 v10、不具合のある v11.12.0 のみ除外)
* README に「npm 12 と Git 依存」を追加 — 利用側向けの `--allow-git=root` / `.npmrc` 手順、`EBADENGINE` 対策、依存更新チェックリストと `install:compat` の説明を整理
* 依存関係を更新 — `@types/node` ^26.1.1、`typescript` ^7.0.2、`vite` ^8.1.5、`rollup` ^4.62.2、`textlint-rule-preset-swift-docs-ja` ^1.0.3、`textlint-rule-ja-space-around-code` / `textlint-rule-ja-space-between-half-and-full-width` ^3.0.2 など
* `lint:wp` の対象 glob に `**/**/*.md` を追加 — ネストした Markdown も lint 対象に
* ドキュメント表記を統一 —「以下」→「下記」、「読み込み」→「ロード」、`idempotent` →「冪等 (べきとう)」、SLA の日本語注釈など (README、CONTRIBUTING、`docs/` 配下)

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
