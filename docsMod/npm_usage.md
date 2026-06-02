# S2J Docs Linter - npm 使い方ガイド

## 概要

本ドキュメントでは、`@s2j/docs-linter` を npm モジュールとして利用する方法を定義します。

Git Submodule 導線は [README](../README.md) の「方法1」を参照してください。npm 専用の手順は README の「方法2」と本ガイドで揃えています。パッケージ全体の仕様は [npm パッケージ仕様](./npm_package_spec.md) を参照してください。

## インストール

### 設計意図 (ゴール)

Git サブモジュールなしで Docs Linter を導入可能にします。

### 設計方針 (規約)

プロジェクト依存としてインストールする場合は、下記とします。

```bash
npm install --save-dev @s2j/docs-linter
```

グローバルに CLI だけ使う場合は、下記とします。

```bash
npm install -g @s2j/docs-linter
```

### 非対象 (Out of Scope)

* Git サブモジュールのインストール
* レガシー環境の移行自動化

### 責務

パッケージのインストールを提供すること。

### 初回セットアップ

プロジェクトに Docs Linter を導入する場合は、まず `init` を実行します。

```bash
npx @s2j/docs-linter init
```

生成された設定ファイルをコミットしてください。

* `.textlintrc.json`
* `.vscode/settings.json`
* `.github/workflows/docs-lint.yml`

### 設定確認

セットアップ完了後は、下記の様に、`doctor` を利用して環境診断を実施できます。

```bash
npx @s2j/docs-linter doctor
```

下記の様に `--path` を介して診断対象ディレクトリを指定指定できます。

```bash
npx @s2j/docs-linter doctor --path ./project
```

`doctor` は、下記項目を確認します。

* Node.js
* package.json
* textlint
* Config (`.textlintrc.json`)
* Preset
* VSCode
* GitHub Actions

#### CI 導入後の確認

GitHub Actions 設定が正しく配置されているか確認する場合、下記コマンドを実行します。

```bash
npx @s2j/docs-linter doctor
```

下記は、実行後の出力例です。

```text
✔ PASS GitHub Actions
✔ PASS Config
✔ PASS textlint
✔ PASS
```

* WARN は注意喚起であり、終了コードは `0`。
* FAIL が含まれる場合のみ、終了コード `1`。

## CLI の使い方

### 設計方針 (規約)

正式 CLI は、`s2j-docs-linter` です。
後方互換性のため、`docs-lint` も同梱されます (フェーズ1)。

```bash
npx s2j-docs-linter docs/**/*.md
```

プリセットを指定する場合は `--profile` を使います。

```bash
# WordPress (デフォルト): --profile 省略可
npx s2j-docs-linter ./README.md ./docs/**/*.md

npx s2j-docs-linter --profile swift ./README.md ./docs/**/*.md
npx s2j-docs-linter --profile base ./README.md ./docs/**/*.md
```

ヘルプとバージョンを表示する場合は、下記の通りです。

```bash
npx s2j-docs-linter --help
npx s2j-docs-linter --version
```

### 設計原則

ゼロコンフィグ・ファーストであること。
プロジェクト直下の `.textlintrc*` があればそれを優先し、なければパッケージ同梱のプリセットを使用すること。

## VSCode / プリセットパス (互換レイアウト)

### 設計意図 (ゴール)

