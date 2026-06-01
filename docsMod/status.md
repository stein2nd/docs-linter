## S2J Docs Linter - 実装状況

本ページは、[npm パッケージ仕様](./npm_package_spec.md) にもとづく実装修正の進捗を一覧化します。仕様書の [フェーズ1実装状況](./npm_package_spec.md#フェーズ1実装状況-2026-05) と相互参照します。publish 認証・シークレット方針は [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) を参照してください。

**移行フェーズ** は [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) に従い、**フェーズ1 完了**、**フェーズ2 完了**、**フェーズ3 完了**、**フェーズ4 完了** (必須 + 推奨 **100%**)。

最終更新…**2026-05-26**
* フェーズ1–4 **クローズ**。npm **`@s2j/docs-linter@1.0.13`**。
* フェーズ4 **100%** (必須 **5/5** + 推奨 **5/5**、**クローズ** 2026-05-26)
    * 推奨 **#1 済** — [semantic_release_evaluation.md](./semantic_release_evaluation.md)
        * 結論は、**現時点では非採用**。
    * CI: [ci.yml](../.github/workflows/ci.yml) · [dependabot.yml](../.github/dependabot.yml) · [npm-publish.yml](../.github/workflows/npm-publish.yml) OIDC + GitHub Release。
    * 推奨 **#2–#5 済** — リリースノート自動化 / Issue テンプレ / [CONTRIBUTING.md](../CONTRIBUTING.md) / ロードマップ。
* フェーズ4 **P2 (CLI ツール)** — [cli_tooling_spec.md](./cli_tooling_spec.md) **`init` 済** (`npm run test:init` · INIT-001〜012 · GHA)、**`doctor` 未** (仕様のみ・スタブ)。

### 全体進捗 (サマリー)

| フェーズ | 完了条件 | 実装％ | 状態 |
| --- | --- | ---: | --- |
| フェーズ1 | #1–16 | **100%** (16/16 済) | **クローズ** (2026-05-24) |
| フェーズ2 必須 | #1–5 | **100%** (5/5 済) | **クローズ** (2026-05-25) |
| フェーズ2 OIDC | O1–O4 | **100%** (4/4 済) | **クローズ** (2026-05-25) |
| フェーズ2 推奨 | #1–3 | **100%** (3/3 済) | **クローズ** (2026-05-25) |
| フェーズ2 M1–M5 | マイルストーン | **100%** (5/5 済) | **クローズ** (2026-05-25) |
| フェーズ3 必須 | #1–6 | **100%** (6/6 済) | **クローズ** (2026-05-25) |
| フェーズ3 推奨 | #1–3 | **100%** (3/3 済) | **クローズ** (2026-05-25) |
| フェーズ4 必須 | #1–5 | **100%** (5/5 済) | **必須クローズ** |
| フェーズ4 推奨 | #1–5 | **100%** (5/5 済) | **クローズ** (2026-05-26) |
| フェーズ4 全体 | 必須 + 推奨 | **100%** (1000/1000) | **クローズ** (2026-05-26) |

**フェーズ4 必須 #1–5 (内訳)**

| # | 完了条件 | 状態 | 実装％ |
| ---: | --- | --- | ---: |
| 1 | SemVer ガバナンスの文書化 | **済** | 100 |
| 2 | CHANGELOG.md 運用開始 | **済** | 100 |
| 3 | 依存関係レビューのワークフロー | **済** | 100 |
| 4 | Node バージョンの互換性 CI | **済** | 100 |
| 5 | npm パッケージのメンテナンス方針の文書化 | **済** | 100 |

**フェーズ4 推奨 #1–5 (内訳)**

| # | 完了条件 | 状態 | 実装％ |
| ---: | --- | --- | ---: |
| 1 | セマンティック・リリースの評価 | **済** | 100 |
| 2 | 自動生成されるリリースノート | **済** | 100 |
| 3 | 課題テンプレート | **済** | 100 |
| 4 | 貢献ガイド | **済** | 100 |
| 5 | ロードマップの可視化 | **済** | 100 |

### 仕様書 (参照元)

| ドキュメント | 内容 |
| --- | --- |
| [npm パッケージ仕様](./npm_package_spec.md) | npm 配布、CLI、互換、移行、GHA publish、**パッケージ構成 (artifact)** の全体仕様 |
| [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) | Trusted Publishing (OIDC) 登録済、`NPM_TOKEN` 非使用方針 |
| [npm リリース手順](./release.md) | GHA tag publish、[CHANGELOG 更新](./release.md#3-changelog-更新)、Trusted Publishing (OIDC)、[GitHub リリースノート](./release.md#8-github-リリースノート) — 推奨 #2 **済** |
| [npm 使い方ガイド](./npm_usage.md) | install / CLI / `package.json` `lint:docs` 移行 / VSCode・`extends` / CI |
| [CLI ツール仕様](./cli_tooling_spec.md) | `init` / `doctor` コマンド、`init` テスト仕様 (INIT-001〜012)、CLI エントリポイント方針 |
| [CHANGELOG.md](../CHANGELOG.md) | npm 公開版の変更履歴 (`1.0.10`–) — 必須 #2 **済**、Git 管理 |
| [SemVer 方針](./versioning_policy.md) | MAJOR / MINOR / PATCH、破壊的変更、非推奨、タグ規約 — 必須 #1 **済** |
| [メンテナンス方針](./maintenance_policy.md) | リリース / CI / 依存 / セキュリティ / ドキュメント保守 — 必須 #5 **済** |
| [セマンティック・リリース評価](./semantic_release_evaluation.md) | 採用可否評価 — 推奨 #1 **済**、結論: **現時点では非採用** |
| [`.github/dependabot.yml`](../.github/dependabot.yml) | npm / github-actions 依存関係の weekly レビュー — 必須 #3 **済** |
| [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | Node 20/22/24 matrix、`pack:check` / `verify:tarball` (push/PR) — 必須 #4 **済** |
| [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml) | tag `v*` / OIDC publish、Node 24、`Create GitHub Release` (`generate_release_notes: true`) — フェーズ2 **済** / 推奨 #2 **済** |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | 貢献ガイド (日英) — 推奨 #4 **済**。[README.md](../README.md) Contributing から導線 |
| [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/) | Bug / Feature テンプレ + `config.yml` — 推奨 #3 **済** |
| [仕様書の起点](./specs.md) | 仕様導線 + [プロジェクトのロードマップ](./specs.md#プロジェクトのロードマップ) → [status.md](./status.md) — 推奨 #5 **済** |
| [README.md](../README.md) | [ロードマップ](../README.md#ロードマップ) — status / ガバナンス導線 · Contributing → [CONTRIBUTING.md](../CONTRIBUTING.md) — 推奨 #4–#5 |

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
| [依存関係レビュー](./npm_package_spec.md#依存関係レビュー) | 実装済み | 100 | 実行時 → `dependencies`；Dependabot weekly | [`.github/dependabot.yml`](../.github/dependabot.yml) (必須 #3 **済**) |
| [Publishing](./npm_package_spec.md#publishing) (全体) | 実装済み | 100 | フェーズ1 **16/16** + フェーズ2 **5/5** + フェーズ3 **9/9** 済 | フェーズ3 **クローズ** (2026-05-25) |
| [本リポジトリ `package.json` の `scripts` - フェーズ1優先](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク) | 実装済み | 100 | `clean` / `build` / `prepare` / publish 検証群 / CLI 経由 `lint*` | `postinstall` はフェーズ1非対象で現状維持 (#8) |
| [移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例) | 実装済み | 100 | `examples/lint-docs*.yml` で `npx s2j-docs-linter` | フェーズ3 #5 **済**。legacy Submodule ステップは reference |
| [移行のワークフロー例 - フェーズ1優先](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク) | 実装済み | 100 | migration examples + `lint:docs` before/after | [npm_usage.md](./npm_usage.md) + `examples/` (#10, #15) |
| [互換性に関する、移行戦略](./npm_package_spec.md#互換性に関する移行戦略) (フェーズ1) | 実装済み | 100 | 併存基盤 + root 互換レイアウト + 移行ドキュメント | **9 リポジトリ**で Submodule → npm 移行完了 (#12) |
| [README 移行](./npm_package_spec.md#readme-移行) | **済** | 100 | migration guide + legacy 非推奨 + VSCode 定着 | フェーズ3 推奨 #2–3 **済** (#6 **済**) |
| [GitHub Actions Publish ワークフロー](./npm_package_spec.md#github-actions-publish-ワークフロー) | 運用中 | 100 | OIDC tag publish + artifact | run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088) |
| [GitHub Actions Publish - フェーズ1優先](./npm_package_spec.md#github-actions-publish-ワークフロー---フェーズ1優先タスク) | 運用中 | 100 | tag `v*` / `npm ci` / 検証 / artifact / publish | OIDC 運用 (2026-05-25) |
| [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) | 実装済み | 100 | Trusted Publishing 登録 + ワークフロー OIDC | `NPM_TOKEN` Secret 不使用 |
| [npm 使い方ガイド との整合 - フェーズ1優先](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク) / [npm_usage.md](./npm_usage.md) | 実装済み | 100 | README のコマンドが実際に動く | `lint:docs` / VSCode / `extends` / CI (#10, #14) |
| [VSCode 互換戦略](./npm_package_spec.md#vscode-互換戦略) | ガイド済み | 100 | [npm_usage.md](./npm_usage.md) に移行例 | 利用側 **9 リポ** canonical 設定 (フェーズ3 推奨 #3 **済**) |
| [CI 互換戦略](./npm_package_spec.md#ci-互換戦略) | ガイド済み | 100 | `npm_usage.md` / `examples/` に CI 例 | 利用側 **9 リポ** GHA docs lint 成功 (フェーズ3 #5 **済**) |
| Node matrix CI (フェーズ4) | **済** | 100 | Node 20/22/24 互換検証 | [ci.yml](../.github/workflows/ci.yml) (必須 #4 **済**) |
| [バージョン管理ポリシー](./npm_package_spec.md#バージョン管理ポリシー) | **済** | 100 | semver 運用 + CHANGELOG | [versioning_policy.md](./versioning_policy.md) (必須 #1 **済**) |
| CHANGELOG / リリース履歴 (フェーズ4) | **済** | 100 | `CHANGELOG.md` 運用 + [release.md](./release.md) 連携 | 必須 #2 **済** |
| メンテナンス方針 (フェーズ4) | **済** | 100 | 保守・更新方針の文書化 | [maintenance_policy.md](./maintenance_policy.md) (必須 #5 **済**) |
| CONTRIBUTING (フェーズ4) | **済** | 100 | 貢献ガイド (setup / workflow / 検証 / 互換 / CI 等) | [CONTRIBUTING.md](../CONTRIBUTING.md) + [README.md](../README.md) 導線 (推奨 #4 **済**) |
| Issue テンプレート (フェーズ4) | **済** | 100 | Bug / Feature テンプレ + config | [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/) (推奨 #3 **済**) |
| ロードマップ可視化 (フェーズ4) | **済** | 100 | status + specs + README 導線 | [status.md](./status.md) · [specs.md](./specs.md) · [README.md](../README.md) (推奨 #5 **済**) |
| GitHub リリースノート (フェーズ4) | **済** | 100 | tag publish 連動 Release 自動作成 | [npm-publish.yml](../.github/workflows/npm-publish.yml) `generate_release_notes: true` + [release.md](./release.md#8-github-リリースノート) (推奨 #2 **済**) |
| セマンティック・リリース評価 (フェーズ4) | **済** | 100 | 採用可否評価の文書化 | [semantic_release_evaluation.md](./semantic_release_evaluation.md) — 結論: **現時点では非採用** (推奨 #1 **済**) |
| [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) フェーズ3 | **済** | 100 | Submodule 非推奨化・利用側 cutover | 必須 #1–6 + 推奨 #1–3 **済** (2026-05-25) |
| [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) フェーズ4 | **クローズ** | 100 | レガシー機能削除・OSS 成熟化 | 必須 **5/5 済** + 推奨 **5/5 済** (2026-05-26) |
| [CLI コマンド - init](./cli_tooling_spec.md#cli-コマンド---init) | **済** | 100 | 通常 / Dry Run / `--output` モード、プリセット、上書き、`package.json` `lint:docs`、`init` テスト仕様 | [cli_tooling_spec.md](./cli_tooling_spec.md) · `npm run test:init` · [ci.yml](../.github/workflows/ci.yml) |
| [CLI コマンド - doctor](./cli_tooling_spec.md#cli-コマンド---doctor-コマンド) | **未** | 30 | 環境診断 (PASS / WARN / FAIL)、9 項目チェック | 仕様 **済** · ルータースタブのみ · **テスト仕様未作成** |

### フェーズ1: サマリー

仕様のフェーズ1優先タスク ([Publishing](./npm_package_spec.md#publishing---フェーズ1優先タスク)、[**Publishing (パッケージ構成)**](./npm_package_spec.md#publishing-パッケージ構成---フェーズ1優先タスク)、[本リポジトリ `scripts`](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts---フェーズ1優先タスク)、[移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク)、[互換移行戦略](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク)、[npm 使い方ガイド整合](./npm_package_spec.md#npm-使い方ガイド-との整合---フェーズ1優先タスク)、[GitHub Actions Publish](./npm_package_spec.md#github-actions-publish-ワークフロー---フェーズ1優先タスク)) と本ページの完了条件を一致させています。

| 項目 | 状態 |
| --- | --- |
| 移行フェーズ | **フェーズ1 完了** **16/16 済**。**フェーズ2 完了** **5/5 済**。**フェーズ3 完了** **必須 6/6 + 推奨 3/3 済**。**フェーズ4 完了** 必須 **5/5** + 推奨 **5/5 済** (2026-05-26) |
| **本リポジトリ 実装％** | **100%** — 本リポジトリ責務の完了条件 (#1–10, #13–16) はすべて **済** |
| **フェーズ1全体 実装％** | **100%** — 完了条件 16 項目中 **16 済** |
| npm パッケージ名 | `@s2j/docs-linter` (`package.json` 反映済み) |
| 正式 CLI | `s2j-docs-linter` (互換: `docs-lint`) |
| プリセットレイアウト | `presets/{base,swift,wordpress}/` を維持 + tarball に root 互換ミラー (`base/` `swift/` `wordpress/`) を同梱 |
| ビルド entrypoint | **済** — `npm run build` (`tsc` + `setup-npmignore` + `link-preset-layout-compat`)、`prepare` → `build` |
| tarball (`npm pack`) | **済** — dry-run (`pack:check`) + 内容検証 (`verify:tarball`) — **22 entries** |
| tarball artifact (`./artifacts/`) | **済** — `pack:artifact` → `s2j-docs-linter-<version>.tgz`、`verify:artifact`、`.gitignore` で root 非汚染 |
| publish 準備 (`npm publish --dry-run`) | **済** — `npm run publish:dry-run` 成功 |
| GHA publish ワークフロー | **運用中 (OIDC + GitHub Release)** — tag `v*` push で publish + Release 自動作成 ([run `26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088)) |
| publish 認証方針 (文書) | **済** — Trusted Publishing (OIDC) 運用中。`NPM_TOKEN` 不使用 |
| README / npm_usage / examples 整合 | **済** — install・CLI・`lint:docs` 移行例・VSCode/`extends`・CI サンプルを一致 |
| npm レジストリ公開 | **済** — 最新 **`@s2j/docs-linter@1.0.13`**。GHA OIDC publish (`1.0.13`)、手動 publish (`1.0.10`–`1.0.12`) |

| 区分 (仕様書) | フェーズ1の状態 |
| --- | --- |
| 実装済み | メタデータ、CLI、`scripts` 整理、tarball 検証 (22 entries)、**`pack:artifact` / `artifacts/`**、root 互換レイアウト、`examples/`・[npm_usage.md](./npm_usage.md) 整合、**GHA publish ワークフロー** (OIDC 運用)、**npmjs publish** (`1.0.10`–`1.0.12` 手動 / **`1.0.13`** GHA OIDC)、**利用側受け入れ試験** (**9** リポジトリ) |
| 実装済み (フェーズ4) | 必須 #1–5 **済** — [versioning_policy.md](./versioning_policy.md)、[CHANGELOG.md](../CHANGELOG.md)、[`.github/dependabot.yml`](../.github/dependabot.yml)、[`.github/workflows/ci.yml`](../.github/workflows/ci.yml)、[maintenance_policy.md](./maintenance_policy.md)。推奨 #1 **済** — [semantic_release_evaluation.md](./semantic_release_evaluation.md) (結論: **現時点では非採用**)。推奨 #2 **済** — [npm-publish.yml](../.github/workflows/npm-publish.yml) GitHub Release (`generate_release_notes: true`) + [release.md](./release.md#8-github-リリースノート)。推奨 #3 **済** — [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/)。推奨 #4 **済** — [CONTRIBUTING.md](../CONTRIBUTING.md) + [README.md](../README.md) 導線。推奨 #5 **済** — 本ページ + [specs.md](./specs.md) ロードマップ + [README.md](../README.md) ロードマップ / ガバナンス |
| 部分実施 (フェーズ4) | **なし** |
| 未実施 (フェーズ4) | **なし** |

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
| 12 | 利用側プロジェクトでの受け入れ試験 | **済** | 100 | 2026-05-24: **9 リポジトリ** — 下表「#12 受け入れ試験」参照。npm 化・`tools/docs-linter` 削除済 (フェーズ3 #1–2, #6) |
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
* `.github/workflows/npm-publish.yml` … tag `v*` / `workflow_dispatch` → `pack:check` → `verify:tarball` → `pack:artifact` → `upload-artifact` → `npm publish` → `Create GitHub Release` (OIDC 運用、GHA dry-run 成功)
* [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) … Trusted Publishing (OIDC) 登録済、`NPM_TOKEN` 非使用
* 本リポジトリ `scripts` 整理 … `clean` / `build` (`tsc` + ミラー生成) / `prepare`、publish 用 dry-run 群
* 本リポジトリ `lint` / `lint:wp` / `lint:swift` をビルド済み CLI 経由に統一
* `files` を runtime 最小構成に整理 (`scripts/patch-wp-prh-colon-quote.cjs` のみ同梱)
* `package.json` `bin` の互換 CLI を `docs-lint` に統一
* **`@s2j/docs-linter@1.0.10`** npmjs 初回 publish (2026-05-23)
* **`@s2j/docs-linter@1.0.11`** — `sudachi-synonyms-dictionary` を dependencies に追加 (peer 依存の利用側エラー解消)
* **`@s2j/docs-linter@1.0.12`** — 手動 publish (2026-05-24、`npm whoami` → `stein2nd`)
* **`@s2j/docs-linter@1.0.13`** — GHA OIDC publish (2026-05-25、run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088))
* **利用側受け入れ試験 (#12)** — **9 リポジトリ** npm 化・`tools/docs-linter` 削除済、`npm run lint:docs` 成功 (2026-05-24 受入 → フェーズ3 cutover 済)

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
| `.github/workflows/npm-publish.yml` | OIDC 運用: tag `v*` / `workflow_dispatch` → 検証 → artifact → publish → GitHub Release | #16, M2 / 推奨 #2 |
| (運用) npmjs publish | `@s2j/docs-linter@1.0.10` 初回、`1.0.11`、`1.0.12` (手動)、**`1.0.13`** (GHA OIDC) | #11 |
| (運用) 利用側受け入れ試験 | 9 リポジトリ (WordPress / Swift / 仕様ドキュメント) — `lint:docs` 成功 | #12 |

### フェーズ1の残タスク

**なし** — フェーズ1完了条件 #1–16 はすべて **済** (2026-05-24)。フェーズ2 **2026-05-25 クローズ**。フェーズ3 **2026-05-25 クローズ**。

| # | タスク | 優先度 | 実装％ | 完了条件 (#) |
| ---: | --- | --- | ---: | ---: |
| 1 | npmjs への publish | フェーズ1 | **100** | #11 — 最新 **`@s2j/docs-linter@1.0.13`** (GHA OIDC) |
| 2 | 利用側プロジェクトでの受け入れ試験 | フェーズ1 | **100** | #12 — 9 リポジトリで `lint:docs` 成功 (下表参照) |
| 3 | GHA からの tag 連動 publish 運用 | **フェーズ2** | **100** | OIDC tag publish 成功 (`v1.0.13`, run `26381626088`) |

### フェーズ2: サマリー

フェーズ2では、S2J Docs Linter (`@s2j/docs-linter`) の **GitHub Actions を用いた npm Registry 自動 publish 基盤の構築** を対象とした。**2026-05-25 時点で完了**。

| 項目 | 状態 |
| --- | --- |
| **フェーズ2 必須完了条件** | **100%** — 5 項目中 **5 済** |
| **フェーズ2 OIDC 移行 (O1–O4)** | **100%** — 4 項目中 **4 済** |
| **フェーズ2 推奨完了条件** | **100%** — 3 項目中 **3 済** |
| **フェーズ2 マイルストーン (M1–M5)** | **100%** — M1–M5 **すべて済** |
| **本リポジトリ実装 (フェーズ2)** | **100%** |
| npm レジストリ (公開済) | **済** — 最新 **`@s2j/docs-linter@1.0.13`**(GHA OIDC publish、2026-05-25) |
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

### フェーズ2で完了した項目

* **M3**: `@s2j/docs-linter` npmjs publish — **済** (最新 **`1.0.13`**、GHA OIDC)
* **受け入れ試験 (フェーズ1 #12 / フェーズ3 #1–2)**: **9 リポジトリ** npm 化・`tools/docs-linter` 削除済
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
| `.github/workflows/npm-publish.yml` | OIDC 運用 (Node 24, npm 11.6+, `id-token: write`)。フェーズ4 で GitHub Release 自動作成を追加 | O2, P0, M2 / 推奨 #2 |
| `docsMod/release.md` | Trusted Publishing 手順、ローカル publish トラブルシュート | 推奨 #2, O1 |
| `scripts/verify-release-tag.cjs` | tag と `package.json` version 一致検証 | M2 |
| `package.json` | **`1.0.13`** (GHA OIDC publish) | M2, 必須 #1 |
| (運用) Trusted Publisher | npmjs package settings 登録 | O1 |
| (運用) GHA dry-run | run [`26359090580`](https://github.com/stein2nd/docs-linter/actions/runs/26359090580) | M1 |
| (運用) GHA OIDC publish | run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088) 成功 | M2, 必須 #3–4, O4 |
| (運用) GHA artifact | `s2j-docs-linter-v1.0.13` | M4, 必須 #5 |

### フェーズ2のマイルストーン

| # | マイルストーン | 状態 | 実装％ | 検証 |
| ---: | --- | --- | ---: | --- |
| M1 | GitHub Actions で `npm publish --dry-run` 成功 | **済** | 100 | run [`26359090580`](https://github.com/stein2nd/docs-linter/actions/runs/26359090580) (2026-05-24) |
| M2 | test tag push で workflow success (GHA OIDC publish) | **済** | 100 | run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088) (`v1.0.13`, 2026-05-25) |
| M3 | `@s2j/docs-linter` npmjs publish | **済** | 100 | 最新 **`@s2j/docs-linter@1.0.13`** |
| M4 | artifact retention 確立 (GHA) | **済** | 100 | artifact `s2j-docs-linter-v1.0.13` |
| M5 | フェーズ2完了 | **済** | 100 | 2026-05-25 |

**集計**: マイルストーン **5 / 5 → 100%**。

### フェーズ2の残タスク

**なし** — フェーズ2必須条件 #1–5、OIDC O1–O4、マイルストーン M1–M5 はすべて **済** (2026-05-25)。

### フェーズ3: サマリー

フェーズ3では、S2J Docs Linter の **Git Submodule 依存から npm package 運用への、利用側の移行完了** を対象とします。

フェーズ1・2でパッケージ化とリリース自動化 (GHA OIDC publish) を確立。**フェーズ3 は 2026-05-25 クローズ** (必須 #1–6 + 推奨 #1–3 **済**)。

| 項目 | 状態 |
| --- | --- |
| **フェーズ3 必須完了条件** | **100%** — 6 項目中 **6 済** |
| **フェーズ3 推奨完了条件** | **100%** — 3 項目中 **3 済** |
| **本リポジトリ実装 (フェーズ3)** | **100%** |
| **利用側マイグレーション** | **100%** — **9 リポジトリ** npm 化・`tools/docs-linter` 削除済 |
| npm レジストリ (公開済) | **済** — 最新 **`@s2j/docs-linter@1.0.13`** (GHA OIDC) |
| README トップ導線 (UX) | 方法1/2 併記 — npm 主導線 flip は UX 向上項目 (完了条件外) |

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
| 必須完了条件 | #1–6 の実装％合計 **600** / 600 | **100%** |
| 推奨完了条件 | #1–3 の実装％合計 **300** / 300 | **100%** |
| 優先タスク P0–P2 | (100 + 100 + 100 + 100 + 100) / 5 | **100%** |
| 本リポジトリ (README / examples) | migration guide 整備 + legacy reference | **100%** |

**フェーズ3クローズ**: **達成** (2026-05-25) — 必須 **6/6** + 推奨 **3/3**。

### フェーズ3: 優先タスクと完了条件の対比

| 優先 | タスク | 完了条件 | 状態 | 実装％ |
|------|--------|----------|------|------:|
| P0 | 既存ユーザーのマイグレーション | 主要利用プロジェクトで npm package 化成功 | **済** (**9 リポジトリ**、`tools/docs-linter` 削除済) | 100 |
| P0 | Git サブモジュールの依存関係の削除 | `tools/docs-linter` 不要化 | **済** (利用側 **9/9** 済。[README](../README.md) legacy 非推奨セクション追加) | 100 |
| P1 | VSCode マイグレーション | textlint config / nodePath マイグレーション | **済** (利用側 **9 リポ** canonical 設定定着) | 100 |
| P1 | CI マイグレーション | GitHub Actions サブモジュールの依存関係の削除 | **済** (npm workflow 整備・利用側 migration 実績。legacy examples は reference) | 100 |
| P2 | マイグレーションドキュメントの完成 | README / docs 更新完了 | **済** ([npm_usage.md](./npm_usage.md) + [README](../README.md) legacy セクション) | 100 |

### フェーズ3: 完了条件

以下をすべて満たした場合、フェーズ3完了とする。

#### 必須

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| 1 | Swift プロジェクト (例: S2J About Window) 移行に成功 | **済** | 100 | Swift **3** リポジトリ (S2J About Window、S2J Source List、S2J Cozy Brew) — npm 化、`tools/docs-linter` 削除済 |
| 2 | WordPress プラグインプロジェクト (例: S2J Alliance Manager) 移行に成功 | **済** | 100 | WordPress **4** リポジトリ (S2J Alliance Manager、S2J Slug Generater、S2J Media Library Date Corrector、S2J Similarity Service) — npm 化、`tools/docs-linter` 削除済 |
| 3 | `npm install --save-dev @s2j/docs-linter` で利用可能 | **済** | 100 | npmjs 公開済 (`1.0.13`)。受入試験で `@1.0.11` 利用確認 |
| 4 | `npx s2j-docs-linter` 成功 | **済** | 100 | フェーズ1 #3、`examples/` および受入試験 |
| 5 | GitHub Actions でのドキュメント lint に成功 | **済** | 100 | npm package ベース GHA workflow で docs lint 成功。[examples/lint-docs*.yml](../examples/lint-docs.yml) に npm workflow 記載。利用側 migration 実績 (**9 リポ**)。legacy submodule examples は migration reference として残存 |
| 6 | Git サブモジュールの依存関係を削除 | **済** | 100 | 利用側主要プロジェクト (**9 リポ**) で Git Submodule removal 完了。runtime / CI dependency removal 完了。[README](../README.md) / `examples/` の legacy migration reference は historical compatibility のため残置 |

**集計**: 必須 **600 / 600 → 100%** (6 済)。

#### 推奨

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| 1 | Xcode Common Specs 受け入れテスト | **済** | 100 | フェーズ1 #12 — WordPress Plugin Spec、Xcode Common Specs (**2** リポジトリ)。npm 化・`tools/docs-linter` 削除済 |
| 2 | マイグレーションガイドの完成 | **済** | 100 | [npm_usage.md](./npm_usage.md) に migration guide 記載 (`lint:docs` / VSCode / GitHub Actions)。利用側 **9 リポ** で migration 実施済。Git Submodule → npm 置換実績あり |
| 3 | VSCode 設定例の完成 | **済** | 100 | [npm_usage.md](./npm_usage.md) に VSCode migration before/after。利用側 **9 リポ** で npm package ベース設定へ移行済。canonical: `.vscode/settings.json` — `textlint.configPath=./.textlintrc.json`, `textlint.nodePath=./node_modules`, `textlint.autoFixOnSave`, `source.fixAll.textlint`。`.textlintrc.json` — `@s2j/docs-linter` preset `extends` |

**備考 (推奨 #2–3)**: README トップの npm 主導線 flip は UX 向上項目 (完了条件外)。VSCode 設定は実利用ベースで標準設定として定着。

**集計**: 推奨 **300 / 300 → 100%** (3 済)。

#### 対象外

* 従来の Git サブモジュールの永久維持
* 自動 codemod
* マイグレーションツール

### フェーズ3で完了した項目

* **必須 #1–2**: 利用側 **9 リポジトリ** npm 化・`tools/docs-linter` 削除済 (Swift **3** / WordPress **4** / 仕様ドキュメント **2**)
* **必須 #3–4**: `@s2j/docs-linter` install / `npx s2j-docs-linter` 運用確認済
* **必須 #5**: npm package ベース GHA workflow で docs lint 成功。利用側 migration 実績あり。[examples/lint-docs*.yml](../examples/lint-docs.yml) に npm workflow 記載 (legacy submodule examples は migration reference)
* **必須 #6**: 利用側 **9/9** で Submodule / runtime / CI 依存削除済。[README](../README.md)「レガシー移行リファレンス (Git サブモジュール)」で非推奨明示。`examples/` legacy は historical reference
* **推奨 #1**: WordPress Plugin Spec、Xcode Common Specs 受入試験済
* **推奨 #2**: [npm_usage.md](./npm_usage.md) migration guide 完成 — 利用側 **9 リポ** 実施済
* **推奨 #3**: VSCode canonical 設定 — 利用側 **9 リポ** で `@s2j/docs-linter` preset `extends` 定着

### フェーズ3で完了した主な変更 (コード・文書)

| 対象 | 内容 | 関連 |
| --- | --- | --- |
| (運用) 利用側 **9 リポジトリ** | npm 化・`tools/docs-linter` 削除・GHA docs lint 成功・canonical VSCode / `.textlintrc.json` 定着 | 必須 #1–2, #5–6 / 推奨 #3 |
| [README.md](../README.md) | 「レガシー移行リファレンス (Git サブモジュール)」追加 — Submodule 非推奨明示 | 必須 #6 |
| [examples/lint-docs*.yml](../examples/lint-docs.yml) | npm workflow 手順 + legacy Submodule reference 併記 | 必須 #5 |
| [npm_usage.md](./npm_usage.md) | `lint:docs` / VSCode / CI 移行ガイド | 推奨 #2–3 |

### フェーズ3の残タスク

**なし** — フェーズ3必須条件 #1–6 および推奨条件 #1–3 はすべて **済** (2026-05-25)。

### フェーズ4: サマリー

フェーズ4では、S2J Docs Linter の **OSS パッケージとしての成熟化・安定運用** を対象とします。

フェーズ3完了後、フェーズ4ではエコシステム / 品質 / 保守性を強化します。

| 項目 | 状態 |
| --- | --- |
| **フェーズ4 必須完了条件** | **100%** — 5 項目中 **5 済** |
| **フェーズ4 推奨完了条件** | **100%** — 5 項目中 **5 済** |
| **本リポジトリ実装 (フェーズ4)** | **100%** (必須 + 推奨) |
| **CHANGELOG** | **済** — `1.0.10`–`1.0.13` 記載、リリース手順に組み込み (必須 #2) |
| **SemVer / メンテナンス方針** | **済** — [versioning_policy.md](./versioning_policy.md) (必須 #1)、[maintenance_policy.md](./maintenance_policy.md) (必須 #5) |
| **Dependabot** | **済** — npm + github-actions、weekly (必須 #3) |
| **Node matrix CI** | **済** — [ci.yml](../.github/workflows/ci.yml) Node 20/22/24 (必須 #4) |
| **Issue テンプレート** | **済** — [bug_report.md](../.github/ISSUE_TEMPLATE/bug_report.md) / [feature_request.md](../.github/ISSUE_TEMPLATE/feature_request.md) / [config.yml](../.github/ISSUE_TEMPLATE/config.yml) (推奨 #3) |
| **CONTRIBUTING** | **済** — setup / workflow / 検証 / 互換 / CI 等 (~341 行、日英)。[README.md](../README.md) Contributing から導線 (推奨 #4) |
| **ロードマップ** | **済** — 本ページ (フェーズ1–4 進捗) + [specs.md](./specs.md#プロジェクトのロードマップ) + [README.md](../README.md#ロードマップ) (推奨 #5) |
| **GitHub リリースノート** | **済** — [npm-publish.yml](../.github/workflows/npm-publish.yml) `Create GitHub Release` + [release.md](./release.md#8-github-リリースノート) (推奨 #2) |
| **セマンティック・リリース評価** | **済** — [semantic_release_evaluation.md](./semantic_release_evaluation.md) — 結論: **現時点では非採用** (推奨 #1) |
| **CLI `init` コマンド (P2)** | **済** — [cli_tooling_spec.md](./cli_tooling_spec.md) · `dist/bin/cli.js` · `npm run test:init` (INIT-001〜012) · GHA [ci.yml](../.github/workflows/ci.yml) |
| **CLI `doctor` コマンド (P2)** | **未** — 仕様 **済** · 実装スタブ · テスト仕様 **未** |
| 前提 | フェーズ3 **済** (2026-05-25) |

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
| 必須完了条件 | #1–5 の実装％合計 **500** / 500 | **100%** |
| 推奨完了条件 | #1–5 の実装％合計 **500** / 500 | **100%** |
| フェーズ4 全体 (必須 + 推奨) | **1000** / 1000 | **100%** |
| 優先タスク P0–P2 | (100 + 100 + 100 + 100 + 77) / 5 | **95%** |

**フェーズ4 必須クローズ**: **済** (2026-05-25)。

**フェーズ4クローズ**: **達成** (2026-05-26) — 必須 **5/5** + 推奨 **5/5** **済**。

### フェーズ4: 優先タスクと完了条件の対比

| 優先 | タスク | 完了条件 | 状態 | 実装％ |
|------|--------|----------|------|------:|
| P0 | リリースガバナンス | SemVer 準拠の確立 | **済** ([versioning_policy.md](./versioning_policy.md)) | 100 |
| P0 | 変更履歴の管理 | リリース履歴の可視化 | **済** ([CHANGELOG.md](../CHANGELOG.md) Git 管理 + [release.md](./release.md#3-changelog-更新)) | 100 |
| P1 | CI の強化 | マトリックス / 互換性の検証 | **済** ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml) Node 20/22/24) | 100 |
| P1 | 依存関係のメンテナンス | 依存関係の健全性維持 | **済** ([`.github/dependabot.yml`](../.github/dependabot.yml)) | 100 |
| P2 | エコシステムの拡張 | 追加のプリセット / ツール | **部分実施** | 77 |

**P2 内訳 (CLI ツール)** — 仕様 [cli_tooling_spec.md](./cli_tooling_spec.md)

| コマンド (仕様見出し) | 完了条件 (要約) | 状態 | 実装％ |
| --- | --- | --- | ---: |
| [CLI コマンド - init](./cli_tooling_spec.md#cli-コマンド---init) | 実行モード (通常 / Dry Run / `--output`) · 引数 (`--preset` / `--force` 等) · 3 ファイル + `lint:docs` 生成 · 上書きポリシー · サブコマンドルーター (`cli.js`) | **済** | 100 |
| [CLI コマンド - init テスト仕様](./cli_tooling_spec.md#cli-コマンド---init-テスト仕様) | INIT-001〜012 · `scripts/test-init.sh` · GHA 再現 · `.sandbox/` 検証 | **済** | 100 |
| [CLI コマンド - doctor](./cli_tooling_spec.md#cli-コマンド---doctor-コマンド) | 9 項目診断 · PASS / WARN / FAIL 出力 · テスト仕様 · 本実装 | **未** | 30 |

**P2 実装％の算出**: `init` (100) + `init` テスト (100) + `doctor` (30) → **230 / 300 ≒ 77%** (CLI ツール 3 区分)。`init` 単体 (仕様 + 実装 + テスト) は **100%**。

#### CLI コマンド - init (完了条件)

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| I1 | 仕様書 ([cli_tooling_spec.md](./cli_tooling_spec.md#cli-コマンド---init)) | **済** | 100 | 実行モード · 引数 · 生成ファイル · 上書きポリシー |
| I2 | 通常モード (`init` / `--preset` / `--force`) | **済** | 100 | `.textlintrc.json` · VSCode · GHA ワークフロー · `package.json` `lint:docs` |
| I3 | Dry Run モード (`--dry-run`) | **済** | 100 | `[Dry Run]` / `Would create` / `Would skip` · ファイル変更なし |
| I4 | ディレクトリ出力モード (`--output`) | **済** | 100 | `.sandbox/{base,swift,wordpress}/` 配下生成 |
| I5 | 引数組み合わせ制約 | **済** | 100 | `--dry-run` + `--output`/`--force` → exit 1 (INIT-009〜011) |
| I6 | CLI エントリポイント (`bin` → `cli.js`) | **済** | 100 | `init` / lint (デフォルト) ルーティング |
| I7 | 自動テスト (INIT-001〜012) | **済** | 100 | `npm run test:init` · [scripts/test-init.sh](../scripts/test-init.sh) |
| I8 | GitHub Actions 統合 | **済** | 100 | [ci.yml](../.github/workflows/ci.yml) `Test init command` ステップ |

**集計**: init **800 / 800 → 100%** (8 済)。

#### CLI コマンド - doctor (完了条件)

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| D1 | 仕様書 ([cli_tooling_spec.md](./cli_tooling_spec.md#cli-コマンド---doctor-コマンド)) | **済** | 100 | 診断範囲 · PASS / WARN / FAIL 出力ポリシー |
| D2 | `doctor` 本実装 (9 項目チェック) | **未** | 0 | Node / npm / textlint / preset / VSCode / GHA 等 |
| D3 | `doctor` テスト仕様 | **未** | 0 | 仕様書にテストセクション **未作成** |
| D4 | ルーター統合 | **部分** | 20 | [cli.ts](../src/bin/cli.ts) スタブ (`exit 1`) |

**集計**: doctor **120 / 400 → 30%** (仕様 **済** · 実装・テスト **未**)。

**P2 残タスク**: `doctor` 本実装 · `doctor` テスト仕様 · README / [npm_usage.md](./npm_usage.md) の `init` 導線更新 (仕様 [ドキュメントの同期](./cli_tooling_spec.md#ドキュメントの同期))。

### フェーズ4: 完了条件

以下をすべて満たした場合、フェーズ4完了とする。

#### 必須

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| 1 | SemVer ガバナンスの文書化 | **済** | 100 | [versioning_policy.md](./versioning_policy.md) |
| 2 | CHANGELOG.md 運用開始 | **済** | 100 | [CHANGELOG.md](../CHANGELOG.md) に `1.0.10`–`1.0.13` 記載。Git 管理。[release.md](./release.md#3-changelog-更新) に更新手順 |
| 3 | 依存関係レビューのワークフロー | **済** | 100 | [`.github/dependabot.yml`](../.github/dependabot.yml) — npm / github-actions、weekly |
| 4 | Node バージョンの互換性 CI | **済** | 100 | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — matrix Node 20/22/24、`pack:check` / `verify:tarball`。publish は [npm-publish.yml](../.github/workflows/npm-publish.yml) Node 24 |
| 5 | npm パッケージのメンテナンス方針の文書化 | **済** | 100 | [maintenance_policy.md](./maintenance_policy.md) |

**集計**: 必須 **500 / 500 → 100%** (5 済)。

#### 推奨

| # | 完了条件 | 状態 | 実装％ | 検証方法 |
| ---: | --- | --- | ---: | --- |
| 1 | セマンティック・リリースの評価 | **済** | 100 | [semantic_release_evaluation.md](./semantic_release_evaluation.md) — 結論: **現時点では非採用** |
| 2 | 自動生成されるリリースノート | **済** | 100 | [npm-publish.yml](../.github/workflows/npm-publish.yml) — `Create GitHub Release` (`softprops/action-gh-release@v2`、`generate_release_notes: true`)。[release.md](./release.md#8-github-リリースノート) ※次回 tag push で GHA 運用検証 |
| 3 | 課題テンプレート | **済** | 100 | [bug_report.md](../.github/ISSUE_TEMPLATE/bug_report.md)、[feature_request.md](../.github/ISSUE_TEMPLATE/feature_request.md)、[config.yml](../.github/ISSUE_TEMPLATE/config.yml) — `blank_issues_enabled: false`、README / CONTRIBUTING への contact_links |
| 4 | 貢献ガイド | **済** | 100 | [CONTRIBUTING.md](../CONTRIBUTING.md) — Goals / Setup / Workflow / Verification / Versioning / Docs / Compatibility / CI / PR scope / Issues 等 (日英)。[README.md](../README.md) Contributing セクションから導線 |
| 5 | ロードマップの可視化 | **済** | 100 | 本ページ ([status.md](./status.md)) — フェーズ1–4 進捗・完了条件。[specs.md](./specs.md#プロジェクトのロードマップ) — ロードマップ導線・フェーズ概要。[README.md](../README.md#ロードマップ) — status / ガバナンス ([maintenance_policy.md](./maintenance_policy.md)、[versioning_policy.md](./versioning_policy.md)) 導線 |

**集計**: 推奨 **500 / 500 → 100%** (5 済)。

#### 対象外

* 商用サポート
* 有償配布
* エンタープライズ SLA

### フェーズ4で完了した項目

* **必須 #1**: [versioning_policy.md](./versioning_policy.md) — SemVer ガバナンス (MAJOR/MINOR/PATCH、破壊的変更、非推奨、タグ規約)
* **必須 #2**: [CHANGELOG.md](../CHANGELOG.md) 運用開始 — `1.0.10`–`1.0.13` 履歴記載、Git 管理、[release.md](./release.md#3-changelog-更新)・[バージョン更新と tag push](./release.md#4-バージョン更新と-tag-push-本番-publish) に更新・リリース連携手順
* **必須 #3**: [`.github/dependabot.yml`](../.github/dependabot.yml) — npm / github-actions 依存関係の weekly レビュー
* **必須 #4**: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — Node 20/22/24 matrix、`pack:check` / `verify:tarball`
* **必須 #5**: [maintenance_policy.md](./maintenance_policy.md) — npm パッケージのメンテナンス方針 (リリース、CI、依存関係、セキュリティ、ドキュメント保守)
* **推奨 #1**: [semantic_release_evaluation.md](./semantic_release_evaluation.md) — セマンティック・リリース採用可否評価
    * 結論は、**現時点では非採用** (手動 SemVer + GHA OIDC publish を継続)
* **推奨 #2**: [npm-publish.yml](../.github/workflows/npm-publish.yml) — tag publish 後 `Create GitHub Release` (`generate_release_notes: true`)。[release.md](./release.md#8-github-リリースノート)
* **推奨 #3**: [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/) — [bug_report.md](../.github/ISSUE_TEMPLATE/bug_report.md) (環境・再現手順・設定・期待/実際)、[feature_request.md](../.github/ISSUE_TEMPLATE/feature_request.md) (問題・提案・互換影響・スコープ)、[config.yml](../.github/ISSUE_TEMPLATE/config.yml) (`blank_issues_enabled: false`、README / CONTRIBUTING contact_links)。[CONTRIBUTING.md](../CONTRIBUTING.md) Issue Reports と整合
* **推奨 #4**: [CONTRIBUTING.md](../CONTRIBUTING.md) — 貢献ガイド (Goals / Setup / Workflow / Verification / Versioning / Docs / Compatibility / CI / PR scope / Issues 等、日英 ~341 行)。[README.md](../README.md) Contributing から導線
* **推奨 #5**: ロードマップ可視化 — 本ページ (フェーズ1–4 進捗・完了条件)、[specs.md](./specs.md#プロジェクトのロードマップ) (status 導線・フェーズ概要)、[README.md](../README.md#ロードマップ) (status / ガバナンス導線)
* **P2 / CLI `init`**: [cli_tooling_spec.md](./cli_tooling_spec.md) 仕様 · [src/bin/init.ts](../src/bin/init.ts) · [src/bin/cli.ts](../src/bin/cli.ts) ルーター · [scripts/test-init.sh](../scripts/test-init.sh) · `npm run test:init` (INIT-001〜012) · [ci.yml](../.github/workflows/ci.yml) GHA 統合

### フェーズ4で完了した主な変更 (コード・文書)

| 対象 | 内容 | 関連 |
| --- | --- | --- |
| [CHANGELOG.md](../CHANGELOG.md) | npm 公開版の変更履歴 (`1.0.10`–`1.0.13`)、Git 管理 | 必須 #2 |
| [release.md](./release.md) | [CHANGELOG 更新](./release.md#3-changelog-更新)、[バージョン更新と tag push](./release.md#4-バージョン更新と-tag-push-本番-publish)、[GitHub リリースノート](./release.md#8-github-リリースノート) | 必須 #2 / 推奨 #2 |
| [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml) | OIDC publish + `pack:check` / `verify:tarball` / artifact / `Create GitHub Release` (`generate_release_notes: true`) | フェーズ2 **済** / 推奨 #2 |
| [versioning_policy.md](./versioning_policy.md) | SemVer 方針 (増分基準、破壊的変更、タグ規約) | 必須 #1 |
| [maintenance_policy.md](./maintenance_policy.md) | メンテナンス方針 (リリース、CI、依存、セキュリティ) | 必須 #5 |
| [`.github/dependabot.yml`](../.github/dependabot.yml) | npm / github-actions、weekly スケジュール | 必須 #3 |
| [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | Node 20/22/24 matrix CI | 必須 #4 |
| [README.md](../README.md) | Contributing セクション → [CONTRIBUTING.md](../CONTRIBUTING.md) 導線 | 推奨 #4 |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | 貢献ガイド (setup / workflow / 検証 / 互換 / CI) | 推奨 #4 |
| [`.github/ISSUE_TEMPLATE/bug_report.md`](../.github/ISSUE_TEMPLATE/bug_report.md) | Bug 報告テンプレ (環境・再現・設定・期待/実際) | 推奨 #3 |
| [`.github/ISSUE_TEMPLATE/feature_request.md`](../.github/ISSUE_TEMPLATE/feature_request.md) | Feature 提案テンプレ (問題・提案・互換影響・スコープ) | 推奨 #3 |
| [`.github/ISSUE_TEMPLATE/config.yml`](../.github/ISSUE_TEMPLATE/config.yml) | テンプレ選択 UI — contact_links、blank issue 無効 | 推奨 #3 |
| [specs.md](./specs.md) | 「プロジェクトのロードマップ」— status 導線・フェーズ1–4 概要 | 推奨 #5 |
| [README.md](../README.md) | 「ロードマップ」— status / ガバナンス (maintenance / versioning) 導線 | 推奨 #5 |
| [semantic_release_evaluation.md](./semantic_release_evaluation.md) | セマンティック・リリース採用可否評価 — 結論: **現時点では非採用** | 推奨 #1 |
| [cli_tooling_spec.md](./cli_tooling_spec.md) | CLI ツール仕様 — `init` / `init` テスト仕様 / `doctor` | P2 |
| [src/bin/cli.ts](../src/bin/cli.ts) | サブコマンドルーター (`init` / `doctor` スタブ / lint) · `bin` → `dist/bin/cli.js` | P2 / I6 |
| [src/bin/init.ts](../src/bin/init.ts) | `init` — 通常 / Dry Run / `--output` · `--preset` / `--force` · 3 ファイル + `lint:docs` | P2 / I1–I5 |
| [src/templates/](../src/templates/) · [copy-templates.ts](../src/scripts/copy-templates.ts) | VSCode · GHA テンプレート · ビルド時 `dist/templates/` コピー | P2 |
| [scripts/test-init.sh](../scripts/test-init.sh) | INIT-001〜012 自動テスト | P2 / I7 |
| [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | `Test init command` ステップ追加 | P2 / I8 |
| `package.json` | `test:init` script · `bin` / `main` → `dist/bin/cli.js` | P2 |

### フェーズ4の残タスク

**必須 / 推奨** — フェーズ4必須条件 #1–5 および推奨条件 #1–5 はすべて **済** (2026-05-26)。

**P2 (CLI ツール)** — `init` **済** · `doctor` **未**:

| タスク | 優先度 | 実装％ | 完了条件 |
| --- | --- | ---: | --- |
| `doctor` コマンド本実装 | P2 | 0 | [CLI コマンド - doctor](./cli_tooling_spec.md#cli-コマンド---doctor-コマンド) 9 項目 · PASS / WARN / FAIL |
| `doctor` テスト仕様・自動テスト | P2 | 0 | `init` テスト仕様と同様の構成 (未作成) |
| README / npm_usage の `init` 導線 | P2 | 0 | [cli_tooling_spec.md](./cli_tooling_spec.md#ドキュメントの同期) |

### 補足

* **公開 API**:
    * `presets/{base,swift,wordpress}/` 配下パス、root 互換 `base/` `swift/` `wordpress/`、CLI 名、`extends` 用相対パスは互換契約 ([現在の利用状況の分析](./npm_package_spec.md#現在の利用状況の分析))。
* **ビルド**:
    * `npm run build` = `tsc -p tsconfig.build.json` + `copy-templates` + `setup-npmignore` + `link-preset-layout-compat` (root ミラー生成)。`prepare` は `npm run build` を呼ぶ。
* **CLI ツール (P2)**:
    * エントリポイント … `dist/bin/cli.js` (`init` / `doctor` / lint)。
    * `init` … `npm run test:init` (INIT-001〜012)。GHA [ci.yml](../.github/workflows/ci.yml) で再現。
    * `doctor` … スタブのみ。テスト仕様 **未**。
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
    * **CI matrix** ([ci.yml](../.github/workflows/ci.yml)): `push` / `pull_request`、Node 20/22/24、`npm ci` → `pack:check` → `verify:tarball` → `test:init` (フェーズ4 必須 #4 **済** / P2 **init 済**)。
    * **Dependabot** ([dependabot.yml](../.github/dependabot.yml)): npm / github-actions、weekly (フェーズ4 必須 #3 **済**)。
    * **Issue テンプレート** ([`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/)): Bug / Feature テンプレ + `config.yml` (`blank_issues_enabled: false`、README / CONTRIBUTING contact_links) — 推奨 #3 **済**。
    * **ロードマップ** ([status.md](./status.md) · [specs.md](./specs.md#プロジェクトのロードマップ) · [README.md](../README.md#ロードマップ)): フェーズ1–4 進捗・完了条件、フェーズ概要、ガバナンス ([maintenance_policy.md](./maintenance_policy.md) / [versioning_policy.md](./versioning_policy.md)) 導線 — 推奨 #5 **済**。
    * **GitHub リリースノート** ([npm-publish.yml](../.github/workflows/npm-publish.yml) · [release.md](./release.md#8-github-リリースノート)): tag publish 後 `Create GitHub Release` (`generate_release_notes: true`) — 推奨 #2 **済**。
    * **Trusted Publishing (OIDC)** 運用中 ([npm-publish.yml](../.github/workflows/npm-publish.yml))。`permissions.id-token: write`、Node 24、npm 11.6+、`setup-node` に `registry-url` を設定しない (OIDC 競合回避)。
    * npm Trusted Publisher: GitHub Actions / `stein2nd` / `docs-linter` / `npm-publish.yml`。
    * GitHub Secret `NPM_TOKEN` … **未登録・不使用**。
    * 初回 GHA OIDC publish: `v1.0.13` → run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088) (2026-05-25)。
* **npm publish / 受け入れ試験**:
    * レジストリ最新 … **`@s2j/docs-linter@1.0.13`** (`npm view` 確認済、2026-05-25)
    * GHA OIDC publish … **`1.0.13`** / 手動 publish … **`1.0.10`–`1.0.12`**
    * 受け入れ (#12) / フェーズ3 #1–2 … **9 リポジトリ** npm 化・`tools/docs-linter` 削除済
    * フェーズ3 #5 … GHA docs lint **済** (npm workflow + 利用側 **9 リポ** 実績)
    * フェーズ3 #6 … Submodule 依存削除 **済** ([README](../README.md) legacy 非推奨 + 利用側 **9 リポ**)
* **フェーズ3 / 4**:
    * フェーズ3 … **クローズ** — 必須 **100%** (#1–6) + 推奨 **100%** (#1–3), 2026-05-25
    * フェーズ3 推奨 #2–3 … migration guide / VSCode canonical 設定 — 利用側 **9 リポ** 定着済
    * フェーズ4 … **クローズ** — 必須 **100%** (5/5 済) + 推奨 **100%** (5/5 済) / 全体 **100%** (1000/1000), 2026-05-26
    * フェーズ4 推奨 #1 … [semantic_release_evaluation.md](./semantic_release_evaluation.md) **済**
        * 結論は、**現時点では非採用**
    * フェーズ4 推奨 #2 … GitHub Release 自動作成 (`generate_release_notes: true`) **済**
    * フェーズ4 推奨 #3 … [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/) (bug / feature / config) **済**
    * フェーズ4 推奨 #4 … [CONTRIBUTING.md](../CONTRIBUTING.md) + [README.md](../README.md) Contributing 導線 **済**
    * フェーズ4 推奨 #5 … ロードマップ **済** — [status.md](./status.md) · [specs.md](./specs.md#プロジェクトのロードマップ) · [README.md](../README.md#ロードマップ)
* **ローカル検証の一式**:
    * 下記コマンドを利用する。

```bash
npm run verify:tarball
npm run test:init
npm view @s2j/docs-linter version  # => 1.0.13
npm run lint
```

* **GHA リリース手順** (以降の semver) — [versioning_policy.md](./versioning_policy.md) / [release.md](./release.md) ([CHANGELOG 更新](./release.md#3-changelog-更新) · [バージョン更新と tag push](./release.md#4-バージョン更新と-tag-push-本番-publish)):

```bash
# CHANGELOG.md 更新 + package.json version を更新 → main に merge
git tag vX.Y.Z && git push origin vX.Y.Z
gh run watch
npm view @s2j/docs-linter version
```
