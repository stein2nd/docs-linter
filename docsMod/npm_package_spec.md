# S2J Docs Linter - npm パッケージ仕様

## 概要

本ドキュメントは、Docs Linter を Git サブモジュール型の共有 lint モジュールから、npm レジストリ (`npmjs.com`) 上で配布可能な npm パッケージ **`@s2j/docs-linter`** として再設計するための仕様を定義します。

## パッケージ戦略

### 設計意図 (ゴール)

* Docs Linter を、Git サブモジュール依存から脱却させる。
* GitHub Actions における CI 安定性を向上させる。
* npm レジストリによるバージョン管理を導入する。
* S2J ブランド配下の再利用可能な developer ツールとして整備する。
* Swift / WordPress / 汎用ドキュメント向け lint 基盤として再利用可能にする。

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

### 設計原則

#### 配布を最優先に

配布方式は、Git clone ではなく、package manager を優先すること。

#### CI 対応

GitHub Actions において、deterministic なインストールを可能にすること。

#### エコシステムの一貫性

S2J エコシステムのネーミング/パッケージングを統一すること。

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

### 設計原則

#### 名前空間の所有権

`@s2j/*` 名前空間に統一すること。

#### 人間可読性

CLI 名称は、可読性を優先すること。

### 責務

package.json は、下記とすること。

```json
{
  "bin": {
    "s2j-docs-linter": "./dist/bin/run-textlint.js"
  }
}
```

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

#### 最小限の公開面積

publish 対象は、必要最小限とすること。

### 責務

files は、下記とすること。

```json
{
  "files": [
    "base/",
    "swift/",
    "wordpress/",
    "dist/",
    "README.md"
  ]
}
```

## 本リポジトリ `package.json` の `scripts` (サブモジュールから npm への転換)

Git サブモジュール運用から npm モジュール運用へ移行するにあたり、**本リポジトリ** (S2J Docs Linter) の `package.json` に定義された `scripts` のうち、見直しが必要になり得るものと、現状のままでよいものを次に整理します。利用側プロジェクトの `scripts` や CI の書き換えは、[npm 使い方ガイド](./npm_usage.md) を参照します。

### 設計意図 (ゴール)

* 本パッケージの CI およびローカル検証が、公開 tarball、CLI、プリセット配置と整合すること。
* サブモジュール前提の実行パスやワークアラウンドに依存した検証から脱却すること。

### 修正の検討が必要になり得る `scripts`

| スクリプト名 | 見直しの理由 |
| --- | --- |
| `lint` | 現状は `npx textlint` を直接実行している。パッケージ名を `@s2j/docs-linter`、CLI を `s2j-docs-linter` とする本仕様に合わせ、本リポジトリの自己検証でも **公開 CLI と同じコマンド** (例: `s2j-docs-linter` または `npx s2j-docs-linter`) にそろえるかどうかを決める。そろえる場合はコマンドおよび対象パスを [npm 使い方ガイド](./npm_usage.md) の規約に整合させる。 |
| `lint:wp` | `--config` で参照している `./presets/wordpress/...` は、本仕様の **パッケージ構成** および **`files`** (`base/`、`swift/`、`wordpress/` を tarball に含める想定) へ合わせてディレクトリを再配置する場合、**設定ファイルの相対パスを変更** する。あるいは、ゼロコンフィグ優先の CLI 実行へ置き換える選択肢もある。 |
| `lint:swift` | 同上により **`--config` のパス** が変わり得る。また、`NODE_PATH=./node_modules` は、親ディレクトリからサブモジュール内のプリセットを `textlint` だけで動かす際の **モジュール解決の回避策** として用いられてきた。npm パッケージとして **`s2j-docs-linter` が依存解決を担う** 形に寄せるなら、当該の環境変数は **削除または簡略化** できる見込み。引き続き、素の `textlint` のみで検証する場合は、hoisting の状況に応じて一時的に残す判断もあり得る。 |

上記に伴い、**CLI の実装** (たとえば、`dist/bin/run-textlint.js` が参照するプリセットの相対パス) も、公開ディレクトリ構成と **同じ転換作業の一部** として更新する。

### 転換後も原則として変更不要な `scripts`

次の `scripts` は、サブモジュールから npm への転換そのものとは独立し、原則として現行のまま維持してよい。

* `clean` / `build` / `dev` — ソースから `dist/` を生成するビルド用。
* `prepare` — `npm publish` や Git 由来の `npm install` におけるビルドおよび `setup-npmignore` の実行。
* `postinstall` — インストール後の補助処理 (利用側で `ignore-scripts` を使う場合は別問題であり、本仕様のスクリプト文字列の修正とは切り離して扱う)。
* `install:compat` — npm エンジン互換用。転換とは無関係。

### 設計原則

#### 公開物との一致

本リポジトリの `lint` 系 `scripts` は、利用者が実行する CLI、設定パスと **意味上矛盾しない** ように維持すること。

#### サブモジュール特有の回避策の縮小

npm パッケージと公式 CLI を正とし、`NODE_PATH` など **サブモジュール時代のワークアラウンド** は、新しい実行経路では可能な限り用いないこと。

## バージョン

### 設計方針 (規約)

semantic バージョニングは、下記とします。

* MAJOR
* MINOR
* PATCH

### 設計原則

破壊的変更は、明示すること。

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