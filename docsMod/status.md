## S2J Docs Linter - 実装状況

本ページは、[npm パッケージ仕様](./npm_package_spec.md) にもとづく実装修正の進捗を一覧化します。仕様書の [フェーズ1実装状況](./npm_package_spec.md#フェーズ1実装状況-2026-05) と相互参照します。

**移行フェーズ**は [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) に従い、現時点は **フェーズ1** (Git Submodule と npm パッケージの併存) です。

最終更新 …2026-05-16 (`@s2j/docs-linter@1.0.10`、仕様書フェーズ1反映済み)

### 仕様書 (参照元)

| ドキュメント | 内容 |
| --- | --- |
| [npm パッケージ仕様](./npm_package_spec.md) | npm 配布、CLI、互換、移行の全体仕様 (フェーズ1の実装内容を反映済み) |
| [npm 使い方ガイド](./npm_usage.md) | 利用側プロジェクト向け手順 |
| [仕様書の起点](./specs.md) | 上記への導線 |

### フェーズ1: サマリー

仕様書 [概要](./npm_package_spec.md#概要) の表と一致させています。

| 項目 | 状態 |
| --- | --- |
| 移行フェーズ | **フェーズ1** 進行中 (併存) |
| npm パッケージ名 | `@s2j/docs-linter` (`package.json` 反映済み) |
| 正式 CLI | `s2j-docs-linter` (互換: `docs-lint`) |
| プリセットレイアウト | `presets/{base,swift,wordpress}/` を維持 (互換要件どおり) |
| tarball (`npm pack`) | **済** — `presets/`・`dist/`・`scripts/` 等を同梱 |
| npm レジストリ公開 | **未実施** — publish ワークフロー・初回 `npm publish` 待ち |

| 区分 (仕様書) | フェーズ1の状態 |
| --- | --- |
| 実装済み | `@s2j/docs-linter` メタデータ、`s2j-docs-linter` CLI (互換 `docs-lint`)、`presets/` の tarball 同梱、実行時 `dependencies` 移行、README の npm 手順 (併記)、**仕様書へのフェーズ1反映** |
| 未実施 | npm レジストリ初回 publish、`.github/workflows/npm-publish.yml`、`examples/` の npm 版、README の Submodule → レガシー化 (フェーズ2以降) |

### npm 配布: フェーズ1実装範囲

仕様 [npm 配布のための実装修正](./npm_package_spec.md#npm-配布のための実装修正) の責務表に対応します。

| 責務項目 | フェーズ1 |
| --- | --- |
| `package.json` の修正 | 済 |
| CLI コマンドの公開 | 済 (`s2j-docs-linter` / 互換 `docs-lint`) |
| npm publish に対応する tarball 構成 | 済 (`npm pack` で `presets/` 同梱を確認) |
| README の更新 | **一部** — Submodule 主導線のまま、npm を方法2として追記・更新 |
| GitHub Actions publish ワークフロー | 未 |
| `examples/` の npm 版 | 未 |

### 機能一覧 (実装状況サマリー)

| 機能名 (仕様セクション) | 実装済み/未実装 | 実装％ | 備考 |
| --- | --- | ---: | --- |
| [npm パッケージ仕様](./npm_package_spec.md) (フェーズ1の文書反映) | 実装済み | 100 | コード実装に合わせメタデータ、`files`、CLI 契約、互換、README 移行 (フェーズ分離)、Publishing 注記等を仕様書に反映済み。 |
| [`package.json` メタデータ更新](./npm_package_spec.md#packagejson-メタデータ更新) | 実装済み | 100 | `name` / `1.0.10` / `GPL-2.0-or-later` / `homepage#readme` / `git+` repository URL。 |
| [CLI Entrypoint 公開](./npm_package_spec.md#cli-entrypoint-公開) | 実装済み | 100 | `bin`・`main` → `dist/bin/run-textlint.js`。CLI 契約 (`--profile`、引数、WP デフォルト) を仕様に明記。 |
| [ファイルスコープの最適化 (Publish)](./npm_package_spec.md#ファイルスコープの最適化を-publish) | 実装済み | 100 | `presets/` 配下を維持 (root 直下 `base/` 等への再配置は行わない)。 |
| [CLI 互換レイヤ](./npm_package_spec.md#cli-互換レイヤ) / [互換性に関する要件](./npm_package_spec.md#互換性に関する要件) | 実装済み | 100 | パッケージ root 基準の config 解決、ユーザー設定優先、未設定時 WordPress、`NODE_PATH` 拡張。 |
| [依存関係レビュー](./npm_package_spec.md#依存関係レビュー) | 実装済み | 100 | 実行時パッケージを `dependencies` へ移行済み。 |
| [Publishing](./npm_package_spec.md#publishing) | 一部 | 50 | tarball 整備済み。初回 publish、tag 連動は未実施。 |
| [互換性に関する、移行戦略](./npm_package_spec.md#互換性に関する移行戦略) (フェーズ1) | 実装済み | 90 | 本リポジトリの併存基盤は整備済み。利用側 VSCode / CI の書き換えは各プロジェクトの作業。 |
| [README 移行](./npm_package_spec.md#readme-移行) | フェーズ1済 | 100 | **フェーズ1範囲**: 仕様、README とも Submodule 主と npm を併記。フェーズ2以降の全面 npm 化は未。 |
| [本リポジトリ `package.json` の `scripts`](./npm_package_spec.md#本リポジトリ-packagejson-の-scripts-サブモジュールから-npm-への転換) | 一部未実装 | 40 | `lint` 系は `npx textlint` のまま。`s2j-docs-linter` への統一は任意の残タスク。 |
| [移行のワークフロー例](./npm_package_spec.md#移行のワークフロー例) | 未実装 | 0 | `examples/lint-docs*.yml` は Submodule 前提の記述が残存。 |
| [GitHub Actions Publish ワークフロー](./npm_package_spec.md#github-actions-publish-ワークフロー) | 未実装 | 0 | `.github/workflows/npm-publish.yml` 未作成。 |
| [npm 使い方ガイド](./npm_usage.md) との整合 | 一部 | 85 | `@s2j/docs-linter` / `s2j-docs-linter` 表記は整合。`scripts`・`examples` との完全統一は未。 |
| [VSCode 互換戦略](./npm_package_spec.md#vscode-互換戦略) | ガイドのみ | — | 利用側設定パス。本リポジトリのコード変更対象外。 |
| [CI 互換戦略](./npm_package_spec.md#ci-互換戦略) | ガイドのみ | — | 利用側 `prelint` / Submodule `postinstall` 削除は各プロジェクトの移行。 |
| [バージョン管理ポリシー](./npm_package_spec.md#バージョン管理ポリシー) | 方針のみ | — | semver 方針。運用は publish 開始後。 |
| [移行戦略 - 非推奨化ポリシー](./npm_package_spec.md#移行戦略---非推奨化ポリシー) フェーズ2〜4 | 未着手 | 0 | フェーズ2: README デフォルト npm 化。フェーズ3: Submodule 非推奨。フェーズ4: レガシー削除。 |

### フェーズ1で完了した項目

仕様 [非推奨化ポリシー - フェーズ1で完了した項目](./npm_package_spec.md#フェーズ1で完了した項目) と一致します。

* `@s2j/docs-linter` としての `package.json` メタデータ
* CLI `s2j-docs-linter` (互換 `docs-lint`)
* `presets/` レイアウトの維持と tarball 同梱
* 実行時 `dependencies` への移行
* README への npm 手順の併記 (Submodule は引き続き主導線)
* **npm パッケージ仕様** へのフェーズ1実装内容の反映

### フェーズ1で完了した主な変更 (コード・文書)

| 対象 | 内容 |
| --- | --- |
| `src/bin/run-textlint.ts` | パッケージ root 基準の preset 解決、`--profile`、lint 対象の CLI 引数、設定フォールバック (未設定時 WP)、`NODE_PATH` 拡張 |
| `package.json` | `@s2j/docs-linter`、`files` に `presets/`・`scripts/`、`bin` 二系統、`dependencies` 整理 |
| `README.md` | 方法2 (npm) を `@s2j/docs-linter` / `s2j-docs-linter` に更新 (方法1「Submodule」は維持) |
| `docsMod/npm_package_spec.md` | フェーズ1実装状況、CLI 契約、`files`、互換、README フェーズ分離、Publishing 注記等を実装に同期 |

### フェーズ1の残タスク (本リポジトリ)

仕様 [フェーズ1の残タスク](./npm_package_spec.md#フェーズ1の残タスク-本リポジトリ) と一致します。

1. `.github/workflows/npm-publish.yml` の追加と npmjs への初回 `npm publish`
2. `examples/lint-docs*.yml` の `npx s2j-docs-linter` 併記 (または npm 版サンプル追加)
3. 本リポジトリ `lint` / `lint:wp` / `lint:swift` を `s2j-docs-linter` に寄せる (任意)
4. `npm pack` 後の利用側プロジェクトでの受け入れ試験 (Submodule 併存のまま)

### 補足

* **公開 API**: `presets/{base,swift,wordpress}/` 配下パス、CLI 名、`extends` 用相対パスは互換契約 ([現在の利用状況の分析](./npm_package_spec.md#現在の利用状況の分析))。
* **ビルド**: `dist/bin/run-textlint.js` は `npm run build` (`prepare` 経由) で生成。
* **postinstall**: `scripts/patch-wp-prh-colon-quote.cjs` は tarball の `scripts/` 経由で同梱。
