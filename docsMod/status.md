## S2J Docs Linter - 実装状況

本ページは、[npm パッケージ仕様](./npm_package_spec.md) にもとづく実装修正の進捗を一覧化します。仕様書の [フェーズ1実装状況](./npm_package_spec.md#フェーズ1実装状況-2026-05) と相互参照します。

**移行フェーズ**は [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) に従い、現時点は **フェーズ1** (Git Submodule と npm パッケージの併存) です。

最終更新 …2026-05-17 — `@s2j/docs-linter@1.0.10`、tarball 22 entries (`npm run verify:tarball` 成功)、root 互換ミラー (`base/` `swift/` `wordpress/`)、[移行のワークフロー例 - フェーズ1優先タスク](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク) 完了 ([npm_usage.md](./npm_usage.md) の `lint:docs` before/after、`examples/lint-docs*.yml` の `npx s2j-docs-linter` 化)

### 仕様書 (参照元)

| ドキュメント | 内容 |
| --- | --- |
| [npm パッケージ仕様](./npm_package_spec.md) | npm 配布、CLI、互換、移行の全体仕様 (フェーズ1優先タスク見出し含む) |
| [npm 使い方ガイド](./npm_usage.md) | install / CLI / `package.json` `lint:docs` 移行 / VSCode・`extends` / CI |
| [仕様書の起点](./specs.md) | 上記への導線 |

### フェーズ1: サマリー

仕様のフェーズ1優先タスク ([Publishing](./npm_package_spec.md#publishing---フェーズ1優先タスク)、[本リポジトリ `scripts`](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク)、[移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク)、[互換移行戦略](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク)、[npm 使い方ガイド整合](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク)) と本ページの完了条件を一致させています。

| 項目 | 状態 |
| --- | --- |
| 移行フェーズ | **フェーズ1** 進行中 (併存) — 本リポジトリのコード・文書・検証は **完了**、レジストリ公開と受け入れ試験のみ未 |
| **本リポジトリ 実装％** | **100%** — 本リポジトリ責務の完了条件 (#1–10, #13–15) はすべて **済** |
| **フェーズ1全体 実装％** | **87%** — 完了条件 15 項目中 13 項目 **済** (下表「フェーズ1完了条件」参照) |
| npm パッケージ名 | `@s2j/docs-linter` (`package.json` 反映済み) |
| 正式 CLI | `s2j-docs-linter` (互換: `docs-lint`) |
| プリセットレイアウト | `presets/{base,swift,wordpress}/` を維持 + tarball に root 互換ミラー (`base/` `swift/` `wordpress/`) を同梱 |
| ビルド entrypoint | **済** — `npm run build` (`tsc` + `setup-npmignore` + `link-preset-layout-compat`)、`prepare` → `build` |
| tarball (`npm pack`) | **済** — `verify:tarball` で必須パス・除外パスを検証 (**22 entries**) |
| publish 準備 (`npm publish --dry-run`) | **済** — ローカル dry-run 成功 |
| README / npm_usage / examples 整合 | **済** — install・CLI・`lint:docs` 移行例・VSCode/`extends`・CI サンプルを一致 |
| npm レジストリ公開 | **未** — 手動 `npm publish --access public` 待ち (#11) |

| 区分 (仕様書) | フェーズ1の状態 |
| --- | --- |
| 実装済み | メタデータ、CLI (`--help` / `--version` / `--profile`)、`bin` 互換 `docs-lint`、`scripts` 整理、本リポジトリ `lint*` の CLI 経由化、tarball 検証 (22 entries)、root 互換レイアウト、`examples/lint-docs*.yml` の `npx s2j-docs-linter` 化、[npm_usage.md](./npm_usage.md) の `lint:docs` / VSCode / `extends` 移行例、`dependencies` 移行、README npm 手順 (併記) |
| 未実施 | npmjs への初回 publish (#11)、利用側受け入れ試験 (#12)、`.github/workflows/npm-publish.yml` (フェーズ2)、README の Submodule → レガシー化 (フェーズ2以降) |

**実装％の算出**

| スコープ | 分子 / 分母 | 実装％ |
| --- | --- | ---: |
| フェーズ1全体 | 完了条件 #1–15 のうち **済** の件数 | **13 / 15 → 87%** |
| 本リポジトリ責務のみ | #1–10, #13–15 (計 **13** 件) | **13 / 13 → 100%** |
| 本リポジトリ外 (フェーズ1クローズに必要) | #11–12 (計 2 件) | **0 / 2 → 0%** |

### フェーズ1優先タスクと完了条件の対応

| 仕様セクション (フェーズ1優先) | 完了条件 # | 状態 | 実装％ |
| --- | ---: | --- | ---: |
| [Publishing](./npm_package_spec.md#publishing---フェーズ1優先タスク) | #1–2, #4–9 | 済 (publish 本体 #11 のみ未) | 100 (本リポジトリ内) |
| [本リポジトリ `scripts`](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク) | #8, #7 | 済 | 100 |
| [移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク) | #10, #15 | 済 | 100 |
| [互換性・移行戦略](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク) | #13–14 | 済 | 100 |
| [npm 使い方ガイド整合](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク) | #3, #10 | 済 | 100 |
| (運用) レジストリ公開・受け入れ試験 | #11–12 | 未 | 0 |

### フェーズ1完了条件

仕様のフェーズ1優先タスクのゴール・責務に対応します。検証は 2026-05-17 時点で `npm run verify:tarball` および `node dist/bin/run-textlint.js --version` (→ `1.0.10`) を確認済みです。

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| 1 | `npm pack` 成功 | **済** | 100 | `npm pack` または `npm run pack:check` |
| 2 | `npm publish --dry-run` 成功 | **済** | 100 | `npm run publish:dry-run` |
| 3 | `npx s2j-docs-linter --help` 成功 | **済** | 100 | `node dist/bin/run-textlint.js --help` または tarball インストール後 |
| 4 | tarball 内容検証 (`presets/` + root 互換パス) | **済** | 100 | `npm run verify:tarball` — **22 entries**、`package/{base,swift,wordpress}/` と `package/presets/*/` |
| 5 | `package.json` 必須フィールド (`name`, `version`, `files`, `bin`) | **済** | 100 | `@s2j/docs-linter@1.0.10`、`files` に `presets/` と `base/` `swift/` `wordpress/` |
| 6 | `LICENSE` / `README.md` を publish 対象に含める | **済** | 100 | `files` および pack 出力 |
| 7 | publish 用 `scripts` (`pack:check`, `publish:dry-run`, `lint:package`, `verify:tarball`) | **済** | 100 | `package.json` `scripts` 節 |
| 8 | ビルド entrypoint (`clean` / `build` / `prepare`) | **済** | 100 | `npm run build` — `tsc` + `setup-npmignore` + `link-preset-layout-compat` |
| 9 | `files` に runtime のみ同梱 (`scripts/patch-…` のみ) | **済** | 100 | `npm run verify:tarball` (禁止: `src/`, `examples/`, `docs/`) |
| 10 | README / [npm_usage.md](./npm_usage.md) / install examples の整合 | **済** | 100 | install・CLI・`--profile`・`lint:docs` before/after；README 方法2 ↔ `npm_usage.md` |
| 11 | npmjs への初回 `npm publish` | **未** | 0 | 手動 `npm publish --access public` (GHA 自動 publish はフェーズ2) |
| 12 | 利用側プロジェクトでの受け入れ試験 | **未** | 0 | 各利用プロジェクトで `npm install --save-dev @s2j/docs-linter` と `npx s2j-docs-linter` |
| 13 | root 互換レイアウト (`base/` `swift/` `wordpress/` を tarball 同梱) | **済** | 100 | ビルド時ミラー + `verify:tarball` の `package/swift/.textlintrc.swift.json` 等 |
| 14 | VSCode / `extends` の移行ガイド ([npm_usage.md](./npm_usage.md)) | **済** | 100 | Submodule → `node_modules/@s2j/docs-linter/{swift,presets/*,base}/` の before/after |
| 15 | 移行のワークフロー例 (`examples/` + `lint:docs` 移行ドキュメント) | **済** | 100 | [examples/lint-docs*.yml](../examples/lint-docs.yml) の `npx s2j-docs-linter`；[npm_usage.md](./npm_usage.md) の Submodule → npm 表 |

**集計**: 完了 **13 / 15** (実装％ **87%**)。本リポジトリ責務 (#1–10, #13–15) は **13 / 13 (100%)**。

**フェーズ1クローズの目安**: 上表 #11–12 のみが「未」になった時点。本リポジトリのコード・文書・検証基盤は **完了** とみなせます。

### npm 配布: フェーズ1実装範囲

仕様 [npm 配布のための実装修正](./npm_package_spec.md#npm-配布のための実装修正) の責務表に対応します。

| 責務項目 | フェーズ1 | 実装％ | 完了条件 (要約) |
| --- | --- | ---: | --- |
| `package.json` の修正 | 済 | 100 | `@s2j/docs-linter`、`files`、`bin`、`engines` (#5) |
| CLI コマンドの公開 | 済 | 100 | `s2j-docs-linter` / 互換 `docs-lint`、`--help` / `--version` / `--profile` (#3) |
| npm publish に対応する tarball 構成 | 済 | 100 | `verify:tarball` で必須・禁止パスを自動検証 (22 entries) (#4, #9) |
| レイアウト互換 (`base/` `swift/` `wordpress/`) | 済 | 100 | ビルド時 `presets/*` ミラー、VSCode パス差し替えのみで移行可 (#13) |
| publish 用 `scripts` | 済 | 100 | `pack:check`、`publish:dry-run`、`lint:package`、`verify:tarball` (#7) |
| 本リポジトリ `scripts` 整理 | 済 | 100 | `clean` / `build` / `prepare`、CLI 経由 `lint*` (#8) |
| README の更新 (フェーズ1範囲) | 済 | 100 | Submodule 主導線 + 方法2 (npm) 併記、`npm_usage.md` 導線 (#10) |
| [npm 使い方ガイド](./npm_usage.md) との整合 | 済 | 100 | install / CLI / `lint:docs` / CI / VSCode・`extends` が README・仕様と一致 (#10, #14) |
| `examples/` の npm 版 | 済 | 100 | `npx s2j-docs-linter`、`@s2j/docs-linter` install コメント (#15) |
| GitHub Actions publish ワークフロー | 未 | 0 | `.github/workflows/npm-publish.yml` (フェーズ2) |

### 機能一覧 (実装状況サマリー)

| 機能名 (仕様セクション) | 実装済み/未実装 | 実装％ | 完了条件 (要約) | 備考 |
| --- | --- | ---: | --- | --- |
| [Publishing - フェーズ1優先タスク](./npm_package_spec.md#publishing---フェーズ1優先タスク) | 一部 | 90 | ローカル pack / dry-run / tarball 検証が成功 (#1–2, #4–9) | レジストリ初回 publish (#11) のみ未 |
| [npm パッケージ仕様](./npm_package_spec.md) (文書) | 実装済み | 100 | コードと仕様の同期 | フェーズ1優先タスク・実装済み注記を反映 |
| [`package.json` メタデータ更新](./npm_package_spec.md#packagejson-メタデータ更新) | 実装済み | 100 | `@s2j/docs-linter`、semver、`LICENSE` 等 | `1.0.10` (#5–6) |
| [CLI Entrypoint 公開](./npm_package_spec.md#cli-entrypoint-公開) | 実装済み | 100 | `bin` / `--profile` / 設定解決 / `--help` / `--version` | textlint を `node` 直実行 (#3) |
| [ファイルスコープの最適化 (Publish)](./npm_package_spec.md#ファイルスコープの最適化を-publish) | 実装済み | 100 | `files` + `verify:tarball` | `presets/` + root ミラー (#4, #9) |
| [CLI 互換レイヤ](./npm_package_spec.md#cli-互換レイヤ) / [互換性に関する要件](./npm_package_spec.md#互換性に関する要件) | 実装済み | 100 | パッケージ root 基準の preset 解決、互換 `docs-lint` | |
| [互換性に関する、移行戦略 - フェーズ1優先](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク) | 実装済み | 100 | tarball に `base/` `swift/` `wordpress/` 同梱 | `npm_usage.md` に VSCode / `extends` (#13–14) |
| [依存関係レビュー](./npm_package_spec.md#依存関係レビュー) | 実装済み | 100 | 実行時 → `dependencies` | |
| [Publishing](./npm_package_spec.md#publishing) (全体) | 一部 | 87 | 完了条件 13/15 済 | #11–12 未。自動 tag publish はフェーズ2 |
| [本リポジトリ `package.json` の `scripts` - フェーズ1優先](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク) | 実装済み | 100 | `clean` / `build` / `prepare` / publish 検証群 / CLI 経由 `lint*` | `postinstall` はフェーズ1非対象で現状維持 (#8) |
| [移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例) | 実装済み | 100 | `examples/lint-docs*.yml` で `npx s2j-docs-linter` | Submodule 取得ステップは併存 (#15) |
| [移行のワークフロー例 - フェーズ1優先](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク) | 実装済み | 100 | migration examples + `lint:docs` before/after | [npm_usage.md](./npm_usage.md) + `examples/` (#10, #15) |
| [互換性に関する、移行戦略](./npm_package_spec.md#互換性に関する移行戦略) (フェーズ1) | 実装済み | 100 | 併存基盤 + root 互換レイアウト + 移行ドキュメント | 利用側 VSCode / CI 適用は各プロジェクト |
| [README 移行](./npm_package_spec.md#readme-移行) | フェーズ1済 | 100 | Submodule 主 + npm 併記、動作する CLI 例 | フェーズ2でデフォルト npm 化 (#10) |
| [GitHub Actions Publish ワークフロー](./npm_package_spec.md#github-actions-publish-ワークフロー) | 未実装 | 0 | `.github/workflows/npm-publish.yml` | フェーズ1は設計のみ (フェーズ2実装) |
| [npm 使い方ガイド との整合 - フェーズ1優先](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク) / [npm_usage.md](./npm_usage.md) | 実装済み | 100 | README のコマンドが実際に動く | `lint:docs` / VSCode / `extends` / CI (#10, #14) |
| [VSCode 互換戦略](./npm_package_spec.md#vscode-互換戦略) | ガイド済み | 100 | [npm_usage.md](./npm_usage.md) に移行例 | 利用側での設定変更は各プロジェクト (#14) |
| [CI 互換戦略](./npm_package_spec.md#ci-互換戦略) | ガイド済み | 100 | `npm_usage.md` / `examples/` に CI 例 | 利用側 CI 移行は各プロジェクト (#15) |
| [バージョン管理ポリシー](./npm_package_spec.md#バージョン管理ポリシー) | 方針のみ | — | semver 運用 | publish 開始後に運用 |
| [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) フェーズ2〜4 | 未着手 | 0 | フェーズ2以降 | |

### フェーズ1で完了した項目

仕様 [フェーズ1で完了した項目](./npm_package_spec.md#フェーズ1で完了した項目) および各フェーズ1優先タスクの責務と一致します。

* `@s2j/docs-linter` としての `package.json` メタデータ
* CLI `s2j-docs-linter` (互換 `docs-lint`)、`-h` / `--help`、`-V` / `--version`、`--profile`
* `presets/` レイアウトの維持と tarball 同梱
* root 互換ミラー … ビルド時に `base/` `swift/` `wordpress/` を `presets/*` から生成 (`link-preset-layout-compat`)
* 実行時 `dependencies` への移行
* README への npm 手順の併記 (Submodule は引き続き主導線) および [npm_usage.md](./npm_usage.md) への導線
* [npm_usage.md](./npm_usage.md) … install / CLI / **`package.json` `lint:docs` 移行例 (WordPress・Swift)** / GitHub Actions / **VSCode・`extends` 移行例**
* publish 検証 scripts: `pack:check`, `publish:dry-run`, `verify:tarball`, `lint:package`
* tarball 自動検証 (`scripts/verify-tarball.cjs`) — **22 entries**
* `examples/lint-docs*.yml` の `npx s2j-docs-linter` 化、`@s2j/docs-linter` install 手順コメント
* 本リポジトリ `scripts` 整理 … `clean` / `build` (`tsc` + ミラー生成) / `prepare`、publish 用 dry-run 群
* 本リポジトリ `lint` / `lint:wp` / `lint:swift` をビルド済み CLI 経由に統一
* `files` を runtime 最小構成に整理 (`scripts/patch-wp-prh-colon-quote.cjs` のみ同梱)
* `package.json` `bin` の互換 CLI を `docs-lint` に統一

### フェーズ1で完了した主な変更 (コード・文書)

| 対象 | 内容 | 完了条件 |
| --- | --- | ---: |
| `src/bin/run-textlint.ts` | preset 解決、`--profile`、`-h`/`--help`、`-V`/`--version`、textlint を `node` 直実行、NODE_PATH 連結 | #3 |
| `package.json` | publish 用 scripts、`files` に root ミラー、`build` にミラー生成、`bin.docs-lint` | #5–8 |
| `tsconfig.build.json` | 本番ビルド用 (`noEmit: false`、`dist/` 出力) | #8 |
| `scripts/verify-tarball.cjs` | `presets/*` と `base/` `swift/` `wordpress/` の必須パス・禁止パス検証 | #4, #9 |
| `src/scripts/link-preset-layout-compat.ts` | ビルド時に `presets/*` → root `base/` `swift/` `wordpress/` をミラー | #13 |
| `examples/lint-docs*.yml` | lint ステップを `npx s2j-docs-linter` に更新、npm / `npm_usage` 導線コメント | #15 |
| `README.md` | 方法2 (npm) を `@s2j/docs-linter` / `s2j-docs-linter` に更新、`npm_usage.md` へ導線 | #10 |
| `docsMod/npm_usage.md` | `lint:docs` before/after、`--profile`、CI、VSCode・`extends` 移行例 | #10, #14, #15 |
| `docsMod/npm_package_spec.md` | フェーズ1優先タスク・実装済み注記 (Publishing / ワークフロー移行 / 互換 / npm 使い方) | 文書 |

### フェーズ1の残タスク

仕様 [フェーズ1の残タスク](./npm_package_spec.md#フェーズ1の残タスク-本リポジトリ) と一致します。本リポジトリ内の実装・文書タスクは **完了** (実装％ **100%**)。フェーズ1クローズに必要なのは下表の運用タスクのみです。

| # | タスク | 優先度 | 実装％ | 完了条件 (#) |
| ---: | --- | --- | ---: | ---: |
| 1 | npmjs への初回 `npm publish --access public` | **必須** (フェーズ1クローズ) | 0 | #11 — `npm view @s2j/docs-linter version` が `1.0.10` |
| 2 | 利用側プロジェクトでの受け入れ試験 | 推奨 | 0 | #12 — Submodule 併存のまま `npx s2j-docs-linter` と VSCode 互換パスが動作 |
| 3 | `.github/workflows/npm-publish.yml` | フェーズ2 | 0 | tag `v*` で自動 publish |

### 補足

* **公開 API**: `presets/{base,swift,wordpress}/` 配下パス、root 互換 `base/` `swift/` `wordpress/`、CLI 名、`extends` 用相対パスは互換契約 ([現在の利用状況の分析](./npm_package_spec.md#現在の利用状況の分析))。
* **ビルド**: `npm run build` = `tsc -p tsconfig.build.json` + `setup-npmignore` + `link-preset-layout-compat` (root ミラー生成)。`prepare` は `npm run build` を呼ぶ。
* **root ミラー**: `base/` `swift/` `wordpress/` は `.gitignore` 対象 (生成物)。publish tarball にのみ同梱。
* **postinstall**: フェーズ1 scripts 仕様の非対象。現状は `setup-npmignore` と `scripts/patch-wp-prh-colon-quote.cjs` を実行。tarball には patch スクリプトのみ同梱。
* **ローカル検証の一式** (2026-05-17 確認済み): 下記にコマンドを掲載。

```bash
npm run build             # tsc + .npmignore + preset レイアウトミラー
npm run verify:tarball    # pack + tarball 内容検証 (22 entries)
npm run publish:dry-run   # publish シミュレーション
npm run pack:check        # pack dry-run (lint:package と同等)
node dist/bin/run-textlint.js --help
node dist/bin/run-textlint.js --version   # => 1.0.10
npm run lint              # 本リポジトリ README 等 (build 後)
```
