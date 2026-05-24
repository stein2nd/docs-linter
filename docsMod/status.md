## S2J Docs Linter - 実装状況

本ページは、[npm パッケージ仕様](./npm_package_spec.md) にもとづく実装修正の進捗を一覧化します。仕様書の [フェーズ1実装状況](./npm_package_spec.md#フェーズ1実装状況-2026-05) と相互参照します。publish 認証・シークレット方針は [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) を参照してください。

**移行フェーズ**は [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) に従い、**フェーズ1 完了** (Git Submodule と npm パッケージの併存)。**フェーズ2 進行中** (GHA publish 基盤)。フェーズ1完了条件 **#1–16 はすべて済** (2026-05-24)。

最終更新 …**2026-05-24** — フェーズ1 **クローズ** (**16/16 → 100%**)。フェーズ2 **必須 58%** / **マイルストーン 60%** / **推奨 100%** — ワークフロー・[release.md](./release.md) 実装済み、GHA dry-run (M1) 成功。**残**: `NPM_TOKEN` 登録 + `v1.0.12` tag push (M2/M5)。

### 仕様書 (参照元)

| ドキュメント | 内容 |
| --- | --- |
| [npm パッケージ仕様](./npm_package_spec.md) | npm 配布、CLI、互換、移行、GHA publish、**パッケージ構成 (artifact)** の全体仕様 |
| [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) | フェーズ1 `NPM_TOKEN` / フェーズ2 npm trusted publishing (OIDC) / secret 運用 |
| [npm リリース手順](./release.md) | GHA tag publish、`NPM_TOKEN` 登録、dry-run 検証 |
| [npm 使い方ガイド](./npm_usage.md) | install / CLI / `package.json` `lint:docs` 移行 / VSCode・`extends` / CI |
| [仕様書の起点](./specs.md) | 上記への導線 |

### フェーズ1: サマリー

仕様のフェーズ1優先タスク ([Publishing](./npm_package_spec.md#publishing---フェーズ1優先タスク)、[**Publishing (パッケージ構成)**](./npm_package_spec.md#publishing-パッケージ構成---フェーズ1優先タスク)、[本リポジトリ `scripts`](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク)、[移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク)、[互換移行戦略](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク)、[npm 使い方ガイド整合](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク)、[GitHub Actions Publish](./npm_package_spec.md#github-actions-publish-ワークフロー---フェーズ1優先タスク)) と本ページの完了条件を一致させています。

| 項目 | 状態 |
| --- | --- |
| 移行フェーズ | **フェーズ1 完了** (併存) — 完了条件 **16/16 済**。GHA 継続 publish はフェーズ2 |
| **本リポジトリ 実装％** | **100%** — 本リポジトリ責務の完了条件 (#1–10, #13–16) はすべて **済** |
| **フェーズ1全体 実装％** | **100%** — 完了条件 16 項目中 **16 済** |
| npm パッケージ名 | `@s2j/docs-linter` (`package.json` 反映済み) |
| 正式 CLI | `s2j-docs-linter` (互換: `docs-lint`) |
| プリセットレイアウト | `presets/{base,swift,wordpress}/` を維持 + tarball に root 互換ミラー (`base/` `swift/` `wordpress/`) を同梱 |
| ビルド entrypoint | **済** — `npm run build` (`tsc` + `setup-npmignore` + `link-preset-layout-compat`)、`prepare` → `build` |
| tarball (`npm pack`) | **済** — dry-run (`pack:check`) + 内容検証 (`verify:tarball`) — **22 entries** |
| tarball artifact (`./artifacts/`) | **済** — `pack:artifact` → `s2j-docs-linter-<version>.tgz`、`verify:artifact`、`.gitignore` で root 非汚染 |
| publish 準備 (`npm publish --dry-run`) | **済** — `npm run publish:dry-run` 成功 |
| GHA publish ワークフロー | **実装済み** — [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml)（`workflow_dispatch` dry-run、tag/version 検証）。**registry 自動 publish 運用はフェーズ2 残** |
| publish 認証方針 (文書) | **済** — [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) (フェーズ2 OIDC を推奨) |
| README / npm_usage / examples 整合 | **済** — install・CLI・`lint:docs` 移行例・VSCode/`extends`・CI サンプルを一致 |
| npm レジストリ公開 | **済** — 最新 `@s2j/docs-linter@1.0.11` (#11)。`1.0.10` 初回 (2026-05-23)、`1.0.11` peer 依存修正 (2026-05-24) |

| 区分 (仕様書) | フェーズ1の状態 |
| --- | --- |
| 実装済み | メタデータ、CLI、`scripts` 整理、tarball 検証 (22 entries)、**`pack:artifact` / `artifacts/`**、root 互換レイアウト、`examples/`・[npm_usage.md](./npm_usage.md) 整合、**GHA publish ワークフロー** (dry-run 検証済)、**npmjs publish** (`1.0.10` / `1.0.11`)、**利用側受け入れ試験** (**9** リポジトリ) |
| 未実施 | GHA からの registry **自動** publish 運用 (フェーズ2 残)、README の Submodule → レガシー化 (フェーズ2以降) |

**実装％の算出**

| スコープ | 分子 / 分母 | 実装％ |
| --- | --- | ---: |
| フェーズ1全体 | 完了条件 #1–16 のうち **済** の件数 | **16 / 16 → 100%** |
| 本リポジトリ責務のみ | #1–10, #13–16 (計 **14** 件) | **14 / 14 → 100%** |
| 本リポジトリ外 (フェーズ1クローズに必要) | #11–12 (計 **2** 件) | **2 / 2 → 100%** |

### フェーズ1優先タスクと完了条件の対応

| 仕様セクション (フェーズ1優先) | 完了条件 # | 状態 | 実装％ |
| --- | ---: | --- | ---: |
| [Publishing](./npm_package_spec.md#publishing---フェーズ1優先タスク) | #1–2, #4–9, #11–12 | 済 | 100 |
| [Publishing (パッケージ構成)](./npm_package_spec.md#publishing-パッケージ構成---フェーズ1優先タスク) | #1–2, #3–4, #7, #16 | 済 | 100 |
| [本リポジトリ `scripts`](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク) | #7–8 | 済 | 100 |
| [移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク) | #10, #15 | 済 | 100 |
| [互換性・移行戦略](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク) | #13–14 | 済 | 100 |
| [npm 使い方ガイド整合](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク) | #3, #10 | 済 | 100 |
| [GitHub Actions Publish](./npm_package_spec.md#github-actions-publish-ワークフロー---フェーズ1優先タスク) | #16 (artifact 保持) | 済 (設計) | 100 |
| [npm 認証・シークレット管理](./npm_auth_secret_manage_spec.md) (文書) | — | 済 (方針) | 100 |
| (運用) レジストリ公開・受け入れ試験 | #11–12 | 済 | 100 |

### フェーズ1完了条件

仕様のフェーズ1優先タスクのゴール・責務に対応します。検証は **2026-05-24** 時点で下記をすべて確認済みです。

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| 1 | `npm pack` 成功 (`npm pack --dry-run` を標準) | **済** | 100 | `npm run pack:check` または `npm pack --dry-run` |
| 2 | `npm publish --dry-run` 成功 | **済** | 100 | `npm run publish:dry-run` — 2026-05-23 再確認 (`prepare` → `build` → tarball 22 files) |
| 3 | `npx s2j-docs-linter --help` 成功 | **済** | 100 | `npx s2j-docs-linter --help` または `node dist/bin/run-textlint.js --help` |
| 4 | tarball 内容検証 (`presets/` + root 互換パス) | **済** | 100 | `npm run verify:tarball` / `verify:artifact` — **22 entries** |
| 5 | `package.json` 必須フィールド (`name`, `version`, `files`, `bin`) | **済** | 100 | `@s2j/docs-linter@1.0.11`、`files` に `presets/` と `base/` `swift/` `wordpress/` |
| 6 | `LICENSE` / `README.md` を publish 対象に含める | **済** | 100 | `files` および pack 出力 |
| 7 | publish 用 `scripts` (`pack:check`, `pack:artifact`, `publish:dry-run`, `lint:package`, `verify:tarball`, `verify:artifact`) | **済** | 100 | [仕様の標準 scripts](./npm_package_spec.md#publishing-パッケージ構成---フェーズ1優先タスク) + `verify:*` |
| 8 | ビルド entrypoint (`clean` / `build` / `prepare`) | **済** | 100 | `npm run build` — `tsc` + `setup-npmignore` + `link-preset-layout-compat` |
| 9 | `files` に runtime のみ同梱 (`scripts/patch-…` のみ) | **済** | 100 | `verify:tarball` (禁止: `src/`, `examples/`, `docs/`) |
| 10 | README / [npm_usage.md](./npm_usage.md) / install examples の整合 | **済** | 100 | install・CLI・`--profile`・`lint:docs` before/after；README 方法2 ↔ `npm_usage.md` |
| 11 | npmjs への `npm publish` | **済** | 100 | `1.0.10` 初回 (2026-05-23)、`1.0.11` (`sudachi-synonyms-dictionary` 同梱、2026-05-24)。`npm view @s2j/docs-linter version` → `1.0.11` |
| 12 | 利用側プロジェクトでの受け入れ試験 | **済** | 100 | 2026-05-24: **9 リポジトリ** — 下表「#12 受け入れ試験」参照。いずれも Submodule → `@s2j/docs-linter@1.0.11`、`npm run lint:docs` で lint 結果を確認 |
| 13 | root 互換レイアウト (`base/` `swift/` `wordpress/` を tarball 同梱) | **済** | 100 | ビルド時ミラー + `verify:tarball` の `package/swift/.textlintrc.swift.json` 等 |
| 14 | VSCode / `extends` の移行ガイド ([npm_usage.md](./npm_usage.md)) | **済** | 100 | Submodule → `node_modules/@s2j/docs-linter/{swift,presets/*,base}/` の before/after |
| 15 | 移行のワークフロー例 (`examples/` + `lint:docs` 移行ドキュメント) | **済** | 100 | [examples/lint-docs*.yml](../examples/lint-docs.yml) の `npx s2j-docs-linter`；[npm_usage.md](./npm_usage.md) の Submodule → npm 表 |
| 16 | バージョン付き tarball を `./artifacts/` に生成・検証 (リポジトリ root 非汚染) | **済** | 100 | `npm run verify:artifact` → `artifacts/s2j-docs-linter-1.0.11.tgz`；`.gitignore` に `artifacts/`；GHA `upload-artifact` |

**集計**: 完了 **16 / 16** (実装％ **100%**)。

**フェーズ1クローズ**: **達成** (2026-05-24)。GHA からの継続 publish 運用はフェーズ2です。

#### #12 受け入れ試験 (2026-05-24)

Git Submodule から `@s2j/docs-linter` (npm) へ移行し、`npm run lint:docs` で lint 結果が得られることを確認済みです。

| 区分 | リポジトリ | プリセット / 備考 |
| --- | --- | --- |
| WordPress プラグイン (npm) | S2J Alliance Manager、S2J Slug Generater、S2J Media Library Date Corrector | WordPress (`--profile wordpress` または `.textlintrc.wp.json`) |
| WordPress プラグイン (Composer + npm) | S2J Similarity Service | WordPress + Composer 併存 |
| Swift アプリ / ツール | S2J About Window、S2J Source List、S2J Cozy Brew | Swift (`--profile swift` または `.textlintrc.swift.json`) |
| 仕様ドキュメント | WP Plugin Spec、Xcode Common Spec | 各リポジトリの textlint 設定に準拠 |

**#12 集計**: WordPress **4** / Swift **3** / 仕様ドキュメント **2** ＝ **9 リポジトリ**。いずれも `@s2j/docs-linter@1.0.11` を使用。

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
| GitHub Actions publish ワークフロー | 実装済み | 100 | [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml) — dry-run GHA 成功 (M1)。registry 自動 publish はフェーズ2 残 |
| npm 認証・シークレット管理 (文書) | 済 | 100 | [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) — フェーズ2 OIDC 推奨 |

### フェーズ2: サマリー

フェーズ2では、S2J Docs Linter (`@s2j/docs-linter`) の **GitHub Actions を用いた npm Registry 自動 publish 基盤の構築** を対象とする。

| 項目 | 状態 |
| --- | --- |
| **フェーズ2 必須完了条件** | **58%** — 5 項目中 **2 済** / **2 未** / **1 部分済** (#5: GHA dry-run で artifact 保存確認) |
| **フェーズ2 推奨完了条件** | **100%** — 3 項目中 **3 済** |
| **フェーズ2 マイルストーン (M1–M5)** | **60%** — M1 **済** / M2 **未** / M3 **済** / M4 **部分済 (90%)** / M5 **未** |
| **本リポジトリ実装 (フェーズ2)** | **90%** — ワークフロー・スクリプト・[release.md](./release.md) 済。`NPM_TOKEN` + tag push のみ残 |
| npm レジストリ (公開済) | **済** — 最新 `@s2j/docs-linter@1.0.11`（リポジトリ `package.json` は **`1.0.12`** — GHA publish 待ち） |
| GHA publish ワークフロー | **実装・dry-run 検証済** — [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml)。tag push による本番 publish は **未** |
| 認証 | **未** — GitHub Secret `NPM_TOKEN` 未登録（[release.md](./release.md) §1） |

フェーズ1で package 自体の成立性と利用側移行を確認したうえで、フェーズ2では以下を実現する。

* GitHub tag push による publish automation
* npm organization (`s2j`) への正式 package 登録
* GitHub Actions release workflow の整備
* npm authentication の CI 統合
* release artifact 管理
* publish 運用の標準化

フェーズ2完了時点で、S2J Docs Linter は **GitHub リポジトリを source of truth とし、npm リポジトリに継続的にリリース可能な OSS パッケージ** となる。

**実装％の算出 (フェーズ2)**

| スコープ | 分子 / 分母 | 実装％ |
| --- | --- | ---: |
| 必須完了条件 | #1–5 の実装％合計 **290** / 500 | **58%** (2 済 + 1 部分済 90%) |
| 推奨完了条件 | #1–3 のうち **済** の件数 | **3 / 3 → 100%** |
| マイルストーン M1–M5 | (100 + 0 + 100 + 90 + 0) / 5 | **60%** |
| 本リポジトリ実装 | ワークフロー・スクリプト・文書 9/10 相当 | **90%** (`NPM_TOKEN` 登録 + tag publish 運用のみ残) |

### フェーズ2優先タスクと完了条件の対応

| 優先 | タスク | 完了条件 | 状態 | 実装％ |
|------|--------|----------|------|------:|
| P0 | npm authentication integration | GitHub Actions から npm publish 認証成功 | 未 (`NPM_TOKEN` 未登録) | 0 |
| P0 | publish workflow implementation | tag push で publish workflow 起動・成功 | **実装済み** (dry-run GHA 成功)、本番 publish **未** | 80 |
| P0 | `@s2j/docs-linter` initial publish | npmjs.com organization `s2j` に package 登録成功 | **済** (`1.0.11`) | 100 |
| P1 | release artifact generation | tarball artifact を GitHub Actions で保存可能 | **部分済** (dry-run run [`26359090580`](https://github.com/stein2nd/docs-linter/actions/runs/26359090580)) | 90 |
| P1 | workflow verification | test tag で publish dry-run 成功 | **GHA dry-run 済** (`1.0.12`)、tag push publish **未** | 80 |
| P2 | trusted publishing migration design | NPM_TOKEN から OIDC への移行方針定義 | 文書済み ([npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md)) | 100 |

### フェーズ2完了条件

以下をすべて満たした場合、フェーズ2完了とする。

#### 必須

| # | 完了条件 | 状態 | 実装％ |
| ---: | --- | --- | ---: |
| 1 | `@s2j/docs-linter` が npm registry に公開されている | **済** (最新 `1.0.11`) | 100 |
| 2 | npm organization `s2j` に package が表示される | **済** | 100 |
| 3 | GitHub Actions workflow から publish が成功する | **未** (`NPM_TOKEN` + `v1.0.12` tag push 待ち) | 0 |
| 4 | GitHub Actions 上で `npm ci` → `npm publish` が再現可能 | **未** (dry-run パスは GHA 成功) | 0 |
| 5 | publish artifact (`.tgz`) が version 単位で生成可能 (GHA) | **部分済** (dry-run で `upload-artifact` 成功) | 90 |

**集計**: 必須 **290 / 500 → 58%**（#1–2 済、#5 部分済 90%、#3–4 未）。

#### 推奨

| # | 完了条件 | 状態 | 実装％ |
| ---: | --- | --- | ---: |
| 1 | GitHub Actions 上で `npm publish --dry-run` テストが可能 | **済** ([run `26359090580`](https://github.com/stein2nd/docs-linter/actions/runs/26359090580), 2026-05-24) | 100 |
| 2 | release workflow documentation が README / docs に反映済 | **済** ([release.md](./release.md)、README 導線、[specs.md](./specs.md)) | 100 |
| 3 | publish secret / auth strategy が仕様化済 | **済** ([npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md)) | 100 |

**集計**: 推奨 **3 / 3 → 100%**。

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
| [Publishing - フェーズ1優先タスク](./npm_package_spec.md#publishing---フェーズ1優先タスク) | 実装済み | 100 | pack / dry-run / tarball / registry / 受け入れ (#1–2, #4–9, #11–12) | 最新 `@s2j/docs-linter@1.0.11` |
| [Publishing (パッケージ構成) - フェーズ1優先](./npm_package_spec.md#publishing-パッケージ構成---フェーズ1優先タスク) | 実装済み | 100 | `pack:artifact`、`artifacts/`、再現可能な検証 (#1–2, #4, #7, #16) | GHA artifact 名 `s2j-docs-linter-<tag>` |
| [npm パッケージ仕様](./npm_package_spec.md) (文書) | 実装済み | 100 | コードと仕様の同期 | パッケージ構成セクション反映済み |
| [`package.json` メタデータ更新](./npm_package_spec.md#packagejson-メタデータ更新) | 実装済み | 100 | `@s2j/docs-linter`、semver、`LICENSE` 等 | リポジトリ `1.0.12` / npm 最新 `1.0.11` (#5–6) |
| [CLI Entrypoint 公開](./npm_package_spec.md#cli-entrypoint-公開) | 実装済み | 100 | `bin` / `--profile` / 設定解決 / `--help` / `--version` | textlint を `node` 直実行 (#3) |
| [ファイルスコープの最適化 (Publish)](./npm_package_spec.md#ファイルスコープの最適化を-publish) | 実装済み | 100 | `files` + `verify:tarball` | `presets/` + root ミラー (#4, #9) |
| [CLI 互換レイヤ](./npm_package_spec.md#cli-互換レイヤ) / [互換性に関する要件](./npm_package_spec.md#互換性に関する要件) | 実装済み | 100 | パッケージ root 基準の preset 解決、互換 `docs-lint` | |
| [互換性に関する、移行戦略 - フェーズ1優先](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク) | 実装済み | 100 | tarball に `base/` `swift/` `wordpress/` 同梱 | `npm_usage.md` に VSCode / `extends` (#13–14) |
| [依存関係レビュー](./npm_package_spec.md#依存関係レビュー) | 実装済み | 100 | 実行時 → `dependencies`；`sudachi-synonyms-dictionary` 同梱 (1.0.11) | |
| [Publishing](./npm_package_spec.md#publishing) (全体) | 実装済み | 100 | 完了条件 **16/16** 済 | フェーズ1クローズ。GHA 運用はフェーズ2 |
| [本リポジトリ `package.json` の `scripts` - フェーズ1優先](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク) | 実装済み | 100 | `clean` / `build` / `prepare` / publish 検証群 / CLI 経由 `lint*` | `postinstall` はフェーズ1非対象で現状維持 (#8) |
| [移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例) | 実装済み | 100 | `examples/lint-docs*.yml` で `npx s2j-docs-linter` | Submodule 取得ステップは併存 (#15) |
| [移行のワークフロー例 - フェーズ1優先](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク) | 実装済み | 100 | migration examples + `lint:docs` before/after | [npm_usage.md](./npm_usage.md) + `examples/` (#10, #15) |
| [互換性に関する、移行戦略](./npm_package_spec.md#互換性に関する移行戦略) (フェーズ1) | 実装済み | 100 | 併存基盤 + root 互換レイアウト + 移行ドキュメント | **9 リポジトリ**で Submodule → npm 移行完了 (#12) |
| [README 移行](./npm_package_spec.md#readme-移行) | フェーズ1済 | 100 | Submodule 主 + npm 併記、動作する CLI 例 | フェーズ2でデフォルト npm 化 (#10) |
| [GitHub Actions Publish ワークフロー](./npm_package_spec.md#github-actions-publish-ワークフロー) | 実装済み | 100 | `verify:tarball` → `pack:artifact` → `upload-artifact` → `npm publish` | M1 dry-run 成功。本番 publish は `NPM_TOKEN` + tag 待ち |
| [GitHub Actions Publish - フェーズ1優先](./npm_package_spec.md#github-actions-publish-ワークフロー---フェーズ1優先タスク) | 実装済み | 100 | tag `v*` / `npm ci` / 検証 / artifact / publish 定義 | `workflow_dispatch` + `verify-release-tag.cjs` 追加 (2026-05-24) |
| [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) | 文書済み | 100 | フェーズ1 `NPM_TOKEN` / フェーズ3 OIDC 方針 | ワークフローは `NPM_TOKEN` パターン。Secret **未登録** |
| [npm 使い方ガイド との整合 - フェーズ1優先](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク) / [npm_usage.md](./npm_usage.md) | 実装済み | 100 | README のコマンドが実際に動く | `lint:docs` / VSCode / `extends` / CI (#10, #14) |
| [VSCode 互換戦略](./npm_package_spec.md#vscode-互換戦略) | ガイド済み | 100 | [npm_usage.md](./npm_usage.md) に移行例 | 利用側での設定変更は各プロジェクト (#14) |
| [CI 互換戦略](./npm_package_spec.md#ci-互換戦略) | ガイド済み | 100 | `npm_usage.md` / `examples/` に CI 例 | 利用側 CI 移行は各プロジェクト (#15) |
| [バージョン管理ポリシー](./npm_package_spec.md#バージョン管理ポリシー) | 運用開始 | — | semver 運用 | npm 最新 `1.0.11`、リポジトリ `1.0.12` (publish 待ち) |
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
* `.github/workflows/npm-publish.yml` … tag `v*` / `workflow_dispatch` → `verify:tarball` → `pack:artifact` → `upload-artifact` → `npm publish` (2026-05-24 強化。GHA dry-run 成功)
* [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) … フェーズ1 `NPM_TOKEN`、フェーズ2 npm trusted publishing (OIDC) 推奨
* 本リポジトリ `scripts` 整理 … `clean` / `build` (`tsc` + ミラー生成) / `prepare`、publish 用 dry-run 群
* 本リポジトリ `lint` / `lint:wp` / `lint:swift` をビルド済み CLI 経由に統一
* `files` を runtime 最小構成に整理 (`scripts/patch-wp-prh-colon-quote.cjs` のみ同梱)
* `package.json` `bin` の互換 CLI を `docs-lint` に統一
* **`@s2j/docs-linter@1.0.10`** npmjs 初回 publish (2026-05-23)
* **`@s2j/docs-linter@1.0.11`** — `sudachi-synonyms-dictionary` を dependencies に追加 (peer 依存の利用側エラー解消)
* **利用側受け入れ試験 (#12)** — **9 リポジトリ** (WordPress 3 + Composer 併存 1 / Swift 3 / 仕様ドキュメント 2) で Submodule → npm、`npm run lint:docs` 成功 (2026-05-24)

### フェーズ1で完了した主な変更 (コード・文書)

| 対象 | 内容 | 完了条件 |
| --- | --- | ---: |
| `src/bin/run-textlint.ts` | preset 解決、`--profile`、`-h`/`--help`、`-V`/`--version`、textlint を `node` 直実行、NODE_PATH 連結 | #3 |
| `package.json` | publish 用 scripts、`files`、root ミラー、`build`、`bin.docs-lint`；**1.0.11** で `sudachi-synonyms-dictionary` 追加 | #5–8, #11, #16 |
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
| `.github/workflows/npm-publish.yml` | 初版: tag `v*` → `verify:tarball` → `pack:artifact` → `upload-artifact` → `npm publish` | #16 (設計) |
| (運用) npmjs publish | `@s2j/docs-linter@1.0.10` 初回、`1.0.11` peer 依存修正 | #11 |
| (運用) 利用側受け入れ試験 | 9 リポジトリ (WordPress / Swift / 仕様ドキュメント) — `lint:docs` 成功 | #12 |

### フェーズ1の残タスク

**なし** — フェーズ1完了条件 #1–16 はすべて **済** (2026-05-24)。次は **フェーズ2** (GHA 継続 publish 運用) です。

| # | タスク | 優先度 | 実装％ | 完了条件 (#) |
| ---: | --- | --- | ---: | ---: |
| 1 | npmjs への publish | フェーズ1 | **100** | #11 — `@s2j/docs-linter@1.0.11` |
| 2 | 利用側プロジェクトでの受け入れ試験 | フェーズ1 | **100** | #12 — 9 リポジトリで `lint:docs` 成功 (下表参照) |
| 3 | GHA からの tag 連動 publish 運用 | **フェーズ2** | **80** | ワークフロー実装・dry-run GHA 成功。`NPM_TOKEN` + tag publish 未 |

### フェーズ2で完了した項目

* **M3**: `@s2j/docs-linter` npmjs publish — **済** (最新 `1.0.11`)
* **受け入れ試験 (フェーズ1 #12)**: **9 リポジトリ** — WordPress (npm 3 / Composer+npm 1)、Swift 3、仕様ドキュメント 2 — **済** (2026-05-24)
* **GHA ワークフロー強化** (2026-05-24): `workflow_dispatch` (dry-run)、tag/version 一致検証 (`scripts/verify-release-tag.cjs`)、`NPM_TOKEN` 未設定時の明示エラー
* **リリース手順文書**: [release.md](./release.md) — `NPM_TOKEN` 登録、dry-run、tag push 手順
* **GHA dry-run 検証 (M1)**: workflow_dispatch `dry_run=true` 成功 (run [`26359090580`](https://github.com/stein2nd/docs-linter/actions/runs/26359090580), 2026-05-24)
* **GHA artifact 保存 (M4 部分)**: run `26359090580` で artifact `s2j-docs-linter-main` 保存確認

#### 運用 (手動)

* npmjs publish … `@s2j/docs-linter@1.0.10` (初回)、`1.0.11` (`sudachi-synonyms-dictionary` 同梱)
* 利用側受け入れ … 上記 9 リポジトリで Submodule → npm、`npm run lint:docs` 成功

### フェーズ2で完了した主な変更 (コード・文書)

| 対象 | 内容 | 関連 |
| --- | --- | --- |
| `.github/workflows/npm-publish.yml` | `workflow_dispatch` (dry-run)、tag/version 検証、`NPM_TOKEN` 未設定エラー | M1, P0 |
| `scripts/verify-release-tag.cjs` | tag と `package.json` version 一致検証 | M2 前提 |
| `docsMod/release.md` | `NPM_TOKEN` 登録、dry-run、tag push 手順 | 推奨 #2 |
| `package.json` | `1.0.12`、`verify:release-tag` script | M2 候補 |
| `README.md` / `docsMod/specs.md` | [release.md](./release.md) 導線 | 推奨 #2 |
| (運用) GHA dry-run | run [`26359090580`](https://github.com/stein2nd/docs-linter/actions/runs/26359090580) 成功 (2026-05-24) | M1, 推奨 #1 |

### フェーズ2の残タスク

#### 1. GitHub Secret `NPM_TOKEN` 登録 — **最優先**

[release.md](./release.md) §1 に従い、npm automation token を GitHub Secret `NPM_TOKEN` として登録してください。

```bash
gh secret set NPM_TOKEN --repo stein2nd/docs-linter
```

#### 2. GHA dry-run 検証 (M1) — **済**

2026-05-24: workflow_dispatch `dry_run=true` 成功 ([run `26359090580`](https://github.com/stein2nd/docs-linter/actions/runs/26359090580))。

#### 3. tag push による本番 publish (M2 / フェーズ2 必須 #3–5) — **残**

`1.0.12` を main に merge 後、`git tag v1.0.12 && git push origin v1.0.12` を実行します。

成功後 `npm view @s2j/docs-linter version` → `1.0.12`、Actions Artifacts に `s2j-docs-linter-v1.0.12` を確認します。

#### 4. Trusted Publishing 移行設計

フェーズ3に向けた OIDC 移行 — 文書済み ([npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md))。

### フェーズ2のマイルストーン

| # | マイルストーン | 状態 | 実装％ | 検証 |
| ---: | --- | --- | ---: | --- |
| M1 | GitHub Actions で `npm publish --dry-run` 成功 | **済** | 100 | run [`26359090580`](https://github.com/stein2nd/docs-linter/actions/runs/26359090580) (2026-05-24) |
| M2 | test tag push で workflow success (本番 publish) | **未** | 0 | `NPM_TOKEN` + `git tag v1.0.12 && git push origin v1.0.12` |
| M3 | `@s2j/docs-linter` npmjs publish (初回) | **済** | 100 | 最新 `@s2j/docs-linter@1.0.11` |
| M4 | artifact retention 確立 (GHA) | **部分済** | 90 | dry-run で artifact 保存。tag 連動は M2 後 |
| M5 | フェーズ2完了 | **未** | 0 | M2 成功後 |

**集計**: マイルストーン **(100 + 0 + 100 + 90 + 0) / 5 → 60%**。

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
    * **2026-05-24 時点**: GitHub Secret `NPM_TOKEN` は **未登録** (`gh secret list` 空)。
    * IDE の `Context access might be invalid: NPM_TOKEN` は Secret 未登録時の静的警告であり、登録後も残ることがある。
    * 長期運用は [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) の OIDC 移行を推奨する。
* **npm publish / 受け入れ試験 (2026-05-24)**:
    * レジストリ最新 … `@s2j/docs-linter@1.0.11`
    * リポジトリ `package.json` … **`1.0.12`** (GHA publish 候補、npm 未公開)
    * 受け入れ (#12) … **9 リポジトリ**
        * WordPress… Alliance Manager / Slug Generater / Media Library Date Corrector / Similarity Service (Composer+npm)
        * Swift… About Window / Source List / Cozy Brew
        * 仕様… WP Plugin Spec / Xcode Common Spec
* **ローカル検証の一式** (2026-05-24 確認済み):

```bash
npm run verify:tarball
npm run publish:dry-run          # package.json 1.0.12 (npm 未公開のため成功)
node ./scripts/verify-release-tag.cjs v1.0.12
npm view @s2j/docs-linter version   # => 1.0.11 (npm 最新)
npx s2j-docs-linter --version       # => 1.0.12 (ローカル)
npm run lint
```

* **GHA 検証 (2026-05-24)**:

```bash
gh workflow run npm-publish.yml -f dry_run=true   # M1 dry-run
gh run list --workflow=npm-publish.yml --limit 1
# tag publish (M2): NPM_TOKEN 登録後
git tag v1.0.12 && git push origin v1.0.12
```
