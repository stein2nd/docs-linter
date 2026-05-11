# S2J Docs Linter - npm 使い方ガイド

## 概要

本ドキュメントでは、`@s2j/docs-linter` を npm モジュールとして利用する方法を定義します。

## 1. インストール

### 設計意図 (ゴール)

Git サブモジュールなしで Docs Linter を導入可能にします。

### 設計方針 (規約)

インストールは、下記とします。

```bash
npm install --save-dev @s2j/docs-linter
```

### 非対象 (Out of Scope)

* Git サブモジュールのインストール
* レガシー環境の移行自動化

### 責務

パッケージのインストールを提供すること。

## 2. CLI の使い方

### 設計方針 (規約)

```bash
npx s2j-docs-linter docs/**/*.md
```

### 設計原則

ゼロコンフィグ・ファースト

## 3. package.json 統合

### 設計方針 (規約)

```json
{
  "scripts": {
    "lint:docs": "s2j-docs-linter docs/**/*.md"
  }
}
```

## 4. GitHub Actions

### 設計意図 (ゴール)

CI により、決定論的な実行を実現します。

### 設計方針 (規約)

ワークフローは、下記とします。

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

### 設計原則

#### 明示的か、それとも暗黙的か

CI では、決定論的コマンドを使用すること。

### 責務

CI セーフな lint 実行をすること。

### 非責務

reviewdog 統合。