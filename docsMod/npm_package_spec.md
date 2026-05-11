# S2J Docs Linter - npm パッケージ仕様

## 概要

本ドキュメントは、Docs Linter を Git サブモジュール型の共有 lint モジュールから、npm レジストリ (`npmjs.com`) 上で配布可能な npm パッケージ **`@s2j/docs-linter`** として再設計するための仕様を定義します。

## 1. パッケージ戦略

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

## 2. パッケージ ネーミング

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

## 3. パッケージ構成

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

## 4. バージョン

### 設計方針 (規約)

semantic バージョニングは、下記とします。

* MAJOR
* MINOR
* PATCH

### 設計原則

破壊的変更は、明示すること。

## 5. Publishing

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