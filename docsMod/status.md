## S2J Docs Linter - 実装状況

本ページは、[npm パッケージ仕様](./npm_package_spec.md) にもとづく実装修正の進捗を一覧化します。仕様書の [フェーズ1実装状況](./npm_package_spec.md#フェーズ1実装状況-2026-05) と相互参照します。

**移行フェーズ**は [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) に従い、現時点は **フェーズ1** (Git Submodule と npm パッケージの併存) です。

最終更新 …2026-05-17 (`@s2j/docs-linter@1.0.10`、npm 使い方ガイド整合・`docs-lint` 互換 bin・tarball 検証済み)

### 仕様書 (参照元)

| ドキュメント | 内容 |
| --- | --- |
| [npm パッケージ仕様](./npm_package_spec.md) | npm 配布、CLI、互換、移行の全体仕様 (フェーズ1優先タスク含む) |
| [npm 使い方ガイド](./npm_usage.md) | 利用側プロジェクト向け手順 |
| [仕様書の起点](./specs.md) | 上記への導線 |

### フェーズ1: サマリー

仕様書 [概要](./npm_package_spec.md#概要)、[Publishing - フェーズ1優先タスク](./npm_package_spec.md#publishing---フェーズ1優先タスク)、[本リポジトリ `package.json` の `scripts` - フェーズ1優先タスク](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク)、[npm 使い方ガイド との整合 - フェーズ1優先タスク](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク) と一致させています。

| 項目 | 状態 |
| --- | --- |
| 移行フェーズ | **フェーズ1** 進行中 (併存) — 本リポジトリのコード・文書・検証は **完了**、レジストリ公開と受け入れ試験のみ未 |
| **本リポジトリ 実装％** | **100%** — フェーズ1で本リポジトリが担う責務はすべて完了 |
| **フェーズ1全体 実装％** | **83%** — 完了条件 12 項目中 10 項目済 (下表「フェーズ1完了条件」参照) |
| npm パッケージ名 | `@s2j/docs-linter` (`package.json` 反映済み) |
| 正式 CLI | `s2j-docs-linter` (互換: `docs-lint`) |
| プリセットレイアウト | `presets/{base,swift,wordpress}/` を維持 (互換要件どおり) |
| ビルド entrypoint | **済** — `npm run build` (`tsc` + `setup-npmignore`)、`prepare` → `build` |
| tarball (`npm pack`) | **済** — `verify:tarball` で必須パス・除外パスを検証 (14 entries) |
| publish 準備 (`npm publish --dry-run`) | **済** — ローカル dry-run 成功 |
| README / npm_usage / examples 整合 | **済** — 表記・CLI・install 手順を一致 |
| npm レジストリ公開 | **未実施** — 手動 `npm publish --access public` 待ち |

| 区分 (仕様書) | フェーズ1の状態 |
| --- | --- |
| 実装済み | メタデータ、CLI (`--help` / `--version` 含む)、`bin` 互換 `docs-lint`、`scripts` 整理、本リポジトリ `lint*` の CLI 経由化、tarball 検証、`examples/` の `npx s2j-docs-linter` 化、`dependencies` 移行、README npm 手順 (併記)、[npm_usage.md](./npm_usage.md) 拡充・整合 |
| 未実施 | npmjs への初回 publish、利用側受け入れ試験、`.github/workflows/npm-publish.yml` (フェーズ2)、README の Submodule → レガシー化 (フェーズ2以降) |

### フェーズ1完了条件

仕様 [Publishing - フェーズ1優先タスク](./npm_package_spec.md#publishing---フェーズ1優先タスク)、[本リポジトリ `package.json` の `scripts` - フェーズ1優先タスク](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク)、[npm 使い方ガイド との整合 - フェーズ1優先タスク](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク) のゴール・責務に対応します。

| # | 完了条件 | 状態 | 検証方法 |
| ---: | --- | --- | --- |
| 1 | `npm pack` 成功 | **済** | `npm pack` または `npm run pack:check` |
| 2 | `npm publish --dry-run` 成功 | **済** | `npm run publish:dry-run` |
| 3 | `npx s2j-docs-linter --help` 成功 | **済** | `node dist/bin/run-textlint.js --help` または tarball インストール後 |
| 4 | tarball 内容検証 | **済** | `npm run verify:tarball` (`scripts/verify-tarball.cjs`、14 entries) |
| 5 | `package.json` 必須フィールド (`name`, `version`, `files`, `bin`) | **済** | `package.json` — `@s2j/docs-linter@1.0.10`、`s2j-docs-linter` / `docs-lint` |
| 6 | `LICENSE` / `README.md` を publish 対象に含める | **済** | `files` および pack 出力 |
| 7 | publish 用 `scripts` (`pack:check`, `publish:dry-run`, `lint:package`, `verify:tarball`) | **済** | `package.json` `scripts` 節 |
| 8 | ビルド entrypoint (`clean` / `build` / `prepare`) | **済** | `npm run build` (`tsc -p tsconfig.build.json` + `setup-npmignore`) |
| 9 | `files` に runtime のみ同梱 (`scripts/patch-…` のみ) | **済** | `npm run verify:tarball` |
| 10 | README / [npm_usage.md](./npm_usage.md) / install examples の整合 | **済** | 同一の install コマンド・CLI 名・`--profile` 例；README 方法2 ↔ `npm_usage.md` 相互リンク |
| 11 | npmjs への初回 `npm publish` | **未** | 手動 `npm publish --access public` (GHA 自動 publish はフェーズ2) |
| 12 | 利用側プロジェクトでの受け入れ試験 | **未** | 各利用プロジェクトの作業 |

**集計**: 完了 **10 / 12** (実装％ **83%**)。本リポジトリ責務 (#1–10) は **10 / 10 (100%)**。

**フェーズ1クローズの目安**: 上表 #11–12 のみが「未」になった時点。本リポジトリのコード・文書・検証基盤は **完了** とみなせます。

### npm 配布: フェーズ1実装範囲

仕様 [npm 配布のための実装修正](./npm_package_spec.md#npm-配布のための実装修正) の責務表に対応します。

| 責務項目 | フェーズ1 | 実装％ | 完了条件 (要約) |
| --- | --- | ---: | --- |
| `package.json` の修正 | 済 | 100 | `@s2j/docs-linter`、`files`、`bin`、`engines` |
| CLI コマンドの公開 | 済 | 100 | `s2j-docs-linter` / 互換 `docs-lint`、`--help` / `--version` / `--profile` |
| npm publish に対応する tarball 構成 | 済 | 100 | `verify:tarball` で必須・禁止パスを自動検証 |
| publish 用 `scripts` | 済 | 100 | `pack:check`、`publish:dry-run`、`lint:package`、`verify:tarball` |
| 本リポジトリ `scripts` 整理 | 済 | 100 | `clean` / `build` / `prepare`、CLI 経由 `lint*` |
| README の更新 (フェーズ1範囲) | 済 | 100 | Submodule 主導線 + 方法2 (npm) 併記、`npm_usage.md` 導線 |
| [npm 使い方ガイド](./npm_usage.md) との整合 | 済 | 100 | install / CLI / `package.json` / CI 例が README・仕様と一致 |
| `examples/` の npm 版 | 済 | 100 | `npx s2j-docs-linter`、`@s2j/docs-linter` install コメント |
| GitHub Actions publish ワークフロー | 未 | 0 | `.github/workflows/npm-publish.yml` (フェーズ2) |

### 機能一覧 (実装状況サマリー)

| 機能名 (仕様セクション) | 実装済み/未実装 | 実装％ | 完了条件 (要約) | 備考 |
| --- | --- | ---: | --- | --- |
| [Publishing - フェーズ1優先タスク](./npm_package_spec.md#publishing---フェーズ1優先タスク) | 一部 | 90 | ローカル pack / dry-run / tarball 検証が成功 | レジストリ初回 publish のみ未 |
| [npm パッケージ仕様](./npm_package_spec.md) (文書) | 実装済み | 100 | コードと仕様の同期 | フェーズ1優先タスク見出し追記済み |
| [`package.json` メタデータ更新](./npm_package_spec.md#packagejson-メタデータ更新) | 実装済み | 100 | `@s2j/docs-linter`、semver、`LICENSE` 等 | `1.0.10` |
| [CLI Entrypoint 公開](./npm_package_spec.md#cli-entrypoint-公開) | 実装済み | 100 | `bin` / `--profile` / 設定解決 / `--help` / `--version` | textlint を `node` 直実行 |
| [ファイルスコープの最適化 (Publish)](./npm_package_spec.md#ファイルスコープの最適化を-publish) | 実装済み | 100 | `files` + `verify:tarball` で除外確認 | `presets/` 維持、`scripts/patch-…` のみ同梱 |
| [CLI 互換レイヤ](./npm_package_spec.md#cli-互換レイヤ) / [互換性に関する要件](./npm_package_spec.md#互換性に関する要件) | 実装済み | 100 | パッケージ root 基準の preset 解決、互換 `docs-lint` | |
| [依存関係レビュー](./npm_package_spec.md#依存関係レビュー) | 実装済み | 100 | 実行時 → `dependencies` | |
| [Publishing](./npm_package_spec.md#publishing) (全体) | 一部 | 83 | 完了条件 #1–10 済、#11–12 未 | 自動 tag publish はフェーズ2 |
| [本リポジトリ `package.json` の `scripts` - フェーズ1優先](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク) | 実装済み | 100 | `clean` / `build` / `prepare` / publish 検証群 / CLI 経由 `lint*` | `postinstall` はフェーズ1非対象で現状維持 |
| [移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例) / [フェーズ1優先](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク) | 実装済み | 100 | `examples/lint-docs*.yml` で `npx s2j-docs-linter` | Submodule 取得ステップは併存 |
| [互換性に関する、移行戦略](./npm_package_spec.md#互換性に関する移行戦略) (フェーズ1) | 実装済み | 90 | 本リポジトリ併存基盤 | 利用側 VSCode / CI は各プロジェクト |
| [README 移行](./npm_package_spec.md#readme-移行) | フェーズ1済 | 100 | Submodule 主 + npm 併記、動作する CLI 例 | フェーズ2でデフォルト npm 化 |
| [GitHub Actions Publish ワークフロー](./npm_package_spec.md#github-actions-publish-ワークフロー) | 未実装 | 0 | `.github/workflows/npm-publish.yml` | フェーズ1は設計のみ (フェーズ2実装) |
| [npm 使い方ガイド との整合 - フェーズ1優先](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク) / [npm_usage.md](./npm_usage.md) | 実装済み | 100 | README に書いたコマンドが実際に動く | `docs-lint` bin、`npm_usage.md` 拡充、examples install コメント |
| [VSCode 互換戦略](./npm_package_spec.md#vscode-互換戦略) | ガイドのみ | — | 利用側設定 | 本リポジトリ対象外 |
| [CI 互換戦略](./npm_package_spec.md#ci-互換戦略) | ガイドのみ | — | 利用側 CI 移行 | 本リポジトリ対象外 |
| [バージョン管理ポリシー](./npm_package_spec.md#バージョン管理ポリシー) | 方針のみ | — | semver 運用 | publish 開始後に運用 |
| [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) フェーズ2〜4 | 未着手 | 0 | フェーズ2以降 | |

### フェーズ1で完了した項目

仕様 [非推奨化ポリシー - フェーズ1で完了した項目](./npm_package_spec.md#フェーズ1で完了した項目)、[Publishing - フェーズ1優先タスク](./npm_package_spec.md#publishing---フェーズ1優先タスク)、[本リポジトリ `package.json` の `scripts` - フェーズ1優先タスク](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク)、[npm 使い方ガイド との整合 - フェーズ1優先タスク](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク) の責務と一致します。

* `@s2j/docs-linter` としての `package.json` メタデータ
* CLI `s2j-docs-linter` (互換 `docs-lint`)、`-h` / `--help`、`-V` / `--version`
* `presets/` レイアウトの維持と tarball 同梱
* 実行時 `dependencies` への移行
* README への npm 手順の併記 (Submodule は引き続き主導線) および [npm_usage.md](./npm_usage.md) への導線
* [npm_usage.md](./npm_usage.md) の install / CLI / `package.json` / GitHub Actions 例を README・仕様と整合
* publish 検証 scripts: `pack:check`, `publish:dry-run`, `verify:tarball`, `lint:package`
* tarball 自動検証 (`scripts/verify-tarball.cjs`)
* `examples/lint-docs*.yml` の `npx s2j-docs-linter` 化、`@s2j/docs-linter` install 手順コメント
* 本リポジトリ `scripts` 整理 … `clean` / `build` (`tsc`) / `prepare`、publish 用 dry-run 群
* 本リポジトリ `lint` / `lint:wp` / `lint:swift` をビルド済み CLI (`node dist/bin/run-textlint.js`) 経由に統一
* `files` を runtime 最小構成に整理 (`scripts/patch-wp-prh-colon-quote.cjs` のみ同梱)
* `package.json` `bin` の互換 CLI を `docs-lint` に統一 (仕様・lockfile と一致)

### フェーズ1で完了した主な変更 (コード・文書)

| 対象 | 内容 |
| --- | --- |
| `src/bin/run-textlint.ts` | preset 解決、`--profile`、`-h`/`--help`、`-V`/`--version`、textlint を `node` 直実行 |
| `package.json` | publish 用 scripts、`tsc` ビルド、`prepare` → `build`、本リポジトリ `lint*` の CLI 化、`bin.docs-lint` |
| `tsconfig.build.json` | 本番ビルド用 (`noEmit: false`、`dist/` 出力) |
| `scripts/verify-tarball.cjs` | `npm pack` 後の必須パス・禁止パス検証 |
| `examples/lint-docs*.yml` | lint ステップを `npx s2j-docs-linter` に更新、npm install 手順コメントを `npm_usage` と整合 |
| `README.md` | 方法2 (npm) を `@s2j/docs-linter` / `s2j-docs-linter` に更新、`npm_usage.md` へ導線、動作する CLI 例に修正 |
| `docsMod/npm_usage.md` | `--profile` / `package.json` / CI 例を README・仕様と整合 |
| `docsMod/npm_package_spec.md` | Publishing / scripts / npm 使い方ガイド整合 フェーズ1優先タスク等を追記 |

### フェーズ1の残タスク (本リポジトリ)

仕様 [フェーズ1の残タスク](./npm_package_spec.md#フェーズ1の残タスク-本リポジトリ) と一致します。

| # | タスク | 優先度 | 実装％ | 完了条件 |
| ---: | --- | --- | ---: | --- |
| 1 | npmjs への初回 `npm publish --access public` | **必須** (フェーズ1クローズ) | 0 | レジストリに `@s2j/docs-linter@1.0.10` が `npm view` / `npm install` で取得可能 |
| 2 | 利用側プロジェクトでの受け入れ試験 | 推奨 | 0 | Submodule 併存のまま `npm install --save-dev @s2j/docs-linter` と `npx s2j-docs-linter` が動作 |
| 3 | `.github/workflows/npm-publish.yml` | フェーズ2 | 0 | tag `v*` で自動 publish |

### 補足

* **公開 API**: `presets/{base,swift,wordpress}/` 配下パス、CLI 名、`extends` 用相対パスは互換契約 ([現在の利用状況の分析](./npm_package_spec.md#現在の利用状況の分析))。
* **ビルド**: `dist/bin/run-textlint.js` は `npm run build` (`tsc -p tsconfig.build.json` + `setup-npmignore`) で生成。`prepare` は `npm run build` を呼ぶ。`dev` は Vite watch (開発用のみ)。
* **postinstall**: フェーズ1 scripts 仕様の非対象。現状は `setup-npmignore` と `scripts/patch-wp-prh-colon-quote.cjs` を実行。tarball には patch スクリプトのみ同梱。
* **ローカル検証の一式**: 下記にコマンドを掲載。

```bash
npm run build             # tsc + .npmignore 生成
npm run verify:tarball    # pack + tarball 内容検証 (14 entries)
npm run publish:dry-run   # publish シミュレーション
npm run pack:check        # pack dry-run (lint:package と同等)
node dist/bin/run-textlint.js --help
node dist/bin/run-textlint.js --version   # => 1.0.10
npm run lint              # 本リポジトリ README 等 (build 後)
```
