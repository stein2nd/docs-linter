## S2J Docs Linter CLI Tooling Specification

### 設計意図 (ゴール)

下記の目的で、S2J Docs Linter (`@s2j/docs-linter`) に対して、npm パッケージとしてのプリセット提供に加え、ユーザーの導入、診断、保守を支援する CLI ツールを提供する。

* 開発者のオンボーディングの簡素化
* マイグレーション時の摩擦の低減
* 設定ミスの削減
* CI 統合の標準化
* エコシステムの拡大の実現

フェーズ4「P2: エコシステムの拡張」の実装対象とする。

### 設計原則

* README のコピペや手作業設定よりも、CLI 実行により安全かつ再現可能に、初期設定できること。CLI ツールは、開発者体験の向上を第一の目的とする。
* 生成物は、暗黙的に変更しないこと。CLI が生成・更新するファイルは明示する。
* 既存ファイルを無断で上書きしないこと。破壊的変更には、明示的な同意を求める。
* S2J Docs Linter は、npm パッケージであるため、npm install 後の利用を標準とすること。生成される設定は、npm パッケージのレイアウトを前提としている。
* 標準的なベストプラクティスを、下記ファイルをスケルトンとして提供すること。
    * textlint
    * VSCode
    * GitHub Actions
    * npm スクリプト
* CLI ツールは、段階的に拡張すること。その際の優先順位は下記とする。
    1. init
    2. doctor
    3. upgrade (将来的なオプション)
    4. migrate (将来的なオプション)

### 設計方針 (規約)

### 非対象 (Out of Scope)

* 依存関係の自動更新
* セマンティック・リリースの自動化
* リモート CI による改変
* スケルトン生成を超えた GitHub リポジトリの自動更新
* パッケージ publish 自動化での変更

### 責務

* CLI エコシステムの定義
* init スケルトン生成挙動
* doctor 診断範囲
* ファイル生成ルール
* 上書き時の安全ルール

### 非責務

* 任意のユーザー設定との互換性
* レガシープロジェクトの自動移行
* 機能不全に陥った CI の修復
* 外部パッケージのトラブルシュート
* エンタープライズ環境のサポート

### ディレクトリ構成案

```text
├┬─ src/
│└┬─ bin/
│　├─ init.ts
│　├─ doctor.ts
│　└┬─ templates/
│　　├─ textlintrc.base.json
│　　├─ vscode.settings.json
│　　└─ docs-lint.yml
```

### CLI コマンドの範囲

標準コマンドは、下記とします。

```bash
npx s2j-docs-linter init
npx s2j-docs-linter doctor
```

将来的な候補コマンドは、下記が挙げられます。

```bash
npx s2j-docs-linter upgrade
npx s2j-docs-linter migrate
```

### CLI コマンド - init コマンド

「プロジェクトの骨組み生成」を目的とし、下記を責務とします。

* 基本設定の生成
* プリセットを考慮したセットアップ
* ワークフローテンプレートの生成

本コマンドにより、下記ファイルが生成されます。

* `.textlintrc.json`
* `.vscode/settings.json`
* `.github/workflows/docs-lint.yml`

#### init 上書きポリシー

既存ファイルがある場合、明示的に `--force` が付与された場合のみ、上書きします (つまり、デフォルト設定は「上書きしない」)。

#### 1. init デフォルト動作

`npx s2j-docs-linter init` で生成されるプリセットは、「base」となります。

生成される `.textlintrc.json` の `extends` 配列の内容は、下記の通りです。

```json
{
  "extends": [
    "./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"
  ]
}
```

#### 1.1. init プリセットの選択

* `npx s2j-docs-linter init --preset base` 指定時
    * 対応するプリセットファイルは、`presets/base/.textlintrc.base.json`
    * 生成される `.textlintrc.json` の `extends` 配列の内容は、`"./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"`
* `npx s2j-docs-linter init --preset wordpress` 指定時
    * 対応するプリセットファイルは、`presets/wordpress/.textlintrc.wp.json`
    * 生成される `.textlintrc.json` の `extends` 配列の内容は、`"./node_modules/@s2j/docs-linter/presets/wordpress/.textlintrc.wp.json"`
* `npx s2j-docs-linter init --preset swift` 指定時
    * 対応するプリセットファイルは、`presets/swift/.textlintrc.swift.json`
    * 生成される `.textlintrc.json` の `extends` 配列の内容は、`"./node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json"`

#### 2. init VSCode テンプレート

`.vscode/settings.json` に生成される「VSCode テンプレート」の標準内容は、下記とします。

```json
{
  "textlint.configPath": "./.textlintrc.json",
  "textlint.nodePath": "./node_modules",
  "textlint.enable": true,
  "textlint.autoFixOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.textlint": "always"
  },
  "[markdown]": {
    "editor.defaultFormatter": "3w36zj6.textlint"
  }
}
```

#### 3. init ワークフローテンプレート

`.github/workflows/docs-lint.yml` に生成される「ワークフローテンプレート」の標準内容は、下記に関するものとします。

* checkout
* setup-node
* npm ci
* npm run lint:docs

### CLI コマンド - doctor コマンド

本コマンドの目的は、下記を責務とする、環境診断です。

* 設定の検証
* 依存関係の検証
* CI 準備状況の検証

#### doctor チェック

下記を対象とします。

* Node.js バージョン
* npm 利用可否
* textlint インストール
* @s2j/docs-linter インストール
* `.textlintrc.json`
* プリセットの解決
* package.json スクリプト
* VSCode 設定
* GitHub Actions ワークフロー

#### doctor 出力ポリシー

doctor コマンドの結果は、`PASS`、`WARN`、`FAIL` に区分されます。

* ✔ は、PASS に対応
* ⚠ は、WARN に対応
* ✖ は、FAIL に対応

```text
✔ Node.js >= 20
⚠ GitHub Actions workflow missing
✖ preset config not found
```
