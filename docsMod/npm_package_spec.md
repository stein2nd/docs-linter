# S2J Docs Linter - npm パッケージ仕様

## 概要

本ドキュメントは、Docs Linter を Git サブモジュール型の共有 lint モジュールから、npm レジストリ (`npmjs.com`) 上で配布可能な npm パッケージ **`@s2j/docs-linter`** として再設計するための仕様を定義します。

S2J Docs Linter の npm パッケージ化に際しては、既存利用プロジェクトへの影響を最小化することを最優先とします。現時点で利用プロジェクトは、Docs Linter を単なる lint 設定パッケージとしてではなく、Git Submodule 経由の shared ツールワークスペースとして利用しています。

そのため、即時に Git Submodule モデルを完全廃止することは推奨しません。

### フェーズ1実装状況 (2026-05)

フェーズ1では Git Submodule と npm パッケージの **併存** を目的とし、本リポジトリ側では npm 配布の基盤 (メタデータ、CLI、`files`、実行時依存) を整備済みです。進捗の一覧は [実装状況](./status.md) を参照してください。

| 区分 | フェーズ1の状態 |
| --- | --- |
| 実装済み | `@s2j/docs-linter` メタデータ、`s2j-docs-linter` CLI、`presets/` の tarball 同梱、実行時 `dependencies` 移行、README の npm 手順 (併記) |
| 未実施 | npm レジストリ初回 publish、README の Submodule → レガシー化 (フェーズ2以降) |
| 設計済み (運用はフェーズ2) | `.github/workflows/npm-publish.yml` ([フェーズ1優先タスク](#github-actions-publish-ワークフロー---フェーズ1優先タスク)) |

## 現在の利用状況の分析

### 概要

既存利用プロジェクトでは、以下の利用形態が確認されています。

#### WordPress プロジェクト

Git Submodule 内の各種ファイル/フォルダーに依存しています。

* root `.textlintrc.json`
* extends:
  `./tools/docs-linter/presets/base/.textlintrc.base.json`
* VSCode:
  `textlint.nodePath=./tools/docs-linter/node_modules`
* scripts:
  `git submodule update --remote`
* scripts:
  `NODE_PATH=./tools/docs-linter/node_modules`
* prelint build workflow

#### Swift プロジェクト

Git Submodule 内の各種ファイル/フォルダーに依存しています。

* VSCode:
  `./tools/docs-linter/presets/swift/.textlintrc.swift.json`
* scripts:
  `git submodule update --remote`
* scripts:
  `NODE_PATH=./tools/docs-linter/node_modules`
* prelint build workflow

### 評価

既存プロジェクトは、Docs Linter の内部ディレクトリ構造に依存しています。

これは public API とみなします。

## バージョン管理ポリシー

### 設計意図 (ゴール)

ユーザーが upgrade リスクを判断できるようにします。

### 設計原則

* 破壊的変更は、(major カウントアップとして) 明示すること。

### 設計方針 (規約)

セマンティック・バージョニングは、下記の通りとします。

* major
* minor
* patch

## Publishing

### 設計意図 (ゴール)

GitHub リポジトリから npm レジストリに自動 publish します。

### 設計方針 (規約)

publish コマンドは、下記とします。

```bash
npm publish --access public
```

GitHub Actions タグのトリガーは、下記とします。

```yaml
on:
  push:
    tags:
      - 'v*'
```

### 責務

publish ワークフローを提供すること。

### 非責務

手動による npm ログインの自動化。

### フェーズ1の状態

* tarball 構成 (`npm pack`) は、整備済み。
* `.github/workflows/npm-publish.yml` は、**追加済み** (フェーズ1では設計と雛形。registry への自動 publish 運用は、初回手動 publish 成功後のフェーズ2)。
* npm レジストリへの初回 publish は、**未実施** ([GitHub Actions Publish ワークフロー](#github-actions-publish-ワークフロー) 参照)。

## Publishing - フェーズ1優先タスク

### 設計意図 (ゴール)

S2J Docs Linter を npm registry (`npmjs.com`) 上の `@s2j/docs-linter` として publish 可能な状態にします。

フェーズ1では、GitHub Actions 自動 publish を前提とせず、ローカル環境から下記が成功することをゴールとします。

```bash
npm pack
npm publish --dry-run
npx s2j-docs-linter --help
```

### 設計原則

* まず package として成立させること。
* 自動化より先に、手動 publish を成功させること。
* 毎回同じ内容の tarball を生成できること。

### 設計方針 (規約)

以下を必須とします。

* `package.json.name = "@s2j/docs-linter"`
* `package.json.version` を定義
* `package.json.files` を定義
* `package.json.bin` を定義
* `LICENSE` を配置
* `README.md` を publish 対象に含める

### 非対象 (Out of Scope)

以下は、フェーズ1対象外です。

* GitHub Actions 自動 publish
* npm dist-tag 運用
* prerelease channel
* canary publish

### 責務

フェーズ1で対応すること。

* npm pack 成功
* npm publish --dry-run 成功
* tarball 内容検証

### 非責務

フェーズ1では対応しないこと。

* 自動 release note
* semantic-release
* provenance signing

## パッケージ戦略

### 設計意図 (ゴール)

* Docs Linter を、Git サブモジュール依存から脱却させる。
* GitHub Actions における CI 安定性を向上させる。
* npm レジストリによるバージョン管理を導入する。
* S2J ブランド配下の再利用可能な developer ツールとして整備する。
* Swift / WordPress / 汎用ドキュメント向け lint 基盤として再利用可能にする。

### 設計原則

* 配布方式は、Git clone ではなく、package manager を優先すること。
* GitHub Actions において、deterministic なインストールを可能にすること。
* S2J エコシステムのネーミング/パッケージングを統一すること。

### 設計方針 (規約)

* npm パッケージ名は、`@s2j/docs-linter` とする。
* npm レジストリは、`npmjs.com` を利用する。
* public パッケージとして公開する。
* semantic バージョニング (`semver`) を採用する。
* GitHub リポジトリを、source of truth とする。
* npm パッケージは、GitHub Actions により、publish 可能な構成とする。

### 非対象 (Out of Scope)

以下は、本仕様の対象外とします。

* GitHub Packages 配布
* プライベート npm パッケージ化
* pnpm / yarn 固有対応
* Docker イメージ配布
* Git サブモジュール方式の、完全な即時廃止

### 責務

`@s2j/docs-linter` は、以下を提供すること。

* 共通 textlint 設定
* Swift プリセット
* WordPress プリセット
* CLI entrypoint
* npm パッケージメタデータ
* publish ワークフロー

### 非責務

以下は、提供対象外。

* Node.js runtime 提供
* GitHub Actions ワークフロー強制提供
* IDE プラグイン提供
* Markdown フォーマッター

## パッケージ ネーミング

### 設計意図 (ゴール)

S2J エコシステム内で一意な、名前空間を確保します。

### 設計原則

* `@s2j/*` 名前空間に統一すること。
* CLI 名称は、人間可読性を優先すること。

### 設計方針 (規約)

パッケージ名称は、下記とします。

```json
{
  "name": "@s2j/docs-linter"
}
```

CLI コマンドは、下記とします。

```bash
s2j-docs-linter
```

ブランディングは、下記とします。

```text
S2J Docs Linter
```

### 責務

package.json は、下記とすること。

```json
{
  "bin": {
    "s2j-docs-linter": "dist/bin/run-textlint.js",
    "docs-lint": "dist/bin/run-textlint.js"
  },
  "main": "dist/bin/run-textlint.js"
}
```

* 正式 CLI: `s2j-docs-linter`。
* 互換 CLI (フェーズ1): `docs-lint` — 既存ドキュメント、スクリプト向け。フェーズ4で削除を検討する。

## パッケージ構成

### 設計方針 (規約)

想定構成は、下記とします。

```text
docs-linter/
├─ dist/
├─ docs/
├┬─ presets/
│├─ base/
│├─ swift/
│└─ wordpress/
├─ package.json
└─ README.md
```

### 設計原則

* publish 対象は、必要最小限とすること。

### 責務

files は、下記とすること。プリセットは **リポジトリ root 直下の `presets/` 配下** を維持し、`base/`、`swift/`、`wordpress/` を root 直下へ移動しない ([互換性に関する要件](#互換性に関する要件) 参照)。

```json
{
  "files": [
    "dist/",
    "presets/",
    "scripts/",
    "package.json",
    "README.md",
    "LICENSE"
  ]
}
```

* scripts/ — postinstall 時の WordPress PRH パッチ (scripts/patch-wp-prh-colon-quote.cjs) を同梱する。
* src/、examples/、docs/ 等は tarball に含めない。

## 本リポジトリ `package.json` の `scripts` (サブモジュールから npm への転換)

Git サブモジュール運用から npm モジュール運用へ移行するにあたり、**本リポジトリ** (S2J Docs Linter) の `package.json` に定義された `scripts` のうち、見直しが必要になり得るものと、現状のままでよいものを次に整理します。利用側プロジェクトの `scripts` や CI の書き換えは、[npm 使い方ガイド](./npm_usage.md) を参照します。

### 設計意図 (ゴール)

* 本パッケージの CI およびローカル検証が、公開 tarball、CLI、プリセット配置と整合すること。
* サブモジュール前提の実行パスやワークアラウンドに依存した検証から脱却すること。

### 設計原則

* 本リポジトリの `lint` 系 `scripts` は、ユーザーが実行する CLI、設定パスと **意味上矛盾しない** ように維持すること。
* npm パッケージと公式 CLI を正とし、`NODE_PATH` など **サブモジュール時代のワークアラウンド** は、新しい実行経路では可能な限り用いないこと。

### 修正の検討が必要になり得る `scripts`

| スクリプト名 | フェーズ1の状態 | 今後の見直し |
| --- | --- | --- |
| `lint` | **未変更** — `npx textlint` のまま | 公開 CLI `s2j-docs-linter` への統一を検討 (フェーズ1残タスク候補) |
| `lint:wp` | **未変更** — `./presets/wordpress/...` を直接参照 | プリセット配置は `presets/` 維持のためパス変更不要。`s2j-docs-linter` (デフォルト WP) への置換を検討 |
| `lint:swift` | **未変更** — `NODE_PATH=./node_modules` 付きで `textlint` 直実行 | CLI 経由へ寄せる場合は `s2j-docs-linter --profile swift` を検討 |

* フェーズ1では **プリセットのディレクトリ再配置 (`base/` 等を root 直下へ移すこと) は行わない**。
* 上記に伴い、**CLI の実装** (`dist/bin/run-textlint.js`) は、パッケージ root 基準で `presets/` を解決するよう **フェーズ1で更新済み** である ([CLI 互換レイヤ](#cli-互換レイヤ) 参照)。

### 転換後も原則として変更不要な `scripts`

次の `scripts` は、サブモジュールから npm への転換そのものとは独立し、原則として現行のまま維持してよい。

* `clean` / `build` / `dev` — ソースから `dist/` を生成するビルド用。
* `prepare` — `npm publish` や Git 由来の `npm install` におけるビルドおよび `setup-npmignore` の実行。
* `postinstall` — インストール後の補助処理 (利用側で `ignore-scripts` を使う場合は別問題であり、本仕様のスクリプト文字列の修正とは切り離して扱う)。
* `*:compat` — npm エンジン互換用。転換とは無関係。

## 本リポジトリ `package.json` の `scripts` - フェーズ1優先タスク

### 設計意図 (ゴール)

Git Submodule 時代の build ワークフローを npm package ワークフローに適合させます。

### 設計原則

* package ビルド entrypoint を scripts に統一すること。
* ローカルと CI の挙動を一致させること。

### 設計方針 (規約)

scripts を以下に整理します。

```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "build": "tsc && node dist/scripts/setup-npmignore.js",
    "prepare": "npm run build",
    "pack:check": "npm pack --dry-run",
    "publish:dry-run": "npm publish --dry-run --access public",
    "lint:package": "npm pack --dry-run"
  }
}
```

### 非対象 (Out of Scope)

以下は、フェーズ1対象外です。
これらは、Git Submodule 前提のレガシーワークフローです。これらは、(フェーズ4での) 削除対象です。

```json
postinstall
postinstall_compat
prelint:docs
prelint:docs_compat
```

### 責務

フェーズ1で対応すること。

* npm publish 用 scripts
* package verification scripts
* prepare hook

### 非責務

フェーズ1では対応しないこと。

* 利用側プロジェクトの lint scripts

## npm 配布のための実装修正

### 概要

本章では、S2J Docs Linter を Git サブモジュール運用から npm モジュール運用へ移行するにあたり、既存実装に対して必要となる修正を定義します。

本仕様は、既存実装を全面的に作り直すことを目的とせず、既存資産を最大限活用しつつ npm パッケージとして publish 可能な構成へ拡張することを目的します。

### 設計意図 (ゴール)

* Git サブモジュール依存を削減する
* npm レジストリ (`npmjs.com`) からインストール可能にする
* GitHub Actions における CI 安定性を向上させる
* S2J エコシステムとして再利用可能な developer ツールにする
* 既存 CLI 実装 (`run-textlint.ts`) を活用する

### 設計原則

* 既存 Git サブモジュールユーザーへの影響を最小化すること。
* npm install 後に利用可能な構成とすること。
* CLI を、パッケージの正式 API として扱うこと。

### 設計方針 (規約)

* 既存構造を可能な限り維持する
* npm パッケージメタデータを package.json に追加する
* CLI entrypoint を正式サポートする
* preset config をパッケージに同梱する
* Git サブモジュール例は、npm 例と併存可能にする

### 非対象 (Out of Scope)

* textlint rule の全面再設計
* preset rule の大規模な破壊的変更
* GitHub Packages 対応
* pnpm 固有最適化
* Docker イメージ提供
* モノレポ化

### 責務

* `package.json` を修正すること。
* CLI コマンドを公開すること。
* npm publish に対応すること。
* README / examples を更新すること。
* GitHub Actions publish ワークフローを追加すること。

### 非責務

* reviewdog 統合
* VSCode エクステンション
* IDE プラグイン
* GitHub Marketplace Action

### フェーズ1実装範囲

| 責務項目 | フェーズ1 |
| --- | --- |
| `package.json` の修正 | 済 |
| CLI コマンドの公開 | 済 (`s2j-docs-linter` / 互換 `docs-lint`) |
| npm publish に対応する tarball 構成 | 済 (`npm pack` で `presets/` 同梱を確認) |
| README の更新 | **一部** — Submodule を主導線のまま、npm 手順を方法2として追記・更新 |
| GitHub Actions publish ワークフロー | **設計済み** — `.github/workflows/npm-publish.yml` 追加。`NPM_TOKEN` 設定と tag 運用はフェーズ2。`NPM_TOKEN` 設定については、[npm パッケージ仕様 (認証およびシークレット管理仕様)](./npm_auth_secret_manage_spec.md) を参照。 |
| `examples/` の npm 版 | 未 |

## `package.json` メタデータ更新

### 設計意図 (ゴール)

npm パッケージとして publish 可能なメタデータを整備します。

### 設計原則

* npm レジストリ上で、パッケージを識別しやすくすること。

### 実装修正

`package.json` に、下記を反映する (フェーズ1実装済み。`version` は既存 semver を維持し、初回 npm 公開時点では `1.0.10`)。

```json
{
  "name": "@s2j/docs-linter",
  "version": "1.0.10",
  "description": "Reusable textlint toolkit for Swift, WordPress, and general documentation projects.",
  "license": "GPL-2.0-or-later",
  "homepage": "https://github.com/stein2nd/docs-linter#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/stein2nd/docs-linter.git"
  },
  "bugs": {
    "url": "https://github.com/stein2nd/docs-linter/issues"
  }
}
```

* **ライセンス**: `MIT` ではなく **`GPL-2.0-or-later`** とする。

## CLI Entrypoint 公開

### 設計意図 (ゴール)

ユーザーが、config パスを意識せず、CLI から利用可能にします。

### 設計原則

* ゼロコンフィグ・ファースト (最小操作で利用可能) とすること。

### 実装修正

既存の下記ファイルを、正式 CLI entrypoint とします。

```text
src/bin/run-textlint.ts
dist/bin/run-textlint.js
```

`package.json`:

```json
{
  "bin": {
    "s2j-docs-linter": "dist/bin/run-textlint.js",
    "docs-lint": "dist/bin/run-textlint.js"
  },
  "main": "dist/bin/run-textlint.js"
}
```

### CLI 契約 (フェーズ1)

| 項目 | 仕様 |
| --- | --- |
| 正式コマンド | `s2j-docs-linter` |
| 互換コマンド | `docs-lint` (同一実装) |
| プロファイル | `--profile base \| wordpress \| wp \| swift` |
| lint 対象 | コマンド末尾の引数 (未指定時は `./README.md` と `./docs/**/*.md`) |
| 設定の優先順 | 1: プロジェクト直下のユーザー設定 (下記候補) / 2: `--profile` で指定した bundled preset / 3: 未指定時 **WordPress** preset |
| ユーザー設定候補 | `./.textlintrc`, `./.textlintrc.json`, `./.textlintrc.jsonc`, `./.textlintrc.wp.json`, `./.textlintrc.swift.json`, `./tools/docs-linter/.textlintrc.local.json` |

### 利用例

```bash
# デフォルト (WordPress preset、対象は README + docs)
npx s2j-docs-linter

# プロファイルと対象を指定
npx s2j-docs-linter --profile swift ./README.md ./docs/**/*.md

npx s2j-docs-linter --profile base ./docs/**/*.md
```

## ファイルスコープの最適化を Publish

### 設計意図 (ゴール)

不要ファイルを npm パッケージに含めません。

### 設計原則

* 必要最小限のみ公開すること。

### 実装修正

`package.json`:

```json
{
  "files": [
    "dist/",
    "presets/",
    "scripts/",
    "package.json",
    "README.md",
    "LICENSE"
  ]
}
```

* `presets/` 配下に `base/`、`swift/`、`wordpress/` を含める。
* root 直下の `base/` 等への再配置は、互換性優先のためフェーズ1では行わない。

下記は、除外対象です。

* src/
* examples/
* docs/
* tsconfig.json
* vite.config.ts

## 移行のワークフロー例

### 設計意図 (ゴール)

`examples/` のワークフローを、Submodule 前提から npm インストール前提に、段階的に更新します。

### 設計方針 (規約)

* フェーズ1: 本リポジトリの CLI / tarball は利用可能。`examples/` は **未更新** のまま併存可。
* フェーズ1残タスク … 各 example の lint ステップを `npx s2j-docs-linter` に寄せる (Submodule 併記は可)。
* 廃止目標 (example 内) … Submodule 専用の `--config tools/docs-linter/...` 直指定。
* 推奨 (example 内) … `run: npx s2j-docs-linter docs/**/*.md` または `--profile swift`。

### 実装修正: フェーズ1 (実装済み)

* `examples/lint-docs.yml` / `lint-docs.swift.yml` / `lint-docs.wp.yml` — lint ステップを `npx s2j-docs-linter` に更新。Submodule 取得ステップは併存。
* [npm_usage.md](./npm_usage.md) — `package.json` の `lint:docs` について Submodule → npm の before/after を追記 ([移行のワークフロー例 - フェーズ1優先タスク](#移行のワークフロー例---フェーズ1優先タスク))。

利用側は次のコマンドで lint 可能です。

```bash
npx s2j-docs-linter docs/**/*.md
npx s2j-docs-linter --profile swift docs/**/*.md
```

* **廃止する記述例** (Submodule 専用の config 直指定):

```yaml
--config tools/docs-linter/.textlintrc.json
```

* **推奨する記述例**:

```yaml
run: npx s2j-docs-linter docs/**/*.md
```

## 移行のワークフロー例 - フェーズ1優先タスク

### 設計意図 (ゴール)

利用側プロジェクトの移行を容易にします。

### 設計原則

* 段階移行を許容すること。

### 設計方針 (規約)

まず、WordPress 向けプロジェクトの場合。

変更前、利用側の `package.json` の `scripts > lint:docs` での、`node_modules`、textlint 設定ファイルそれぞれへのパス指定は、下記のようになっています。

```bash
NODE_PATH=./tools/docs-linter/node_modules:./node_modules textlint --config ./.textlintrc.json
```

変更後、利用側の `package.json` の `scripts > lint:docs` での、`node_modules`、textlint 設定ファイルそれぞれへのパス指定は、下記のようになります。

```bash
NODE_PATH=./node_modules textlint --config ./.textlintrc.json
```

続いて、Swift 向けプロジェクトの場合。

変更前、利用側の `package.json` の `scripts > lint:docs` での、`node_modules`、textlint 設定ファイルそれぞれへのパス指定は、下記のようになっています。

```bash
textlint --config ./tools/docs-linter/swift/.textlintrc.swift.json
```

変更後、利用側の `package.json` の `scripts > lint:docs` での、`node_modules`、textlint 設定ファイルそれぞれへのパス指定は、下記のようになります。

```bash
npx s2j-docs-linter --profile swift
```

### 非対象 (Out of Scope)

以下は、フェーズ1対象外です。

* automatic codemod

### 責務

フェーズ1で対応すること。

* migration examples
* before/after docs

### 非責務

フェーズ1では対応しないこと。

* automatic migration tooling

### 実装修正: フェーズ1 (実装済み)

* [npm_usage.md](./npm_usage.md) の「`package.json` 統合」に、WordPress / Swift 向け `lint:docs` の before/after 表を追記。
* [examples/lint-docs.yml](../examples/lint-docs.yml) 系の CI サンプルで `npx s2j-docs-linter` を推奨コマンドとして記載。

## 互換性に関する、移行戦略

### 設計意図 (ゴール)

* 既存プロジェクトの CI / VSCode / local lint ワークフローを壊さない
* Swift / WordPress の既存運用を維持する
* npm モジュール化への段階移行を可能にする
* 移行コストを最小化する
* 破壊的変更を抑制する

### 設計原則

* 既存利用プロジェクトを優先すること。
* 一括移行ではなく、段階移行とすること。
* パッケージ内部構造は、既存構造を極力維持すること。

### 設計方針 (規約)

* Git Submodule ユーザーを、即時切り捨てしない
* npm パッケージと Git Submodule を一定期間、併存させる
* パッケージ内部構造は、可能な限り維持する
* プリセットパスの互換性を優先する
* CLI 互換性を維持する

### 非対象 (Out of Scope)

* Git Submodule 利用の即時廃止
* プリセットパスの、即時の全面変更
* VSCode 設定の、即時の全面変更
* NODE_PATH 依存の、即時の完全除去

### 責務

本方針で対応すること。

* プリセットパスの互換性
* CLI の移行パス
* GitHub Actions 移行ガイド
* VSCode 移行ガイド

### 非責務

本方針で対応しないこと。

* レガシーワークフローの永久維持
* 非推奨 API の無期限維持

## 互換性に関する、移行戦略 - フェーズ1優先タスク

### 設計意図 (ゴール)

既存 Git Submodule ユーザーの設定変更を最小限にします。

### 設計原則

* 既存プロジェクト優先。
* 全面作り直しを避けること。

### 設計方針 (規約)

publish package 内で下記レイアウトを維持します。

```text
base/
swift/
wordpress/
```

Swift 向けプロジェクトの場合。

変更前、利用側の既存 `.vscode/settings.json` の `textlint.configPath` へのプリセットパス指定は、下記のようになっています。

```text
tools/docs-linter/swift/.textlintrc.swift.json
```

変更後、利用側の既存 `.vscode/settings.json` の `textlint.configPath` へのプリセットパス指定は、下記のようになります。

```text
node_modules/@s2j/docs-linter/swift/.textlintrc.swift.json
```

### 非対象 (Out of Scope)

以下は、フェーズ1対象外です。

* レガシー config の永久維持

### 責務

フェーズ1で対応すること。

* レイアウトの互換性
* プリセットの互換性

### 非責務

フェーズ1では対応しないこと。

* Git Submodule ワークフローの永続維持

## 互換性に関する要件

### 設計意図 (ゴール)

既存設定の変更を、最小限に抑えます。

### 必須の互換要件

#### プリセットレイアウトの互換性

以下のパスを維持します。

```text
presets/base/.textlintrc.base.json
presets/swift/.textlintrc.swift.json
presets/wordpress/.textlintrc.wp.json
```

#### `package.json` Node 解決の互換性

利用側の `package.json` では、下記のような利用を、移行期間中、許容します。

```bash
NODE_PATH=./node_modules
```

#### `.textlintrc.json` 設定の互換性

利用側の既存 `.textlintrc.json` は、下記のようになっています。

```json
{
  "extends": ["./tools/docs-linter/presets/base/.textlintrc.base.json"]
}
```

npm パッケージ化後、利用側の `.textlintrc.json` は、下記のように変わります。

```json
{
  "extends": ["./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"]
}
```

この移行だけで、動作可能とします。

## CLI 互換レイヤ

### 設計意図 (ゴール)

Git サブモジュール前提の、固定パス依存を除去し、config パス指定なしでも利用可能にします。

### 設計原則

* パッケージ単体で動作可能にすること。

### 設計方針 (規約)

下記の CLI を提供します。

```bash
s2j-docs-linter
```

### 移行パス

利用側の既存 `package.json` の `scripts > lint:docs` は、下記のようになっています。

```bash
textlint --config ./.textlintrc.json
```

あるいは、下記のように、docs-linter 内のプリセットを明示指定しています。

```bash
textlint --config ./tools/docs-linter/presets/swift/.textlintrc.swift.json
```

npm パッケージ化後、利用側の `package.json` の `scripts > lint:docs` は、下記のように変わります。

```bash
s2j-docs-linter
```

あるいは、下記のように、プロファイルと、対象ファイルを明示指定します。

```bash
s2j-docs-linter --profile swift ./README.md ./docs/**/*.md
```

### CLI 内部の config 解決 (フェーズ1実装)

CLI は、**パッケージ root** (`package.json` があるディレクトリ) 基準で bundled preset を解決します。Submodule 配置 (`tools/docs-linter/`) と npm 配置 (`node_modules/@s2j/docs-linter/`) の両方で同じ相対構造が成り立ちます。

```ts
const packageRoot = path.resolve(__dirname, "../..");
const presetWp = path.resolve(
  packageRoot,
  "presets/wordpress/.textlintrc.wp.json"
);
```

* **禁止するもの** (CLI 実装):
  * bundled preset の解決に `tools/docs-linter/...` など **利用側ワークスペース固定パス** をハードコードすること。
* **許容するもの** (ユーザー設定):
  * プロジェクト直下、または `./tools/docs-linter/.textlintrc.local.json` にユーザーが置いた設定を、既存 Submodule ユーザー向けに探索候補とすること。

### デフォルト preset

ユーザー設定と `--profile` がどちらも未指定の場合、CLI のデフォルトは、**WordPress** preset (`presets/wordpress/.textlintrc.wp.json`) とします。

### NODE_PATH (移行期間)

CLI 実行時、内部で下記を `NODE_PATH` に連結します ([互換性に関する、移行戦略](#互換性に関する移行戦略) の非対象「即時の完全除去」に従い、フェーズ1では維持)。

1. `{packageRoot}/node_modules`
2. `{cwd}/node_modules`
3. (あれば) 既存の `process.env.NODE_PATH`

## VSCode 互換戦略

### 設計意図 (ゴール)

editor ワークフローを壊しません。

### 移行

利用側の既存 `.vscode/settings.json` は、下記のようになっています。

```json
"textlint.configPath": "./tools/docs-linter/presets/swift/.textlintrc.swift.json"
"textlint.nodePath": "./tools/docs-linter/node_modules"
```

npm パッケージ化後、利用側の `.vscode/settings.json` は、下記のように変わります。

```json
"textlint.configPath": "./node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json"
"textlint.nodePath": "./node_modules"
```

## CI 互換戦略

### 設計意図 (ゴール)

既存 GitHub Actions を最小変更で移行可能にします。

### 移行

利用側の既存 `package.json` の `scripts > prelint:docs` は、下記のようになっています。

```yaml
git submodule update --remote --merge
```

削除。

---

利用側の既存 `package.json` の `scripts > postinstall` は、下記のようになっています。

```bash
cd tools/docs-linter && npm install
```

削除。

npm パッケージ化後、利用側 CI の依存インストールは、下記のように簡素化できます。

```bash
npm ci
```

---

利用側の既存 `package.json` の `scripts > lint:docs` は、下記のようになっています。

```bash
NODE_PATH=./tools/docs-linter/node_modules
```

npm パッケージ化後、利用側の `package.json` の `scripts > lint:docs` は、下記のように変わります。

```bash
NODE_PATH=./node_modules
```

### 評価

CI の複雑さを大幅削減できます。

## GitHub Actions Publish ワークフロー

### 設計意図 (ゴール)

tag push で npm publish 可能にします。

### 設計原則

* 手動 publish 作業を最小化すること。

### 実装修正

新規に、下記概要のワークフローファイル `.github/workflows/npm-publish.yml` を追加します (実装済み)。

* tag trigger
* setup-node
* npm ci
* `npm run verify:tarball`
* npm publish --access public

## GitHub Actions Publish ワークフロー - フェーズ1優先タスク

### 設計意図 (ゴール)

フェーズ2で自動 publish を実現します。

### 設計原則

#### Automation After Validation

手動 publish 成功後に自動化すること。

### 設計方針 (規約)

フェーズ1では設計のみとします。

workflow:

```yaml
.github/workflows/npm-publish.yml
```

trigger:

```yaml
push:
  tags:
    - 'v*'
```

### 非対象 (Out of Scope)

フェーズ1対象外です。

### 責務

フェーズ2で対応すること。

### 非責務

フェーズ1では対応しないこと。

* リポジトリ Secrets への `NPM_TOKEN` 登録
* tag `v*` push による registry への実際の publish 運用

### フェーズ1の状態

* `.github/workflows/npm-publish.yml` を追加済み。
* トリガー `push.tags: 'v*'`、`setup-node` (Node 20)、`npm ci`、`verify:tarball`、`npm publish --access public` を定義。
* 運用開始は [Automation After Validation](#automation-after-validation) に従い、初回手動 `npm publish` 成功および `NPM_TOKEN` 設定後 (フェーズ2)。

## 依存関係レビュー

### 設計意図 (ゴール)

runtime 依存関係を明確化します。

### 設計原則

* CLI 実行時に必要な依存を、dependencies に移すこと。

### 実装修正

フェーズ1で、実行時に必要なパッケージは **`dependencies`** に、ビルド専用は **`devDependencies`** に分離します (実装済み)。

* devDependencies (例):
  * `typescript`
  * `vite`
  * `rollup`
  * `@types/node`
  * build tools
* dependencies (例):
  * `textlint`
  * textlint ルール、フィルター、プリセット (`textlint-rule-*`, `textlint-rule-preset-*`, `@textlint-ja/*` 等)
  * GitHub 参照プリセット (`textlint-rule-preset-swift-docs-ja`, `textlint-rule-preset-wp-docs-ja`)
  * required plugins
  * required presets

## npm 使い方ガイド との整合 - フェーズ1優先タスク

### 設計意図 (ゴール)

README / usage guide / package 実装を一致させます。

### 設計原則

* README に書いたコマンドは、実際に動くこと。

### 設計方針 (規約)

README:

```bash
npm install --save-dev @s2j/docs-linter
```

usage:

```bash
npx s2j-docs-linter docs/**/*.md
```

package.json:

```json
{
  "bin": {
    "s2j-docs-linter": "./dist/bin/run-textlint.js"
  }
}
```

### 非対象 (Out of Scope)

以下は、フェーズ1対象外です。

* Git Submodule README の即時削除

### 責務

フェーズ1で対応すること。

* npm usage doc 更新
* README 更新
* install examples 更新

### 非責務

フェーズ1では対応しないこと。

* third-party blog 更新

## 移行戦略 - 非推奨化ポリシー

### 設計意図 (ゴール)

既存ユーザーの移行負荷を抑えます。

### 設計原則

* 破壊的移行を避け、段階的移行を優先すること。

### 設計方針 (規約)

1. フェーズ1: Git Submodule と npm パッケージを併存する
2. フェーズ2: npm パッケージをデフォルト化する
3. フェーズ3: Git Submodule を非推奨化する
4. フェーズ4: レガシー機能の削除

### フェーズ1で完了した項目

* `@s2j/docs-linter` としての `package.json` メタデータ
* CLI `s2j-docs-linter` (互換 `docs-lint`)
* `presets/` レイアウトの維持と tarball 同梱
* 実行時 `dependencies` への移行
* README への npm 手順の併記 (Submodule は引き続き主導線)
* `examples/lint-docs*.yml` の `npx s2j-docs-linter` 化と [npm_usage.md](./npm_usage.md) の `lint:docs` 移行例
* `.github/workflows/npm-publish.yml` (tag `v*`、publish 前 `verify:tarball`)。registry 運用はフェーズ2

### フェーズ1の残タスク (本リポジトリ)

* npmjs への初回 publish (手動)。自動 tag publish の運用開始 (`NPM_TOKEN` + tag push) はフェーズ2
* 利用側プロジェクトでの受け入れ試験 (任意だがフェーズ1クローズに推奨)

## README 移行

### 設計意図 (ゴール)

導入方法を、段階的に npm install 中心に移行します。
フェーズ1では、Git Submodule を主導線のまま npm 手順を併記します。
フェーズ2以降で、README のデフォルトを npm に切り替えます。

### 設計方針 (規約)

| フェーズ | README の到達度 |
| --- | --- |
| フェーズ1 (実装済み) | 方法1 (Git Submodule) を主導線。方法2 (npm) に `@s2j/docs-linter` / `s2j-docs-linter` / `--profile` を併記。互換 CLI `docs-lint` に言及可。 |
| フェーズ2以降 (未実施) | デフォルト導線を npm に変更。Submodule 手順をレガシー appendix に移動。 |

フェーズ1で利用側に示す npm 導入の最小例は、下記の通りです。

```bash
npm install --save-dev @s2j/docs-linter
npx s2j-docs-linter --profile swift ./README.md ./docs/**/*.md
```

### 実装修正: フェーズ1 (実装済み)

* **方法1: (Git Submodule)** を README の主導線のまま維持する。
* **方法2: (npm パッケージ)** を追記/更新し、`@s2j/docs-linter` と `s2j-docs-linter` / `--profile` を記載する。
* 互換 CLI 名 `docs-lint` に言及してよい。

```bash
npm install --save-dev @s2j/docs-linter
npx s2j-docs-linter --profile swift ./README.md ./docs/**/*.md
```

### 実装修正: フェーズ2以降 (未実施)

* README のデフォルト導線を npm install に変更する。
* Submodule 手順は、レガシーとして appendix へ移動する。

```bash
# フェーズ2 以降: メイン導線
npm install --save-dev @s2j/docs-linter

# レガシー (フェーズ3 で非推奨化)
git submodule add https://github.com/stein2nd/docs-linter.git tools/docs-linter
```
