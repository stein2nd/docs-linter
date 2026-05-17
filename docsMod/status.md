## S2J Docs Linter - 実装状況

本ページは、[npm パッケージ仕様](./npm_package_spec.md) にもとづく実装修正の進捗を一覧化します。仕様書の [フェーズ1実装状況](./npm_package_spec.md#フェーズ1実装状況-2026-05) と相互参照します。

**移行フェーズ**は [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) に従い、現時点は **フェーズ1** (Git Submodule と npm パッケージの併存) です。

最終更新 …2026-05-17 (`@s2j/docs-linter@1.0.10`、Publishing フェーズ1優先タスク反映済み)

### 仕様書 (参照元)

| ドキュメント | 内容 |
| --- | --- |
| [npm パッケージ仕様](./npm_package_spec.md) | npm 配布、CLI、互換、移行の全体仕様 (フェーズ1優先タスク含む) |
| [npm 使い方ガイド](./npm_usage.md) | 利用側プロジェクト向け手順 |
| [仕様書の起点](./specs.md) | 上記への導線 |

### フェーズ1: サマリー

仕様書 [概要](./npm_package_spec.md#概要) および [Publishing - フェーズ1優先タスク](./npm_package_spec.md#publishing---フェーズ1優先タスク) と一致させています。

| 項目 | 状態 |
| --- | --- |
| 移行フェーズ | **フェーズ1** 進行中 (併存) — 本リポジトリ実装は **ほぼ完了**、レジストリ公開のみ未 |
| npm パッケージ名 | `@s2j/docs-linter` (`package.json` 反映済み) |
| 正式 CLI | `s2j-docs-linter` (互換: `docs-linter`) |
| プリセットレイアウト | `presets/{base,swift,wordpress}/` を維持 (互換要件どおり) |
| tarball (`npm pack`) | **済** — `verify:tarball` で必須パス・除外パスを検証 |
| publish 準備 (`npm publish --dry-run`) | **済** — ローカル dry-run 成功 |
| npm レジストリ公開 | **未実施** — 手動 `npm publish --access public` 待ち |

| 区分 (仕様書) | フェーズ1の状態 |
| --- | --- |
| 実装済み | メタデータ、CLI (`--help` / `--version` 含む)、tarball 検証 scripts、`examples/` の `npx s2j-docs-linter` 化、`dependencies` 移行、README npm 手順 (併記)、仕様書フェーズ1優先タスク |
| 未実施 | npmjs への初回 publish、`.github/workflows/npm-publish.yml` (フェーズ2)、README の Submodule → レガシー化 (フェーズ2以降)、利用側受け入れ試験 |

### フェーズ1完了条件

仕様 [Publishing - フェーズ1優先タスク](./npm_package_spec.md#publishing---フェーズ1優先タスク) のゴールコマンドと責務に対応します。

| 完了条件 | 状態 | 検証方法 |
| --- | --- | --- |
| `npm pack` 成功 | **済** | `npm pack` または `npm run pack:check` |
| `npm publish --dry-run` 成功 | **済** | `npm run publish:dry-run` |
| `npx s2j-docs-linter --help` 成功 | **済** | tarball インストール後の `npx s2j-docs-linter --help` |
| tarball 内容検証 | **済** | `npm run verify:tarball` (`scripts/verify-tarball.cjs`) |
| `package.json` 必須フィールド (`name`, `version`, `files`, `bin`) | **済** | `package.json` |
| `LICENSE` / `README.md` を publish 対象に含める | **済** | `files` および pack 出力 |
| npmjs への初回 `npm publish` | **未** | 手動 (フェーズ1スコープ外: GHA 自動 publish) |
| 利用側プロジェクトでの受け入れ試験 | **未** | 各利用プロジェクトの作業 |

**フェーズ1クローズの目安**: 上表の「未」が初回 publish と受け入れ試験のみになった時点。本リポジトリのコード・検証基盤は **完了** とみなせます。

### npm 配布: フェーズ1実装範囲

仕様 [npm 配布のための実装修正](./npm_package_spec.md#npm-配布のための実装修正) の責務表に対応します。

| 責務項目 | フェーズ1 | 実装％ |
| --- | --- | ---: |
| `package.json` の修正 | 済 | 100 |
| CLI コマンドの公開 | 済 (`s2j-docs-linter` / 互換 `docs-linter`、`--help` / `--version`) | 100 |
| npm publish に対応する tarball 構成 | 済 + 自動検証 (`verify:tarball`) | 100 |
| publish 用 `scripts` (`pack:check`, `publish:dry-run` 等) | 済 | 100 |
| README の更新 | **一部** — Submodule 主導線のまま、npm を方法2として併記 | 100※ |
| `examples/` の npm 版 | 済 — `npx s2j-docs-linter`、パッケージ名 `@s2j/docs-linter` | 95 |
| GitHub Actions publish ワークフロー | 未 (フェーズ2) | 0 |

※ README の「フェーズ1範囲」として100%。フェーズ2以降の全面 npm 化は未。

### 機能一覧 (実装状況サマリー)

| 機能名 (仕様セクション) | 実装済み/未実装 | 実装％ | 完了条件 (要約) | 備考 |
| --- | --- | ---: | --- | --- |
| [Publishing - フェーズ1優先タスク](./npm_package_spec.md#publishing---フェーズ1優先タスク) | 一部 | 90 | 上記「フェーズ1完了条件」表 | レジストリ初回 publish のみ未 |
| [npm パッケージ仕様](./npm_package_spec.md) (文書) | 実装済み | 100 | コードと仕様の同期 | フェーズ1優先タスク見出し追記済み |
| [`package.json` メタデータ更新](./npm_package_spec.md#packagejson-メタデータ更新) | 実装済み | 100 | `@s2j/docs-linter`、semver、`LICENSE` 等 | `1.0.10` |
| [CLI Entrypoint 公開](./npm_package_spec.md#cli-entrypoint-公開) | 実装済み | 100 | `bin` / `--profile` / 設定解決 / `--help` | textlint を `node` 直実行 |
| [ファイルスコープの最適化 (Publish)](./npm_package_spec.md#ファイルスコープの最適化を-publish) | 実装済み | 100 | `files` + `verify:tarball` で除外確認 | `presets/` 維持 |
| [CLI 互換レイヤ](./npm_package_spec.md#cli-互換レイヤ) / [互換性に関する要件](./npm_package_spec.md#互換性に関する要件) | 実装済み | 100 | パッケージ root 基準の preset 解決 | |
| [依存関係レビュー](./npm_package_spec.md#依存関係レビュー) | 実装済み | 100 | 実行時 → `dependencies` | |
| [Publishing](./npm_package_spec.md#publishing) (全体) | 一部 | 75 | 自動 tag publish はフェーズ2 | ローカル publish 準備は完了 |
| [本リポジトリ `package.json` の `scripts` - フェーズ1優先](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク) | 一部 | 75 | `pack:check` / `publish:dry-run` / `verify:tarball` 済 | `lint` 系は `npx textlint` のまま (任意) |
| [移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例) / [フェーズ1優先](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク) | 実装済み | 95 | `examples/lint-docs*.yml` で CLI 利用 | Submodule 取得ステップは併存 |
| [互換性に関する、移行戦略](./npm_package_spec.md#互換性に関する移行戦略) (フェーズ1) | 実装済み | 90 | 本リポジトリ併存基盤 | 利用側 VSCode / CI は各プロジェクト |
| [README 移行](./npm_package_spec.md#readme-移行) | フェーズ1済 | 100 | Submodule 主 + npm 併記 | フェーズ2でデフォルト npm 化 |
| [GitHub Actions Publish ワークフロー](./npm_package_spec.md#github-actions-publish-ワークフロー) | 未実装 | 0 | `.github/workflows/npm-publish.yml` | フェーズ1は設計のみ (フェーズ2実装) |
| [npm 使い方ガイド](./npm_usage.md) との整合 | 一部 | 90 | 表記、CLI 名の一致 | `examples` 更新により整合度向上 |
| [VSCode 互換戦略](./npm_package_spec.md#vscode-互換戦略) | ガイドのみ | — | 利用側設定 | 本リポジトリ対象外 |
| [CI 互換戦略](./npm_package_spec.md#ci-互換戦略) | ガイドのみ | — | 利用側 CI 移行 | 本リポジトリ対象外 |
| [バージョン管理ポリシー](./npm_package_spec.md#バージョン管理ポリシー) | 方針のみ | — | semver 運用 | publish 開始後に運用 |
| [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) フェーズ2〜4 | 未着手 | 0 | フェーズ2以降 | |

### フェーズ1で完了した項目

仕様 [非推奨化ポリシー - フェーズ1で完了した項目](./npm_package_spec.md#フェーズ1で完了した項目) および [Publishing - フェーズ1優先タスク](./npm_package_spec.md#publishing---フェーズ1優先タスク) の責務と一致します。

* `@s2j/docs-linter` としての `package.json` メタデータ
* CLI `s2j-docs-linter` (互換 `docs-linter`)、`-h` / `--help`、`-V` / `--version`
* `presets/` レイアウトの維持と tarball 同梱
* 実行時 `dependencies` への移行
* README への npm 手順の併記 (Submodule は引き続き主導線)
* publish 検証 scripts: `pack:check`, `publish:dry-run`, `verify:tarball`, `lint:package`
* tarball 自動検証 (`scripts/verify-tarball.cjs`)
* `examples/lint-docs*.yml` の `npx s2j-docs-linter` 化と `@s2j/docs-linter` 表記

### フェーズ1で完了した主な変更 (コード・文書)

| 対象 | 内容 |
| --- | --- |
| `src/bin/run-textlint.ts` | preset 解決、`--profile`、`-h`/`--help`、`-V`/`--version`、textlint を `node` 直実行 |
| `package.json` | publish 用 scripts (`pack:check`, `publish:dry-run`, `verify:tarball`, `lint:package`) |
| `scripts/verify-tarball.cjs` | `npm pack` 後の必須パス・禁止パス検証 |
| `examples/lint-docs*.yml` | lint ステップを `npx s2j-docs-linter` に更新、npm パッケージ名を `@s2j/docs-linter` に統一 |
| `README.md` | 方法2 (npm) を `@s2j/docs-linter` / `s2j-docs-linter` に更新 (方法1「Submodule」は維持) |
| `docsMod/npm_package_spec.md` | Publishing フェーズ1優先タスク等を追記 |

### フェーズ1の残タスク (本リポジトリ)

仕様 [フェーズ1の残タスク](./npm_package_spec.md#フェーズ1の残タスク-本リポジトリ) と一致します。

| # | タスク | 優先度 | 完了条件 |
| --- | --- | --- | --- |
| 1 | npmjs への初回 `npm publish --access public` | **必須** (フェーズ1クローズ) | レジストリに `@s2j/docs-linter@1.0.10` が取得可能 |
| 2 | 利用側プロジェクトでの受け入れ試験 | 推奨 | Submodule 併存のまま npm 導入が動作 |
| 3 | `.github/workflows/npm-publish.yml` | フェーズ2 | tag `v*` で自動 publish |
| 4 | 本リポジトリ `lint` / `lint:wp` / `lint:swift` を `s2j-docs-linter` に寄せる | 任意 | 本リポジトリ `npm run lint*` が CLI 経由 |

### 補足

* **公開 API**: `presets/{base,swift,wordpress}/` 配下パス、CLI 名、`extends` 用相対パスは互換契約 ([現在の利用状況の分析](./npm_package_spec.md#現在の利用状況の分析))。
* **ビルド**: `dist/bin/run-textlint.js` は `npm run build` (`prepare` 経由) で生成。
* **postinstall**: `scripts/patch-wp-prh-colon-quote.cjs` は tarball の `scripts/` 経由で同梱。
* **ローカル検証の一式**: 余白。

```bash
npm run verify:tarball    # pack + tarball 内容検証
npm run publish:dry-run   # publish シミュレーション
node dist/bin/run-textlint.js --help
```
