## S2J Docs Linter - 実装状況

本ページは、[npm パッケージ仕様](./npm_package_spec.md) にもとづく実装修正の進捗を一覧化します。仕様書の [フェーズ1実装状況](./npm_package_spec.md#フェーズ1実装状況-2026-05) と相互参照します。publish 認証・シークレット方針は [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) を参照してください。

**移行フェーズ**は [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) に従い、**フェーズ1 完了** (併存)、**フェーズ2 完了** (GHA OIDC publish 運用)、**フェーズ3 進行中** (利用側 npm 移行 / Submodule 非推奨化)、**フェーズ4 未着手** (OSS 成熟化)。

最終更新 …**2026-05-25** — フェーズ1 **クローズ** (**16/16 → 100%**)。フェーズ2 **クローズ** — 必須 **100%** / OIDC **100%** / 推奨 **100%** / マイルストーン **100%**。フェーズ3 **進行中** — 必須 **75%** / 推奨 **83%** (利用側 **9 リポジトリ** npm 化・`tools/docs-linter` 削除済)。フェーズ4 **未着手** — 必須 **26%** / 推奨 **8%**。

### 全体進捗 (サマリー)

| フェーズ | 完了条件 | 実装％ | 状態 |
| --- | --- | ---: | --- |
| フェーズ1 | #1–16 | **100%** (16/16 済) | **クローズ** (2026-05-24) |
| フェーズ2 必須 | #1–5 | **100%** (5/5 済) | **クローズ** (2026-05-25) |
| フェーズ2 OIDC | O1–O4 | **100%** (4/4 済) | **クローズ** (2026-05-25) |
| フェーズ2 推奨 | #1–3 | **100%** (3/3 済) | **クローズ** (2026-05-25) |
| フェーズ2 M1–M5 | マイルストーン | **100%** (5/5 済) | **クローズ** (2026-05-25) |
| フェーズ3 必須 | #1–6 | **75%** (4 済 / 1 部分済 / 1 未) | **進行中** |
| フェーズ3 推奨 | #1–3 | **83%** (1 済 / 2 部分済) | **進行中** |
| フェーズ4 必須 | #1–5 | **26%** (0 済 / 3 部分済 / 2 未) | 未着手 |
| フェーズ4 推奨 | #1–5 | **8%** (0 済 / 1 部分済 / 4 未) | 未着手 |

### 仕様書 (参照元)

| ドキュメント | 内容 |
| --- | --- |
| [npm パッケージ仕様](./npm_package_spec.md) | npm 配布、CLI、互換、移行、GHA publish、**パッケージ構成 (artifact)** の全体仕様 |
| [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) | Trusted Publishing (OIDC) 登録済、`NPM_TOKEN` 非使用方針 |
| [npm リリース手順](./release.md) | GHA tag publish、Trusted Publishing (OIDC)、dry-run 検証 |
| [npm 使い方ガイド](./npm_usage.md) | install / CLI / `package.json` `lint:docs` 移行 / VSCode・`extends` / CI |
| [仕様書の起点](./specs.md) | 上記への導線 |

### フェーズ1: サマリー

仕様のフェーズ1優先タスク ([Publishing](./npm_package_spec.md#publishing---フェーズ1優先タスク)、[**Publishing (パッケージ構成)**](./npm_package_spec.md#publishing-パッケージ構成---フェーズ1優先タスク)、[本リポジトリ `scripts`](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク)、[移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク)、[互換移行戦略](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク)、[npm 使い方ガイド整合](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク)、[GitHub Actions Publish](./npm_package_spec.md#github-actions-publish-ワークフロー---フェーズ1優先タスク)) と本ページの完了条件を一致させています。

| 項目 | 状態 |
| --- | --- |
| 移行フェーズ | **フェーズ1 完了** (併存) — 完了条件 **16/16 済**。**フェーズ2 完了** — GHA OIDC publish 運用 |
| **本リポジトリ 実装％** | **100%** — 本リポジトリ責務の完了条件 (#1–10, #13–16) はすべて **済** |
| **フェーズ1全体 実装％** | **100%** — 完了条件 16 項目中 **16 済** |
| npm パッケージ名 | `@s2j/docs-linter` (`package.json` 反映済み) |
| 正式 CLI | `s2j-docs-linter` (互換: `docs-lint`) |
| プリセットレイアウト | `presets/{base,swift,wordpress}/` を維持 + tarball に root 互換ミラー (`base/` `swift/` `wordpress/`) を同梱 |
| ビルド entrypoint | **済** — `npm run build` (`tsc` + `setup-npmignore` + `link-preset-layout-compat`)、`prepare` → `build` |
| tarball (`npm pack`) | **済** — dry-run (`pack:check`) + 内容検証 (`verify:tarball`) — **22 entries** |
| tarball artifact (`./artifacts/`) | **済** — `pack:artifact` → `s2j-docs-linter-<version>.tgz`、`verify:artifact`、`.gitignore` で root 非汚染 |
| publish 準備 (`npm publish --dry-run`) | **済** — `npm run publish:dry-run` 成功 |
| GHA publish ワークフロー | **運用中 (OIDC)** — tag `v*` push で publish 成功 ([run `26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088)) |
| publish 認証方針 (文書) | **済** — Trusted Publishing (OIDC) 運用中。`NPM_TOKEN` 不使用 |
| README / npm_usage / examples 整合 | **済** — install・CLI・`lint:docs` 移行例・VSCode/`extends`・CI サンプルを一致 |
| npm レジストリ公開 | **済** — 最新 **`@s2j/docs-linter@1.0.13`**。GHA OIDC publish (`1.0.13`)、手動 publish (`1.0.10`–`1.0.12`) |

| 区分 (仕様書) | フェーズ1の状態 |
| --- | --- |
| 実装済み | メタデータ、CLI、`scripts` 整理、tarball 検証 (22 entries)、**`pack:artifact` / `artifacts/`**、root 互換レイアウト、`examples/`・[npm_usage.md](./npm_usage.md) 整合、**GHA publish ワークフロー** (OIDC 運用)、**npmjs publish** (`1.0.10`–`1.0.12` 手動 / **`1.0.13`** GHA OIDC)、**利用側受け入れ試験** (**9** リポジトリ) |
| 未実施 (フェーズ3以降) | README の Submodule → レガシー化、利用側 Submodule 完全削除、CHANGELOG / matrix CI |

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
| [GitHub Actions Publish](./npm_package_spec.md#github-actions-publish-ワークフロー---フェーズ1優先タスク) | #16 (artifact 保持) | 済 (運用) | 100 |
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
| 5 | `package.json` 必須フィールド (`name`, `version`, `files`, `bin`) | **済** | 100 | `@s2j/docs-linter@1.0.13`、`files` に `presets/` と `base/` `swift/` `wordpress/` |
| 6 | `LICENSE` / `README.md` を publish 対象に含める | **済** | 100 | `files` および pack 出力 |
| 7 | publish 用 `scripts` (`pack:check`, `pack:artifact`, `publish:dry-run`, `lint:package`, `verify:tarball`, `verify:artifact`) | **済** | 100 | [仕様の標準 scripts](./npm_package_spec.md#publishing-パッケージ構成---フェーズ1優先タスク) + `verify:*` |
| 8 | ビルド entrypoint (`clean` / `build` / `prepare`) | **済** | 100 | `npm run build` — `tsc` + `setup-npmignore` + `link-preset-layout-compat` |
| 9 | `files` に runtime のみ同梱 (`scripts/patch-…` のみ) | **済** | 100 | `verify:tarball` (禁止: `src/`, `examples/`, `docs/`) |
| 10 | README / [npm_usage.md](./npm_usage.md) / install examples の整合 | **済** | 100 | install・CLI・`--profile`・`lint:docs` before/after；README 方法2 ↔ `npm_usage.md` |
| 11 | npmjs への `npm publish` | **済** | 100 | `1.0.10` 初回 (2026-05-23)、`1.0.11`–`1.0.12` (手動)、**`1.0.13`** (GHA OIDC, 2026-05-25)。`npm view @s2j/docs-linter version` → **`1.0.13`** |
| 12 | 利用側プロジェクトでの受け入れ試験 | **済** | 100 | 2026-05-24: **9 リポジトリ** — 下表「#12 受け入れ試験」参照。いずれも Submodule → `@s2j/docs-linter@1.0.11`、`npm run lint:docs` で lint 結果を確認 |
| 13 | root 互換レイアウト (`base/` `swift/` `wordpress/` を tarball 同梱) | **済** | 100 | ビルド時ミラー + `verify:tarball` の `package/swift/.textlintrc.swift.json` 等 |
| 14 | VSCode / `extends` の移行ガイド ([npm_usage.md](./npm_usage.md)) | **済** | 100 | Submodule → `node_modules/@s2j/docs-linter/{swift,presets/*,base}/` の before/after |
| 15 | 移行のワークフロー例 (`examples/` + `lint:docs` 移行ドキュメント) | **済** | 100 | [examples/lint-docs*.yml](../examples/lint-docs.yml) の `npx s2j-docs-linter`；[npm_usage.md](./npm_usage.md) の Submodule → npm 表 |
| 16 | バージョン付き tarball を `./artifacts/` に生成・検証 (リポジトリ root 非汚染) | **済** | 100 | `npm run verify:artifact` → `artifacts/s2j-docs-linter-1.0.13.tgz`；`.gitignore` に `artifacts/`；GHA artifact `s2j-docs-linter-v1.0.13` |

**集計**: 完了 **16 / 16** (実装％ **100%**)。

**フェーズ1クローズ**: **達成** (2026-05-24)。GHA からの継続 publish 運用は **フェーズ2で達成済み** (2026-05-25)。

#### #12 受け入れ試験 (2026-05-24)

Git Submodule から `@s2j/docs-linter` (npm) へ移行し、`npm run lint:docs` で lint 結果が得られることを確認済みです。利用側 **9 リポジトリ** では `tools/docs-linter` を削除し、npm モジュール版へ cutover 済みです (フェーズ3 必須 #1–2)。

| 区分 | リポジトリ | プリセット / 備考 |
| --- | --- | --- |
| WordPress プラグイン (npm) | S2J Alliance Manager、S2J Slug Generater、S2J Media Library Date Corrector | WordPress (`--profile wordpress` または `.textlintrc.wp.json`) |
| WordPress プラグイン (Composer + npm) | S2J Similarity Service | WordPress + Composer 併存 |
| Swift アプリ / ツール | S2J About Window、S2J Source List、S2J Cozy Brew | Swift (`--profile swift` または `.textlintrc.swift.json`) |
| 仕様ドキュメント | WordPress Plugin Spec、Xcode Common Specs | 各リポジトリの textlint 設定に準拠。npm 化・`tools/docs-linter` 削除済 |

**#12 集計**: WordPress **4** / Swift **3** / 仕様ドキュメント **2** ＝ **9 リポジトリ**。いずれも `@s2j/docs-linter` npm 化、`tools/docs-linter` 削除済 (フェーズ3 #1–2 達成)。

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
| GitHub Actions publish ワークフロー | 運用中 | 100 | OIDC tag publish 成功 (M2)。artifact `s2j-docs-linter-v1.0.13` |
| npm 認証・シークレット管理 (文書) | 済 | 100 | [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) — Trusted Publishing 登録済 |

### フェーズ2: サマリー

フェーズ2では、S2J Docs Linter (`@s2j/docs-linter`) の **GitHub Actions を用いた npm Registry 自動 publish 基盤の構築** を対象とした。**2026-05-25 時点で完了**。

| 項目 | 状態 |
| --- | --- |
| **フェーズ2 必須完了条件** | **100%** — 5 項目中 **5 済** |
| **フェーズ2 OIDC 移行 (O1–O4)** | **100%** — 4 項目中 **4 済** |
| **フェーズ2 推奨完了条件** | **100%** — 3 項目中 **3 済** |
| **フェーズ2 マイルストーン (M1–M5)** | **100%** — M1–M5 **すべて済** |
| **本リポジトリ実装 (フェーズ2)** | **100%** |
| npm レジストリ (公開済) | **済** — 最新 **`@s2j/docs-linter@1.0.13`**（GHA OIDC publish、2026-05-25） |
| GHA publish ワークフロー | **運用中 (OIDC)** — tag push publish 成功 (run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088)) |
| 認証 | **Trusted Publishing 運用中** — `NPM_TOKEN` Secret **未使用** |

フェーズ1で package 自体の成立性と利用側移行を確認したうえで、フェーズ2では以下を **達成した**。

* GitHub tag push による publish automation — **済** (`v1.0.13`, run `26381626088`)
* npm organization (`s2j`) への正式 package 登録 — **済**
* GitHub Actions release workflow の整備 — **済** (OIDC, dry-run, tag/version 検証)
* npm authentication の CI 統合 — **済** (Trusted Publishing, secretless)
* release artifact 管理 — **済** (`s2j-docs-linter-v1.0.13`)
* publish 運用の標準化 — **済** ([release.md](./release.md))

フェーズ2完了時点で、S2J Docs Linter は **GitHub リポジトリを source of truth とし、npm リポジトリに継続的にリリース可能な OSS パッケージ** となる。

**実装％の算出 (フェーズ2)**

| スコープ | 分子 / 分母 | 実装％ |
| --- | --- | ---: |
| 必須完了条件 | #1–5 の実装％合計 **500** / 500 | **100%** |
| OIDC 移行 (O1–O4) | 実装％合計 **400** / 400 | **100%** |
| 推奨完了条件 | #1–3 のうち **済** の件数 | **3 / 3 → 100%** |
| マイルストーン M1–M5 | (100 + 100 + 100 + 100 + 100) / 5 | **100%** |
| 本リポジトリ実装 | ワークフロー OIDC 運用・Trusted Publisher・文書 | **100%** |

**フェーズ2クローズ**: **達成** (2026-05-25)。

### フェーズ2優先タスクと完了条件の対応

| 優先 | タスク | 完了条件 | 状態 | 実装％ |
|------|--------|----------|------|------:|
| P0 | npm authentication integration | GitHub Actions から npm publish 認証成功 | **済** (Trusted Publishing + GHA OIDC publish) | 100 |
| P0 | publish workflow implementation | tag push で publish workflow 起動・成功 | **済** (run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088)) | 100 |
| P0 | `@s2j/docs-linter` initial publish | npmjs.com organization `s2j` に package 登録成功 | **済** (最新 **`1.0.13`**) | 100 |
| P1 | release artifact generation | tarball artifact を GitHub Actions で保存可能 | **済** (artifact `s2j-docs-linter-v1.0.13`) | 100 |
| P1 | workflow verification | test tag で publish dry-run 成功 | **済** (M1 dry-run + M2 tag publish) | 100 |
| P2 | trusted publishing migration design | NPM_TOKEN から OIDC への移行方針定義 | **済** (Trusted Publisher 登録 + ワークフロー OIDC 化) | 100 |

### フェーズ2完了条件

以下をすべて満たした場合、フェーズ2完了とする。

#### 必須

| # | 完了条件 | 状態 | 実装％ |
| ---: | --- | --- | ---: |
| 1 | `@s2j/docs-linter` が npm registry に公開されている | **済** (最新 **`1.0.13`**) | 100 |
| 2 | npm organization `s2j` に package が表示される | **済** | 100 |
| 3 | GitHub Actions workflow から publish が成功する | **済** (run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088), `v1.0.13` tag push) | 100 |
| 4 | GitHub Actions 上で `npm ci` → `npm publish` が再現可能 | **済** (同一 workflow ログ) | 100 |
| 5 | publish artifact (`.tgz`) が version 単位で生成可能 (GHA) | **済** (artifact `s2j-docs-linter-v1.0.13`) | 100 |

**集計**: 必須 **500 / 500 → 100%**。

#### OIDC 移行 (フェーズ2 認証)

| # | 完了条件 | 状態 | 実装％ |
| ---: | --- | --- | ---: |
| O1 | npm Trusted Publisher 登録完了 | **済** (GitHub Actions / `stein2nd` / `docs-linter` / `npm-publish.yml`) | 100 |
| O2 | ワークフロー OIDC 対応 (`id-token: write`, Node 24, npm 11.6+) | **済** | 100 |
| O3 | GitHub Secrets に `NPM_TOKEN` を保持しない | **済** (`gh secret list` 空) | 100 |
| O4 | GHA OIDC による tag push publish 成功 | **済** (`v1.0.13`, run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088)) | 100 |

**集計**: OIDC **400 / 400 → 100%**。

#### 推奨

| # | 完了条件 | 状態 | 実装％ |
| ---: | --- | --- | ---: |
| 1 | GitHub Actions 上で `npm publish --dry-run` テストが可能 | **済** ([run `26359090580`](https://github.com/stein2nd/docs-linter/actions/runs/26359090580), 2026-05-24) | 100 |
| 2 | release workflow documentation が README / docs に反映済 | **済** ([release.md](./release.md)、README 導線、[specs.md](./specs.md)) | 100 |
| 3 | publish secret / auth strategy が仕様化済 | **済** ([npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md)) | 100 |

**集計**: 推奨 **3 / 3 → 100%**。

#### 将来拡張 (フェーズ3候補)

以下はフェーズ2完了条件には含めない。

* semantic-release
* automatic changelog generation
* dist-tag management
* prerelease channel

### フェーズ3: サマリー

フェーズ3では、S2J Docs Linter の **Git Submodule 依存から npm package 運用への、利用側の移行完了** を対象とします。

フェーズ1・2でパッケージ化とリリース自動化 (GHA OIDC publish) を確立したため、フェーズ3では **利用プロジェクト側** のマイグレーション完了と **本リポジトリ README の npm デフォルト化** を進めます。

| 項目 | 状態 |
| --- | --- |
| **フェーズ3 必須完了条件** | **75%** — 6 項目中 **4 済** / **1 部分済** / **1 未** |
| **フェーズ3 推奨完了条件** | **83%** — 3 項目中 **1 済** / **2 部分済** |
| **本リポジトリ実装 (フェーズ3)** | **35%** — README / examples の Submodule レガシー化は未 |
| **利用側マイグレーション** | **100%** — **9 リポジトリ** npm 化・`tools/docs-linter` 削除済 (必須 #1–2 **済**) |
| npm レジストリ (公開済) | **済** — 最新 **`@s2j/docs-linter@1.0.13`** (GHA OIDC) |
| README 導線 | **未** — 方法1 (Submodule) が主導線のまま ([README 移行](./npm_package_spec.md#readme-移行)) |

* 対象
    * Git Submodule (`tools/docs-linter`) 廃止
    * `@s2j/docs-linter` への置換
    * VSCode / `package.json` / CI マイグレーション
    * 受入テスト
    * マイグレーションドキュメント完成
* ゴール
    * **Docs Linter を再利用可能な npm パッケージとして安定利用できる状態**

**実装％の算出 (フェーズ3)**

| スコープ | 分子 / 分母 | 実装％ |
| --- | --- | ---: |
| 必須完了条件 | #1–6 の実装％合計 **450** / 600 | **75%** |
| 推奨完了条件 | #1–3 の実装％合計 **250** / 300 | **83%** |
| 優先タスク P0–P2 | (100 + 50 + 70 + 50 + 65) / 5 | **67%** |
| 本リポジトリ (README / examples) | Submodule レガシー化・npm デフォルト化 | **35%** |

**フェーズ3クローズ**: **未達** — 本リポジトリの Submodule レガシー (必須 #6: README / examples) が残存。

### フェーズ3: 優先タスクと完了条件の対比

| 優先 | タスク | 完了条件 | 状態 | 実装％ |
|------|--------|----------|------|------:|
| P0 | 既存ユーザーのマイグレーション | 主要利用プロジェクトで npm package 化成功 | **済** (**9 リポジトリ**、`tools/docs-linter` 削除済) | 100 |
| P0 | Git サブモジュールの依存関係の削除 | `tools/docs-linter` 不要化 | **部分済** (利用側 **9/9** 済。本リポジトリ README / examples 残存) | 50 |
| P1 | VSCode マイグレーション | textlint config / nodePath マイグレーション | **部分済** ([npm_usage.md](./npm_usage.md) ガイド済) | 70 |
| P1 | CI マイグレーション | GitHub Actions サブモジュールの依存関係の削除 | **部分済** (`examples/lint-docs*.yml` は npm 手順併記、Submodule 取得残存) | 50 |
| P2 | マイグレーションドキュメントの完成 | README / docs 更新完了 | **部分済** (`npm_usage.md` + [release.md](./release.md)。README flip 未) | 65 |

### フェーズ3: 完了条件

以下をすべて満たした場合、フェーズ3完了とする。

#### 必須

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| 1 | Swift プロジェクト (例: S2J About Window) 移行に成功 | **済** | 100 | Swift **3** リポジトリ (S2J About Window、S2J Source List、S2J Cozy Brew) — npm 化、`tools/docs-linter` 削除済 |
| 2 | WordPress プラグインプロジェクト (例: S2J Alliance Manager) 移行に成功 | **済** | 100 | WordPress **4** リポジトリ (S2J Alliance Manager、S2J Slug Generater、S2J Media Library Date Corrector、S2J Similarity Service) — npm 化、`tools/docs-linter` 削除済 |
| 3 | `npm install --save-dev @s2j/docs-linter` で利用可能 | **済** | 100 | npmjs 公開済 (`1.0.13`)。受入試験で `@1.0.11` 利用確認 |
| 4 | `npx s2j-docs-linter` 成功 | **済** | 100 | フェーズ1 #3、`examples/` および受入試験 |
| 5 | GitHub Actions でのドキュメント lint に成功 | **部分済** | 50 | [examples/lint-docs*.yml](../examples/lint-docs.yml) に npm lint 手順。`submodules: true` 併存 |
| 6 | Git サブモジュールの依存関係を削除 | **部分済** | 50 | 利用側 **9 リポジトリ** では `.gitmodules` / `tools/docs-linter` 削除済。本リポジトリ [README](../README.md) 方法1 (Submodule) / `examples/` の Submodule 取得は残存 |

**集計**: 必須 **450 / 600 → 75%** (4 済 / 1 部分済 / 1 未)。

#### 推奨

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| 1 | Xcode Common Specs 受け入れテスト | **済** | 100 | フェーズ1 #12 — WP Plugin Spec、Xcode Common Spec (**2** リポジトリ) |
| 2 | マイグレーションガイドの完成 | **部分済** | 70 | [npm_usage.md](./npm_usage.md) に `lint:docs` / VSCode / CI 移行例。README デフォルト npm 化は未 |
| 3 | VSCode 設定例の完成 | **部分済** | 80 | [npm_usage.md](./npm_usage.md) に Submodule → npm の before/after。利用側適用は各プロジェクト |

**集計**: 推奨 **250 / 300 → 83%** (1 済 / 2 部分済)。

#### 対象外

* 従来の Git サブモジュールの永久維持
* 自動 codemod
* マイグレーションツール

### フェーズ3の残タスク

| # | タスク | 優先度 | 実装％ | 完了条件 (#) |
| ---: | --- | --- | ---: | ---: |
| 1 | 本リポジトリ README / examples の Submodule レガシー削除 | P0 | **50** | 必須 #6 — 利用側は **9/9** 済。本リポジトリが残存 |
| 2 | README デフォルト導線を npm に変更 | P2 | **0** | 推奨 #2 — [README 移行](./npm_package_spec.md#readme-移行) フェーズ2以降 |
| 3 | `examples/lint-docs*.yml` から Submodule 取得削除 | P1 | **50** | 必須 #5 — npm のみ CI サンプル |
| 4 | 主要利用プロジェクトの本番 cutover | P0 | **100** | 必須 #1–2 — **9 リポジトリ** npm 化・`tools/docs-linter` 削除済 |

### フェーズ4: サマリー

フェーズ4では、S2J Docs Linter の **OSS パッケージとしての成熟化・安定運用** を対象とします。

フェーズ3でマイグレーションを完了した後、フェーズ4ではエコシステム / 品質 / 保守性を強化します。**現時点では未着手** (フェーズ3 必須 #6 本リポジトリ分が残存)。

| 項目 | 状態 |
| --- | --- |
| **フェーズ4 必須完了条件** | **26%** — 5 項目中 **0 済** / **3 部分済** / **2 未** |
| **フェーズ4 推奨完了条件** | **8%** — 5 項目中 **0 済** / **1 部分済** / **4 未** |
| **本リポジトリ実装 (フェーズ4)** | **26%** — 文書・CI 基盤の一部のみ |
| 前提 | フェーズ3 完了 (Submodule 非推奨化) |

* 対象
    * リリースガバナンス
    * セマンティックバージョニングの徹底
    * 変更履歴の自動化
    * CI 品質の向上
    * エコシステムの拡張
* ゴール
    * **S2J エコシステムの、安定した再利用可能な開発ツール**

**実装％の算出 (フェーズ4)**

| スコープ | 分子 / 分母 | 実装％ |
| --- | --- | ---: |
| 必須完了条件 | #1–5 の実装％合計 **130** / 500 | **26%** |
| 推奨完了条件 | #1–5 の実装％合計 **40** / 500 | **8%** |
| 優先タスク P0–P2 | (40 + 0 + 30 + 0 + 0) / 5 | **14%** |

**フェーズ4クローズ**: **未達** — CHANGELOG 運用・依存関係レビュー CI 等が未整備。

### フェーズ4: 優先タスクと完了条件の対比

| 優先 | タスク | 完了条件 | 状態 | 実装％ |
|------|--------|----------|------|------:|
| P0 | リリースガバナンス | SemVer 準拠の確立 | **部分済** ([release.md](./release.md) に tag/version 手順) | 40 |
| P0 | 変更履歴の管理 | リリース履歴の可視化 | **未** (`CHANGELOG.md` なし) | 0 |
| P1 | CI の強化 | マトリックス / 互換性の検証 | **部分済** (`engines.node >=20`、publish は Node 24 のみ) | 30 |
| P1 | 依存関係のメンテナンス | 依存関係の健全性維持 | **未** (review workflow なし) | 0 |
| P2 | エコシステムの拡張 | 追加のプリセット / ツール | **未** | 0 |

### フェーズ4: 完了条件

以下をすべて満たした場合、フェーズ4完了とする。

#### 必須

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| 1 | SemVer ガバナンスの文書化 | **部分済** | 40 | [release.md](./release.md) に semver tag 手順。専用ガバナンス文書なし |
| 2 | CHANGELOG.md 運用開始 | **未** | 0 | リポジトリ root に `CHANGELOG.md` なし |
| 3 | 依存関係レビューのワークフロー | **未** | 0 | Dependabot / scheduled review workflow なし |
| 4 | Node バージョンの互換性 CI | **部分済** | 30 | `package.json` `engines.node >=20`。GHA publish は Node 24 のみ。matrix CI なし |
| 5 | npm パッケージのメンテナンス方針の文書化 | **部分済** | 60 | [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md)、[release.md](./release.md) |

**集計**: 必須 **130 / 500 → 26%** (0 済 / 3 部分済 / 2 未)。

#### 推奨

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| 1 | セマンティック・リリースの評価 | **未** | 0 | フェーズ2「将来拡張」候補として未評価 |
| 2 | 自動生成されるリリースノート | **未** | 0 | GitHub Releases / changelog 自動化なし |
| 3 | 課題テンプレート | **未** | 0 | `.github/ISSUE_TEMPLATE/` なし |
| 4 | 貢献ガイド | **未** | 0 | `CONTRIBUTING.md` なし |
| 5 | ロードマップの可視化 | **部分済** | 40 | 本ページ ([status.md](./status.md))、[specs.md](./specs.md) |

**集計**: 推奨 **40 / 500 → 8%** (0 済 / 1 部分済 / 4 未)。

#### 対象外

* 商用サポート
* 有償配布
* エンタープライズ SLA

### フェーズ4の残タスク

| # | タスク | 優先度 | 実装％ | 完了条件 (#) |
| ---: | --- | --- | ---: | ---: |
| 1 | `CHANGELOG.md` 作成・運用開始 | P0 | **0** | 必須 #2 |
| 2 | SemVer ガバナンス文書の整備 | P0 | **40** | 必須 #1 |
| 3 | Node 互換性 matrix CI | P1 | **30** | 必須 #4 |
| 4 | 依存関係レビュー workflow | P1 | **0** | 必須 #3 |
| 5 | `CONTRIBUTING.md` / Issue テンプレート | P2 | **0** | 推奨 #3–4 |

**前提**: フェーズ3 必須 #6 (Submodule 依存削除) 完了後に本格着手。

### 機能一覧 (実装状況サマリー)

| 機能名 (仕様セクション) | 実装済み/未実装 | 実装％ | 完了条件 (要約) | 備考 |
| --- | --- | ---: | --- | --- |
| [Publishing - フェーズ1優先タスク](./npm_package_spec.md#publishing---フェーズ1優先タスク) | 実装済み | 100 | pack / dry-run / tarball / registry / 受け入れ (#1–2, #4–9, #11–12) | 最新 **`@s2j/docs-linter@1.0.13`** |
| [Publishing (パッケージ構成) - フェーズ1優先](./npm_package_spec.md#publishing-パッケージ構成---フェーズ1優先タスク) | 実装済み | 100 | `pack:artifact`、`artifacts/`、再現可能な検証 (#1–2, #4, #7, #16) | GHA artifact 名 `s2j-docs-linter-<tag>` |
| [npm パッケージ仕様](./npm_package_spec.md) (文書) | 実装済み | 100 | コードと仕様の同期 | パッケージ構成セクション反映済み |
| [`package.json` メタデータ更新](./npm_package_spec.md#packagejson-メタデータ更新) | 実装済み | 100 | `@s2j/docs-linter`、semver、`LICENSE` 等 | **`1.0.13`** (#5–6) |
| [CLI Entrypoint 公開](./npm_package_spec.md#cli-entrypoint-公開) | 実装済み | 100 | `bin` / `--profile` / 設定解決 / `--help` / `--version` | textlint を `node` 直実行 (#3) |
| [ファイルスコープの最適化 (Publish)](./npm_package_spec.md#ファイルスコープの最適化を-publish) | 実装済み | 100 | `files` + `verify:tarball` | `presets/` + root ミラー (#4, #9) |
| [CLI 互換レイヤ](./npm_package_spec.md#cli-互換レイヤ) / [互換性に関する要件](./npm_package_spec.md#互換性に関する要件) | 実装済み | 100 | パッケージ root 基準の preset 解決、互換 `docs-lint` | |
| [互換性に関する、移行戦略 - フェーズ1優先](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク) | 実装済み | 100 | tarball に `base/` `swift/` `wordpress/` 同梱 | `npm_usage.md` に VSCode / `extends` (#13–14) |
| [依存関係レビュー](./npm_package_spec.md#依存関係レビュー) | 実装済み | 100 | 実行時 → `dependencies`；`sudachi-synonyms-dictionary` 同梱 (1.0.11) | |
| [Publishing](./npm_package_spec.md#publishing) (全体) | 実装済み | 100 | フェーズ1 **16/16** + フェーズ2 **5/5** 済 | フェーズ2クローズ (2026-05-25) |
| [本リポジトリ `package.json` の `scripts` - フェーズ1優先](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク) | 実装済み | 100 | `clean` / `build` / `prepare` / publish 検証群 / CLI 経由 `lint*` | `postinstall` はフェーズ1非対象で現状維持 (#8) |
| [移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例) | 実装済み | 100 | `examples/lint-docs*.yml` で `npx s2j-docs-linter` | Submodule 取得ステップは併存 (#15) |
| [移行のワークフロー例 - フェーズ1優先](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク) | 実装済み | 100 | migration examples + `lint:docs` before/after | [npm_usage.md](./npm_usage.md) + `examples/` (#10, #15) |
| [互換性に関する、移行戦略](./npm_package_spec.md#互換性に関する移行戦略) (フェーズ1) | 実装済み | 100 | 併存基盤 + root 互換レイアウト + 移行ドキュメント | **9 リポジトリ**で Submodule → npm 移行完了 (#12) |
| [README 移行](./npm_package_spec.md#readme-移行) | フェーズ1済 | 100 | Submodule 主 + npm 併記、動作する CLI 例 | フェーズ3で Submodule レガシー化予定 (#10) |
| [GitHub Actions Publish ワークフロー](./npm_package_spec.md#github-actions-publish-ワークフロー) | 運用中 | 100 | OIDC tag publish + artifact | run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088) |
| [GitHub Actions Publish - フェーズ1優先](./npm_package_spec.md#github-actions-publish-ワークフロー---フェーズ1優先タスク) | 運用中 | 100 | tag `v*` / `npm ci` / 検証 / artifact / publish | OIDC 運用 (2026-05-25) |
| [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) | 実装済み | 100 | Trusted Publishing 登録 + ワークフロー OIDC | `NPM_TOKEN` Secret 不使用 |
| [npm 使い方ガイド との整合 - フェーズ1優先](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク) / [npm_usage.md](./npm_usage.md) | 実装済み | 100 | README のコマンドが実際に動く | `lint:docs` / VSCode / `extends` / CI (#10, #14) |
| [VSCode 互換戦略](./npm_package_spec.md#vscode-互換戦略) | ガイド済み | 100 | [npm_usage.md](./npm_usage.md) に移行例 | 利用側での設定変更は各プロジェクト (#14) |
| [CI 互換戦略](./npm_package_spec.md#ci-互換戦略) | ガイド済み | 100 | `npm_usage.md` / `examples/` に CI 例 | 利用側 CI 移行は各プロジェクト (#15) |
| [バージョン管理ポリシー](./npm_package_spec.md#バージョン管理ポリシー) | 運用開始 | — | semver 運用 | npm 最新 **`1.0.13`** (GHA OIDC) |
| [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) フェーズ3 | 進行中 | 75 | Submodule 非推奨化・利用側 cutover | 必須 #1–2 **済** (9 リポ)。#6 は本リポジトリ残存 |
| [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) フェーズ4 | 未着手 | 26 | レガシー機能削除・OSS 成熟化 | 必須 #1–5。フェーズ3 完了が前提 |
| [README 移行](./npm_package_spec.md#readme-移行) (フェーズ3) | 未着手 | 0 | npm デフォルト化、Submodule を appendix へ | 必須 #6 / 推奨 #2 |

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
* [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) … Trusted Publishing (OIDC) 登録済、`NPM_TOKEN` 非使用
* 本リポジトリ `scripts` 整理 … `clean` / `build` (`tsc` + ミラー生成) / `prepare`、publish 用 dry-run 群
* 本リポジトリ `lint` / `lint:wp` / `lint:swift` をビルド済み CLI 経由に統一
* `files` を runtime 最小構成に整理 (`scripts/patch-wp-prh-colon-quote.cjs` のみ同梱)
* `package.json` `bin` の互換 CLI を `docs-lint` に統一
* **`@s2j/docs-linter@1.0.10`** npmjs 初回 publish (2026-05-23)
* **`@s2j/docs-linter@1.0.11`** — `sudachi-synonyms-dictionary` を dependencies に追加 (peer 依存の利用側エラー解消)
* **`@s2j/docs-linter@1.0.12`** — 手動 publish (2026-05-24、`npm whoami` → `stein2nd`)
* **`@s2j/docs-linter@1.0.13`** — GHA OIDC publish (2026-05-25、run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088))
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
| `.github/workflows/npm-publish.yml` | OIDC 運用: tag `v*` / `workflow_dispatch` → `verify:tarball` → `pack:artifact` → `upload-artifact` → `npm publish` | #16, M2 |
| (運用) npmjs publish | `@s2j/docs-linter@1.0.10` 初回、`1.0.11`、`1.0.12` (手動)、**`1.0.13`** (GHA OIDC) | #11 |
| (運用) 利用側受け入れ試験 | 9 リポジトリ (WordPress / Swift / 仕様ドキュメント) — `lint:docs` 成功 | #12 |

### フェーズ1の残タスク

**なし** — フェーズ1完了条件 #1–16 はすべて **済** (2026-05-24)。フェーズ2は **2026-05-25 クローズ**。

| # | タスク | 優先度 | 実装％ | 完了条件 (#) |
| ---: | --- | --- | ---: | ---: |
| 1 | npmjs への publish | フェーズ1 | **100** | #11 — 最新 **`@s2j/docs-linter@1.0.13`** (GHA OIDC) |
| 2 | 利用側プロジェクトでの受け入れ試験 | フェーズ1 | **100** | #12 — 9 リポジトリで `lint:docs` 成功 (下表参照) |
| 3 | GHA からの tag 連動 publish 運用 | **フェーズ2** | **100** | OIDC tag publish 成功 (`v1.0.13`, run `26381626088`) |

### フェーズ2で完了した項目

* **M3**: `@s2j/docs-linter` npmjs publish — **済** (最新 **`1.0.13`**、GHA OIDC)
* **受け入れ試験 (フェーズ1 #12)**: **9 リポジトリ** — `@s2j/docs-linter@1.0.11` で検証済 (2026-05-24)
* **手動 publish (2026-05-24)**: `npm login` (`stein2nd`) → `npm publish --access public` 成功、`npm view` → **`1.0.12`**
* **npm Trusted Publisher 登録 (2026-05-24)**: GitHub Actions / `stein2nd` / `docs-linter` / `npm-publish.yml` (Allow publish / Allow stage publish)
* **ワークフロー OIDC 化 (2026-05-24)**: `id-token: write`、`NPM_TOKEN` 参照削除
* **GHA ワークフロー強化**: `workflow_dispatch` (dry-run)、tag/version 一致検証 (`scripts/verify-release-tag.cjs`)
* **リリース手順文書**: [release.md](./release.md)
* **GHA dry-run 検証 (M1)**: run [`26359090580`](https://github.com/stein2nd/docs-linter/actions/runs/26359090580) 成功
* **GHA OIDC publish (M2 / 必須 #3–4 / OIDC O4)**: `v1.0.13` tag push → run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088) 成功 (2026-05-25)
* **GHA artifact (M4 / 必須 #5)**: artifact `s2j-docs-linter-v1.0.13` 保存確認
* **フェーズ2クローズ (M5)**: **達成** (2026-05-25)

#### 運用 (手動)

* npmjs publish … `@s2j/docs-linter@1.0.10` (初回)、`1.0.11`、`1.0.12` (2026-05-24 手動)、**`1.0.13`** (2026-05-25 GHA OIDC)
* 利用側受け入れ … 上記 **9 リポジトリ** npm 化・`tools/docs-linter` 削除済、`npm run lint:docs` 成功

### フェーズ2で完了した主な変更 (コード・文書)

| 対象 | 内容 | 関連 |
| --- | --- | --- |
| `.github/workflows/npm-publish.yml` | OIDC 運用 (Node 24, npm 11.6+, `id-token: write`, `registry-url` なし) | O2, P0, M2 |
| `docsMod/release.md` | Trusted Publishing 手順、ローカル publish トラブルシュート | 推奨 #2, O1 |
| `scripts/verify-release-tag.cjs` | tag と `package.json` version 一致検証 | M2 |
| `package.json` | **`1.0.13`** (GHA OIDC publish) | M2, 必須 #1 |
| (運用) Trusted Publisher | npmjs package settings 登録 | O1 |
| (運用) GHA dry-run | run [`26359090580`](https://github.com/stein2nd/docs-linter/actions/runs/26359090580) | M1 |
| (運用) GHA OIDC publish | run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088) 成功 | M2, 必須 #3–4, O4 |
| (運用) GHA artifact | `s2j-docs-linter-v1.0.13` | M4, 必須 #5 |

### フェーズ2の残タスク

**なし** — フェーズ2必須条件 #1–5、OIDC O1–O4、マイルストーン M1–M5 はすべて **済** (2026-05-25)。

### フェーズ2のマイルストーン

| # | マイルストーン | 状態 | 実装％ | 検証 |
| ---: | --- | --- | ---: | --- |
| M1 | GitHub Actions で `npm publish --dry-run` 成功 | **済** | 100 | run [`26359090580`](https://github.com/stein2nd/docs-linter/actions/runs/26359090580) (2026-05-24) |
| M2 | test tag push で workflow success (GHA OIDC publish) | **済** | 100 | run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088) (`v1.0.13`, 2026-05-25) |
| M3 | `@s2j/docs-linter` npmjs publish | **済** | 100 | 最新 **`@s2j/docs-linter@1.0.13`** |
| M4 | artifact retention 確立 (GHA) | **済** | 100 | artifact `s2j-docs-linter-v1.0.13` |
| M5 | フェーズ2完了 | **済** | 100 | 2026-05-25 |

**集計**: マイルストーン **5 / 5 → 100%**。

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
* **GHA と認証**:
    * **Trusted Publishing (OIDC)** 運用中。`permissions.id-token: write`、Node 24、npm 11.6+、`setup-node` に `registry-url` を設定しない (OIDC 競合回避)。
    * npm Trusted Publisher: GitHub Actions / `stein2nd` / `docs-linter` / `npm-publish.yml`。
    * GitHub Secret `NPM_TOKEN` … **未登録・不使用**。
    * 初回 GHA OIDC publish: `v1.0.13` → run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088) (2026-05-25)。
* **npm publish / 受け入れ試験**:
    * レジストリ最新 … **`@s2j/docs-linter@1.0.13`** (`npm view` 確認済、2026-05-25)
    * GHA OIDC publish … **`1.0.13`** / 手動 publish … **`1.0.10`–`1.0.12`**
    * 受け入れ (#12) … **9 リポジトリ** npm 化・`tools/docs-linter` 削除済 (フェーズ3 #1–2 **済**)
* **フェーズ3 / 4**:
    * フェーズ3 … 必須 **75%** — 利用側 **9 リポジトリ** で必須 #1–2 **済** (`tools/docs-linter` 削除済)。残りは **#5–6** (本リポジトリ README / examples の Submodule レガシー) と README npm デフォルト化。
    * フェーズ4 … 必須 **26%** — [release.md](./release.md) / [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) により一部文書化済。`CHANGELOG.md`・matrix CI・依存関係 review workflow は未整備。
* **ローカル検証の一式**:
    * 下記コマンドを利用する。

```bash
npm run verify:tarball
npm view @s2j/docs-linter version  # => 1.0.13
npm run lint
```

* **GHA リリース手順** (以降の semver):

```bash
# package.json version を更新 → main に merge
git tag vX.Y.Z && git push origin vX.Y.Z
gh run watch
npm view @s2j/docs-linter version
```
