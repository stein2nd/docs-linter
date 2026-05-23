## S2J Docs Linter - 実装状況

本ページは、[npm パッケージ仕様](./npm_package_spec.md) にもとづく実装修正の進捗を一覧化します。仕様書の [フェーズ1実装状況](./npm_package_spec.md#フェーズ1実装状況-2026-05) と相互参照します。publish 認証・シークレット方針は [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) を参照してください。

**移行フェーズ**は [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) に従い、現時点は **フェーズ1** (Git Submodule と npm パッケージの併存) です。

最終更新 …**2026-05-23** — ローカル `npm publish --dry-run --access public` を再確認 (tarball **22 entries**、25.0 kB / 83.2 kB unpacked)。`npm publish --access public` は、**`ENEEDAUTH`** (npmjs 未ログイン) で停止。パッケージ構成・ビルドは、publish 可能。**#11は、認証待ち**。

### 仕様書 (参照元)

| ドキュメント | 内容 |
| --- | --- |
| [npm パッケージ仕様](./npm_package_spec.md) | npm 配布、CLI、互換、移行、GHA publish、**パッケージ構成 (artifact)** の全体仕様 |
| [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) | フェーズ1 `NPM_TOKEN` / フェーズ2 npm trusted publishing (OIDC) / secret 運用 |
| [npm 使い方ガイド](./npm_usage.md) | install / CLI / `package.json` `lint:docs` 移行 / VSCode・`extends` / CI |
| [仕様書の起点](./specs.md) | 上記への導線 |

### フェーズ1: サマリー

仕様のフェーズ1優先タスク ([Publishing](./npm_package_spec.md#publishing---フェーズ1優先タスク)、[**Publishing (パッケージ構成)**](./npm_package_spec.md#publishing-パッケージ構成---フェーズ1優先タスク)、[本リポジトリ `scripts`](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク)、[移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク)、[互換移行戦略](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク)、[npm 使い方ガイド整合](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク)、[GitHub Actions Publish](./npm_package_spec.md#github-actions-publish-ワークフロー---フェーズ1優先タスク)) と本ページの完了条件を一致させています。

| 項目 | 状態 |
| --- | --- |
| 移行フェーズ | **フェーズ1** 進行中 (併存) — 本リポジトリのコード・文書・検証は **完了**、レジストリ公開と受け入れ試験のみ未 |
| **本リポジトリ 実装％** | **100%** — 本リポジトリ責務の完了条件 (#1–10, #13–16) はすべて **済** |
| **フェーズ1全体 実装％** | **88%** — 完了条件 16 項目中 **14 済** / **2 未** (下表「フェーズ1完了条件」参照) |
| npm パッケージ名 | `@s2j/docs-linter` (`package.json` 反映済み) |
| 正式 CLI | `s2j-docs-linter` (互換: `docs-lint`) |
| プリセットレイアウト | `presets/{base,swift,wordpress}/` を維持 + tarball に root 互換ミラー (`base/` `swift/` `wordpress/`) を同梱 |
| ビルド entrypoint | **済** — `npm run build` (`tsc` + `setup-npmignore` + `link-preset-layout-compat`)、`prepare` → `build` |
| tarball (`npm pack`) | **済** — dry-run (`pack:check`) + 内容検証 (`verify:tarball`) — **22 entries** |
| tarball artifact (`./artifacts/`) | **済** — `pack:artifact` → `s2j-docs-linter-<version>.tgz`、`verify:artifact`、`.gitignore` で root 非汚染 |
| publish 準備 (`npm publish --dry-run`) | **済** — `npm run publish:dry-run` 成功 |
| GHA publish ワークフロー | **設計済み** — [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml) (`verify:tarball` → `pack:artifact` → `upload-artifact` → `npm publish`；registry 運用はフェーズ2) |
| publish 認証方針 (文書) | **済** — [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) (フェーズ2 OIDC を推奨) |
| README / npm_usage / examples 整合 | **済** — install・CLI・`lint:docs` 移行例・VSCode/`extends`・CI サンプルを一致 |
| npm レジストリ公開 | **未** (認証待ち) — 2026-05-23: dry-run 成功、`npm publish --access public` は `ENEEDAUTH` (#11) |

| 区分 (仕様書) | フェーズ1の状態 |
| --- | --- |
| 実装済み | メタデータ、CLI、`scripts` 整理、tarball 検証 (22 entries)、**`pack:artifact` / `artifacts/`**、root 互換レイアウト、`examples/`・[npm_usage.md](./npm_usage.md) 整合、GHA 雛形 (`upload-artifact` 含む)、[npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) |
| 未実施 | npmjs への初回 publish (#11 — tarball 準備済み、npm 認証のみ未)、利用側受け入れ試験 (#12)、GHA からの registry 運用開始 (フェーズ2)、README の Submodule → レガシー化 (フェーズ2以降) |

**実装％の算出**

| スコープ | 分子 / 分母 | 実装％ |
| --- | --- | ---: |
| フェーズ1全体 | 完了条件 #1–16 のうち **済** の件数 | **14 / 16 → 88%** |
| 本リポジトリ責務のみ | #1–10, #13–16 (計 **14** 件) | **14 / 14 → 100%** |
| 本リポジトリ外 (フェーズ1クローズに必要) | #11–12 (計 **2** 件) | **0 / 2 → 0%** |

### フェーズ1優先タスクと完了条件の対応

| 仕様セクション (フェーズ1優先) | 完了条件 # | 状態 | 実装％ |
| --- | ---: | --- | ---: |
| [Publishing](./npm_package_spec.md#publishing---フェーズ1優先タスク) | #1–2, #4–9 | 済 (registry publish #11 のみ未) | 100 (本リポジトリ内) |
| [Publishing (パッケージ構成)](./npm_package_spec.md#publishing-パッケージ構成---フェーズ1優先タスク) | #1–2, #3–4, #7, #16 | 済 | 100 |
| [本リポジトリ `scripts`](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク) | #7–8 | 済 | 100 |
| [移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク) | #10, #15 | 済 | 100 |
| [互換性・移行戦略](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク) | #13–14 | 済 | 100 |
| [npm 使い方ガイド整合](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク) | #3, #10 | 済 | 100 |
| [GitHub Actions Publish](./npm_package_spec.md#github-actions-publish-ワークフロー---フェーズ1優先タスク) | #16 (artifact 保持) | 済 (設計) | 100 |
| [npm 認証・シークレット管理](./npm_auth_secret_manage_spec.md) (文書) | — | 済 (方針) | 100 |
| (運用) レジストリ公開・受け入れ試験 | #11–12 | 未 (#11: 認証待ち) | 0 |

### フェーズ1完了条件

仕様のフェーズ1優先タスクのゴール・責務に対応します。検証は **2026-05-23** 時点で下記を確認済みです (#11 の registry 公開のみ未)。

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| 1 | `npm pack` 成功 (`npm pack --dry-run` を標準) | **済** | 100 | `npm run pack:check` または `npm pack --dry-run` |
| 2 | `npm publish --dry-run` 成功 | **済** | 100 | `npm run publish:dry-run` — 2026-05-23 再確認 (`prepare` → `build` → tarball 22 files) |
| 3 | `npx s2j-docs-linter --help` 成功 | **済** | 100 | `npx s2j-docs-linter --help` または `node dist/bin/run-textlint.js --help` |
| 4 | tarball 内容検証 (`presets/` + root 互換パス) | **済** | 100 | `npm run verify:tarball` / `verify:artifact` — **22 entries** |
| 5 | `package.json` 必須フィールド (`name`, `version`, `files`, `bin`) | **済** | 100 | `@s2j/docs-linter@1.0.10`、`files` に `presets/` と `base/` `swift/` `wordpress/` |
| 6 | `LICENSE` / `README.md` を publish 対象に含める | **済** | 100 | `files` および pack 出力 |
| 7 | publish 用 `scripts` (`pack:check`, `pack:artifact`, `publish:dry-run`, `lint:package`, `verify:tarball`, `verify:artifact`) | **済** | 100 | [仕様の標準 scripts](./npm_package_spec.md#publishing-パッケージ構成---フェーズ1優先タスク) + `verify:*` |
| 8 | ビルド entrypoint (`clean` / `build` / `prepare`) | **済** | 100 | `npm run build` — `tsc` + `setup-npmignore` + `link-preset-layout-compat` |
| 9 | `files` に runtime のみ同梱 (`scripts/patch-…` のみ) | **済** | 100 | `verify:tarball` (禁止: `src/`, `examples/`, `docs/`) |
| 10 | README / [npm_usage.md](./npm_usage.md) / install examples の整合 | **済** | 100 | install・CLI・`--profile`・`lint:docs` before/after；README 方法2 ↔ `npm_usage.md` |
| 11 | npmjs への初回 `npm publish` | **未** (認証待ち) | 0 | 2026-05-23: `npm publish --access public` → `ENEEDAUTH`。次: `npm login` または `@s2j` publish 権限付きトークン → 再実行。完了: `npm view @s2j/docs-linter version` → `1.0.10` |
| 12 | 利用側プロジェクトでの受け入れ試験 | **未** | 0 | 各利用プロジェクトで `npm install --save-dev @s2j/docs-linter` と `npx s2j-docs-linter` |
| 13 | root 互換レイアウト (`base/` `swift/` `wordpress/` を tarball 同梱) | **済** | 100 | ビルド時ミラー + `verify:tarball` の `package/swift/.textlintrc.swift.json` 等 |
| 14 | VSCode / `extends` の移行ガイド ([npm_usage.md](./npm_usage.md)) | **済** | 100 | Submodule → `node_modules/@s2j/docs-linter/{swift,presets/*,base}/` の before/after |
| 15 | 移行のワークフロー例 (`examples/` + `lint:docs` 移行ドキュメント) | **済** | 100 | [examples/lint-docs*.yml](../examples/lint-docs.yml) の `npx s2j-docs-linter`；[npm_usage.md](./npm_usage.md) の Submodule → npm 表 |
| 16 | バージョン付き tarball を `./artifacts/` に生成・検証 (リポジトリ root 非汚染) | **済** | 100 | `npm run verify:artifact` → `artifacts/s2j-docs-linter-1.0.10.tgz`；`.gitignore` に `artifacts/`；GHA `upload-artifact` |

**集計**: 完了 **14 / 16** (実装％ **88%**)。本リポジトリ責務 (#1–10, #13–16) は **14 / 14 (100%)**。

**フェーズ1クローズの目安**: 上表 **#11–12** のみが「未」になった時点。本リポジトリのコード、文書、検証基盤、GHA 雛形、認証方針文書は、**完了** とみなせます。#11は、tarball / dry-run 側が完了しており、**npmjs 認証と初回 publish のみ** が残っています。

### npm 配布: フェーズ1実装範囲

仕様 [npm 配布のための実装修正](./npm_package_spec.md#npm-配布のための実装修正) の責務表に対応します。

| 責務項目 | フェーズ1 | 実装％ | 完了条件 (要約) |
| --- | --- | ---: | --- |
| `package.json` の修正 | 済 | 100 | `@s2j/docs-linter`、`files`、`bin`、`engines` (#5) |
| CLI コマンドの公開 | 済 | 100 | `s2j-docs-linter` / 互換 `docs-lint`、`--help` / `--version` / `--profile` (#3) |
| npm publish に対応する tarball 構成 | 済 | 100 | `verify:tarball` / `verify:artifact` (22 entries) (#4, #9) |
| tarball artifact 生成・保持 | 済 | 100 | `pack:artifact`、`artifacts/`、GHA `upload-artifact` (#16) |
| レイアウト互換 (`base/` `swift/` `wordpress/`) | 済 | 100 | ビルド時 `presets/*` ミラー、VSCode パス差し替えのみで移行可 (#13) |
| publish 用 `scripts` | 済 | 100 | 仕様標準 3 種 + `lint:package` + `verify:tarball` + `verify:artifact` (#7) |
| 本リポジトリ `scripts` 整理 | 済 | 100 | `clean` / `build` / `prepare`、CLI 経由 `lint*` (#8) |
| README の更新 (フェーズ1範囲) | 済 | 100 | Submodule 主導線 + 方法2 (npm) 併記、`npm_usage.md` 導線 (#10) |
| [npm 使い方ガイド](./npm_usage.md) との整合 | 済 | 100 | install / CLI / `lint:docs` / CI / VSCode・`extends` が README・仕様と一致 (#10, #14) |
| `examples/` の npm 版 | 済 | 100 | `npx s2j-docs-linter`、`@s2j/docs-linter` install コメント (#15) |
| GitHub Actions publish ワークフロー | 設計済み | 100 | [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml) — registry 運用はフェーズ2 |
| npm 認証・シークレット管理 (文書) | 済 | 100 | [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) — フェーズ2 OIDC 推奨 |

### フェーズ2: サマリー

フェーズ2では、S2J Docs Linter (`@s2j/docs-linter`) の **GitHub Actions を用いた npm Registry 自動 publish 基盤の構築** を対象とする。

フェーズ1で package 自体の成立性を確認したうえで、フェーズ2では以下を実現する。

* GitHub tag push による publish automation
* npm organization (`s2j`) への正式 package 登録
* GitHub Actions release workflow の整備
* npm authentication の CI 統合
* release artifact 管理
* publish 運用の標準化

フェーズ2完了時点で、S2J Docs Linter は **GitHub リポジトリを source of truth とし、npm リポジトリに継続的にリリース可能な OSS パッケージ** となる。

### フェーズ2優先タスクと完了条件の対応

| 優先 | タスク | 完了条件 |
|------|--------|----------|
| P0 | npm authentication integration | GitHub Actions から npm publish 認証成功 |
| P0 | publish workflow implementation | tag push で publish workflow 起動 |
| P0 | `@s2j/docs-linter` initial publish | npmjs.com organization `s2j` に package 登録成功 |
| P1 | release artifact generation | tarball artifact を GitHub Actions で保存可能 |
| P1 | workflow verification | test tag で publish dry-run 成功 |
| P2 | trusted publishing migration design | NPM_TOKEN から OIDC への移行方針定義 |

### フェーズ2完了条件

以下をすべて満たした場合、フェーズ2完了とする。

#### 必須

* `@s2j/docs-linter` が npm registry に公開されている
* npm organization `s2j` に package が表示される
* GitHub Actions workflow から publish が成功する
* GitHub Actions 上で `npm ci` → `npm publish` が再現可能
* publish artifact (`.tgz`) が version 単位で生成可能

#### 推奨

* GitHub Actions 上で `npm publish --dry-run` テストが可能
* release workflow documentation が README / docs に反映済
* publish secret / auth strategy が仕様化済

#### 将来拡張 (フェーズ3候補)

以下はフェーズ2完了条件には含めない。

* npm Trusted Publishing (OIDC)
* semantic-release
* automatic changelog generation
* dist-tag management
* prerelease channel

### 機能一覧 (実装状況サマリー)

| 機能名 (仕様セクション) | 実装済み/未実装 | 実装％ | 完了条件 (要約) | 備考 |
| --- | --- | ---: | --- | --- |
| [Publishing - フェーズ1優先タスク](./npm_package_spec.md#publishing---フェーズ1優先タスク) | 一部 | 91 | ローカル pack / dry-run / tarball 検証 (#1–2, #4–9) | レジストリ初回 publish (#11) のみ未 — dry-run 済、`ENEEDAUTH` |
| [Publishing (パッケージ構成) - フェーズ1優先](./npm_package_spec.md#publishing-パッケージ構成---フェーズ1優先タスク) | 実装済み | 100 | `pack:artifact`、`artifacts/`、再現可能な検証 (#1–2, #4, #7, #16) | GHA artifact 名 `s2j-docs-linter-<tag>` |
| [npm パッケージ仕様](./npm_package_spec.md) (文書) | 実装済み | 100 | コードと仕様の同期 | パッケージ構成セクション反映済み |
| [`package.json` メタデータ更新](./npm_package_spec.md#packagejson-メタデータ更新) | 実装済み | 100 | `@s2j/docs-linter`、semver、`LICENSE` 等 | `1.0.10` (#5–6) |
| [CLI Entrypoint 公開](./npm_package_spec.md#cli-entrypoint-公開) | 実装済み | 100 | `bin` / `--profile` / 設定解決 / `--help` / `--version` | textlint を `node` 直実行 (#3) |
| [ファイルスコープの最適化 (Publish)](./npm_package_spec.md#ファイルスコープの最適化を-publish) | 実装済み | 100 | `files` + `verify:tarball` | `presets/` + root ミラー (#4, #9) |
| [CLI 互換レイヤ](./npm_package_spec.md#cli-互換レイヤ) / [互換性に関する要件](./npm_package_spec.md#互換性に関する要件) | 実装済み | 100 | パッケージ root 基準の preset 解決、互換 `docs-lint` | |
| [互換性に関する、移行戦略 - フェーズ1優先](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク) | 実装済み | 100 | tarball に `base/` `swift/` `wordpress/` 同梱 | `npm_usage.md` に VSCode / `extends` (#13–14) |
| [依存関係レビュー](./npm_package_spec.md#依存関係レビュー) | 実装済み | 100 | 実行時 → `dependencies` | |
| [Publishing](./npm_package_spec.md#publishing) (全体) | 一部 | 88 | 完了条件 **14/16** 済 | #11 (認証待ち)・#12 未。GHA registry 運用はフェーズ2 |
| [本リポジトリ `package.json` の `scripts` - フェーズ1優先](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク) | 実装済み | 100 | `clean` / `build` / `prepare` / publish 検証群 / CLI 経由 `lint*` | `postinstall` はフェーズ1非対象で現状維持 (#8) |
| [移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例) | 実装済み | 100 | `examples/lint-docs*.yml` で `npx s2j-docs-linter` | Submodule 取得ステップは併存 (#15) |
| [移行のワークフロー例 - フェーズ1優先](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク) | 実装済み | 100 | migration examples + `lint:docs` before/after | [npm_usage.md](./npm_usage.md) + `examples/` (#10, #15) |
| [互換性に関する、移行戦略](./npm_package_spec.md#互換性に関する移行戦略) (フェーズ1) | 実装済み | 100 | 併存基盤 + root 互換レイアウト + 移行ドキュメント | 利用側 VSCode / CI 適用は各プロジェクト |
| [README 移行](./npm_package_spec.md#readme-移行) | フェーズ1済 | 100 | Submodule 主 + npm 併記、動作する CLI 例 | フェーズ2でデフォルト npm 化 (#10) |
| [GitHub Actions Publish ワークフロー](./npm_package_spec.md#github-actions-publish-ワークフロー) | 設計済み | 100 | `verify:tarball` → `pack:artifact` → `upload-artifact` → `npm publish` | フェーズ2: `NPM_TOKEN` 設定後に運用開始 |
| [GitHub Actions Publish - フェーズ1優先](./npm_package_spec.md#github-actions-publish-ワークフロー---フェーズ1優先タスク) | 実装済み | 100 | tag `v*` / `npm ci` / 検証 / artifact 保存 / publish 定義 | registry への実 publish 運用はフェーズ2 |
| [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) | 文書済み | 100 | フェーズ1 `NPM_TOKEN` / フェーズ2 OIDC 方針 | ワークフローは現状フェーズ1パターン |
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
* publish 検証 scripts … 仕様標準の `pack:check` / `pack:artifact` / `publish:dry-run` + `lint:package` + `verify:tarball` + `verify:artifact`
* tarball 自動検証 (`scripts/verify-tarball.cjs`) — temp 検証と `--from-artifacts` 検証 — **22 entries**
* **`./artifacts/`** へのバージョン付き tarball (`s2j-docs-linter-<version>.tgz`)、`.gitignore` で root の `*.tgz` 汚染を回避
* `examples/lint-docs*.yml` の `npx s2j-docs-linter` 化、`@s2j/docs-linter` install 手順コメント
* `.github/workflows/npm-publish.yml` … tag `v*` → `verify:tarball` → `pack:artifact` → `upload-artifact` → `npm publish` (設計・雛形。registry 運用はフェーズ2)
* [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) … フェーズ1 `NPM_TOKEN`、フェーズ2 npm trusted publishing (OIDC) 推奨
* 本リポジトリ `scripts` 整理 … `clean` / `build` (`tsc` + ミラー生成) / `prepare`、publish 用 dry-run 群
* 本リポジトリ `lint` / `lint:wp` / `lint:swift` をビルド済み CLI 経由に統一
* `files` を runtime 最小構成に整理 (`scripts/patch-wp-prh-colon-quote.cjs` のみ同梱)
* `package.json` `bin` の互換 CLI を `docs-lint` に統一

### フェーズ1で完了した主な変更 (コード・文書)

| 対象 | 内容 | 完了条件 |
| --- | --- | ---: |
| `src/bin/run-textlint.ts` | preset 解決、`--profile`、`-h`/`--help`、`-V`/`--version`、textlint を `node` 直実行、NODE_PATH 連結 | #3 |
| `package.json` | publish 用 scripts (`pack:artifact` 等)、`files` に root ミラー、`build` にミラー生成、`bin.docs-lint` | #5–8, #16 |
| `tsconfig.build.json` | 本番ビルド用 (`noEmit: false`、`dist/` 出力) | #8 |
| `scripts/verify-tarball.cjs` | 必須・禁止パス検証；`--from-artifacts` で `./artifacts/` を検証 | #4, #9, #16 |
| `.gitignore` | `artifacts/` を追加 (root への tarball 流出防止) | #16 |
| `src/scripts/link-preset-layout-compat.ts` | ビルド時に `presets/*` → root `base/` `swift/` `wordpress/` をミラー | #13 |
| `examples/lint-docs*.yml` | lint ステップを `npx s2j-docs-linter` に更新、npm / `npm_usage` 導線コメント | #15 |
| `README.md` | 方法2 (npm) を `@s2j/docs-linter` / `s2j-docs-linter` に更新、`npm_usage.md` へ導線 | #10 |
| `docsMod/npm_usage.md` | `lint:docs` before/after、`--profile`、CI、VSCode・`extends` 移行例 | #10, #14, #15 |
| `docsMod/npm_package_spec.md` | フェーズ1優先タスク・**パッケージ構成**・GHA・残タスクの注記 | 文書 |
| `docsMod/npm_auth_secret_manage_spec.md` | 認証優先順位 (OIDC > 自動化トークン > 手動)、secret 運用、GHA 例 | 文書 |
| `docsMod/specs.md` | 認証仕様・実装状況への導線 | 文書 |
| `.github/workflows/npm-publish.yml` | `verify:tarball` → `pack:artifact` → `upload-artifact` → `npm publish` | #16 (設計) |

### フェーズ1の残タスク

仕様 [フェーズ1の残タスク](./npm_package_spec.md#フェーズ1の残タスク-本リポジトリ) と一致します。本リポジトリ内の実装・文書タスクは **完了** (実装％ **100%**)。フェーズ1クローズに必要なのは下表の運用タスクのみです。

| # | タスク | 優先度 | 実装％ | 完了条件 (#) |
| ---: | --- | --- | ---: | ---: |
| 1 | npmjs への初回 `npm publish --access public` | **必須** (フェーズ1クローズ) | 0 | #11 — 2026-05-23 dry-run 成功、`ENEEDAUTH` で停止。`npm login` 後に再実行 → `npm view @s2j/docs-linter version` が `1.0.10` |
| 2 | 利用側プロジェクトでの受け入れ試験 | 推奨 | 0 | #12 — Submodule 併存のまま `npx s2j-docs-linter` と VSCode 互換パスが動作 |
| 3 | GHA からの tag 連動 publish 運用 | フェーズ2 | 0 | 初回手動 publish 後: (A) GitHub Secret `NPM_TOKEN` + 現行ワークフロー、または (B) [npm trusted publishing (OIDC)](./npm_auth_secret_manage_spec.md#4-フェーズ2-npm-trusted-publishing-推奨) へ移行 |

### フェーズ2で完了した項目

進捗に応じて更新します。

### フェーズ2で完了した主な変更 (コード・文書)

実装後に追記します。

#### コード

* `.github/workflows/npm-publish.yml`
* `package.json`
* release scripts
* publish verification scripts

#### 文書

* `docsMod/npm_auth_spec.md`
* `docsMod/npm_package_spec.md`
* `docsMod/npm_usage.md`
* `README.md`

### フェーズ2の残タスク

#### 1. GitHub Actions Publish ワークフローの運用開始

[`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml) は **雛形済み** (tag `v*`、`verify:tarball` → `pack:artifact` → `upload-artifact` → `npm publish`)。**registry への実 publish 運用**は未開始です。

* `NPM_TOKEN` 登録後の tag push 検証
* GHA 上での `npm publish --access public` 成功確認

#### 2. GitHub Secret 連携

下記を内容とする、GitHub リポジトリの設定で `NPM_TOKEN` を登録します。未着手です。

* `NPM_TOKEN` 登録
* Actions 権限の確認

#### 3. パッケージの初回 Publish

フェーズ1残タスク #11 と同一。tarball / dry-run は **済** (2026-05-23)。**npm 認証** (`npm login` または publish トークン) 後に `npm publish --access public` を実行します。

* 初回 `@s2j/docs-linter@1.0.10` publish が成功
* `npm view @s2j/docs-linter version` → `1.0.10`

#### 4. Publish Dry-Run ワークフローの検証

* ローカル … **済** (2026-05-23): `npm publish --dry-run --access public` 成功
* GHA … **未**: tag push ワークフロー上での dry-run / publish 成功確認

#### 5. リリース Artifact の保持

* ローカル … **済**: `pack:artifact` → `./artifacts/s2j-docs-linter-<version>.tgz`、`verify:artifact` (2026-05-18 以降)
* GHA … **未運用**: `upload-artifact` (`s2j-docs-linter-<tag>`) の tag push 時保存を初回 publish 後に検証

#### 6. Trusted Publishing 移行設計

フェーズ3に向けて、下記を内容とした、npm auth 戦略を設計します。

* NPM_TOKEN 依存から OIDC への移行

### フェーズ2のマイルストーン

1. M1: GitHub Actions で `npm publish --dry-run` 成功
2. M2: test tag push で workflow success
3. M3: `@s2j/docs-linter` 初回 publish
4. M4: artifact retention 確立
5. M5: フェーズ2完了

### 補足

* **公開 API**:
    * `presets/{base,swift,wordpress}/` 配下パス、root 互換 `base/` `swift/` `wordpress/`、CLI 名、`extends` 用相対パスは互換契約 ([現在の利用状況の分析](./npm_package_spec.md#現在の利用状況の分析))。
* **ビルド**:
    * `npm run build` = `tsc -p tsconfig.build.json` + `setup-npmignore` + `link-preset-layout-compat` (root ミラー生成)。`prepare` は `npm run build` を呼ぶ。
* **root ミラー**:
    * `base/` `swift/` `wordpress/` は `.gitignore` 対象 (生成物)。
    * publish tarball にのみ同梱。
* **tarball artifact**:
    * 実 tarball は `npm run pack:artifact` で `./artifacts/s2j-docs-linter-<version>.tgz` に出力。
    * `artifacts/` は `.gitignore` 対象。リポジトリ root の `*.tgz` も gitignore 済み (旧来の root 出力は手動削除可)。
    * GHA では tag push 時に `upload-artifact` で `s2j-docs-linter-<tag>` として保存 (registry 運用開始前でも tarball 履歴を追跡可能)。
* **postinstall**:
    * フェーズ1 scripts 仕様の非対象。
    * 現状は `setup-npmignore` と `scripts/patch-wp-prh-colon-quote.cjs` を実行。
    * tarball には patch スクリプトのみ同梱。
* **GHA と secret**:
    * ワークフローは `${{ secrets.NPM_TOKEN }}` を参照するのみ (値はリポジトリに含めない)。
    * IDE の `Context access might be invalid: NPM_TOKEN` は Secret 未登録時の静的警告であり、登録後も残ることがある。
    * 長期運用は [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) の OIDC 移行を推奨する。
* **ローカル検証の一式** (2026-05-23 確認済み):
    * 下記は、コマンド一覧。`npm publish --access public` は **`ENEEDAUTH`** — npmjs ログイン後に再実行。

```bash
npm run build
npm run pack:check
npm run pack:artifact
npm run verify:tarball
npm run verify:artifact
npm run publish:dry-run          # => tarball 22 files, @s2j/docs-linter@1.0.10
npm publish --access public      # => ENEEDAUTH (認証後に再実行)
npx s2j-docs-linter --help
npx s2j-docs-linter --version   # => 1.0.10
npm run lint                    # 本リポジトリ README 等 (build 後)
```