Git Submodule から npm へ移行する際、VSCode の `textlint.configPath` の変更を最小限にします ([互換性に関する、移行戦略 - フェーズ1優先タスク](./npm_package_spec.md#互換性に関する移行戦略---フェーズ1優先タスク))。

### 設計方針 (規約)

パッケージ tarball には、従来の `presets/` 配下に加え、root 直下の `base/`、`swift/`、`wordpress/` も同梱します (`presets/*` と同一内容のミラー)。
Submodule 配置と同様に、パッケージ root から見た相対パスだけ差し替えればよい移行が可能です。

**Swift 向け** — `textlint.configPath` の場合は、下記のようになります。

| 導入方法 | `textlint.configPath` |
| --- | --- |
| Git Submodule (変更前) | `./tools/docs-linter/swift/.textlintrc.swift.json` |
| npm (変更後) | `./node_modules/@s2j/docs-linter/swift/.textlintrc.swift.json` |

`textlint.nodePath` は `./node_modules` に変更します (Submodule 時代の `./tools/docs-linter/node_modules` は不要)。

**`presets/` パスを使う場合** (README 方法1 と同じ構造) — こちらも引き続き利用できます。

```json
{
  "textlint.configPath": "./node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json",
  "textlint.nodePath": "./node_modules"
}
```

### `.textlintrc.json` の `extends`

プロジェクト直下の `.textlintrc.json` で base プリセットを継承する場合、下記のようになります。

```json
{
  "extends": ["./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"]
}
```

root 直下の互換パスを使う場合、下記のようになります。

```json
{
  "extends": ["./node_modules/@s2j/docs-linter/base/.textlintrc.base.json"]
}
```

## `package.json` 統合

### 設計意図 (ゴール)

Git Submodule から npm へ移行する際、利用側の `scripts > lint:docs` を段階的に差し替えられるようにします ([移行のワークフロー例 - フェーズ1優先タスク](./npm_package_spec.md#移行のワークフロー例---フェーズ1優先タスク))。

### Submodule → npm: `lint:docs` の移行例

段階移行を許容します。まず `textlint` 直実行のまま `NODE_PATH` と config パスだけ差し替え、続いて CLI (`s2j-docs-linter`) へ寄せることを推奨します。

**WordPress 向けプロジェクト**

| 段階 | `scripts.lint:docs` (抜粋) |
| --- | --- |
| 変更前 (Submodule) | `NODE_PATH=./tools/docs-linter/node_modules:./node_modules textlint --config ./.textlintrc.json ./README.md ./docs/**/*.md` |
| 変更後 (段階1: textlint 継続) | `NODE_PATH=./node_modules textlint --config ./.textlintrc.json ./README.md ./docs/**/*.md` |
| 変更後 (推奨: CLI) | `s2j-docs-linter ./README.md ./docs/**/*.md` |

**Swift 向けプロジェクト**

| 段階 | `scripts.lint:docs` (抜粋) |
| --- | --- |
| 変更前 (Submodule) | `textlint --config ./tools/docs-linter/swift/.textlintrc.swift.json ./README.md ./docs/**/*.md` |
| 変更後 (推奨: CLI) | `s2j-docs-linter --profile swift ./README.md ./docs/**/*.md` |

`npx` 経由で実行する場合は、次のとおりです。

```bash
npx s2j-docs-linter --profile swift ./README.md ./docs/**/*.md
```

Submodule 専用の config 直指定 (`--config tools/docs-linter/...`) は、新規プロジェクトでは使わないでください。CI の移行例は [examples/lint-docs.yml](../examples/lint-docs.yml) 系を参照してください。

### 設計方針 (規約)

**WordPress 開発** (デフォルトプリセット) — npm 導入後の推奨設定は、下記の通りです。

```json
{
  "scripts": {
    "lint:docs": "s2j-docs-linter ./README.md ./docs/**/*.md"
  }
}
```

**Swift 開発** — npm 導入後の推奨設定は、下記の通りです。

```json
{
  "scripts": {
    "lint:docs": "s2j-docs-linter --profile swift ./README.md ./docs/**/*.md"
  }
}
```

**基本設定 (base)** — npm 導入後の推奨設定は、下記の通りです。

```json
{
  "scripts": {
    "lint:docs": "s2j-docs-linter --profile base ./README.md ./docs/**/*.md"
  }
}
```

`devDependencies` には `@s2j/docs-linter` を登録してください。

```json
{
  "devDependencies": {
    "@s2j/docs-linter": "^1.0.10"
  }
}
```

## GitHub Actions

### 設計意図 (ゴール)

CI により、決定論的な実行を実現します。

### 設計方針 (規約)

`package.json` に `@s2j/docs-linter` を登録したうえで、ワークフローは下記とします。

```yaml
name: Docs Linter

on:
  pull_request:
    paths:
      - "docs/**"

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - run: npx s2j-docs-linter docs/**/*.md
```

Swift 向けプリセットの場合は、下記のようになります。

```yaml
      - run: npx s2j-docs-linter --profile swift ./README.md ./docs/**/*.md
```

Submodule と npm を併用するサンプルは [examples/lint-docs.yml](../examples/lint-docs.yml) 系を参照してください。

### 設計原則

#### 明示的か、それとも暗黙的か

CI では、決定論的コマンド (`npx s2j-docs-linter`) を使用すること。

### 責務

CI セーフな lint 実行をすること。

### 非責務

reviewdog 統合。

## Release

### 設計意図 (ゴール)

release を安全かつ再現可能にします。

### 設計原則

* release は、GitHub Actions を標準とする。
* 認証は、GitHub OIDC を利用する。

### 設計方針 (規約)

publish トリガーの例は、下記になります。

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions は、`npm publish --access public`
認証は、npm Trusted Publishing になります。

GitHub Secrets は、不要になります。

### 非対象 (Out of Scope)

* 手動による、秘密鍵のローテーション
