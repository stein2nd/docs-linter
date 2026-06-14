# 📘 S2J Docs Linter — *Multiple Preset Textlint Integration*

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.en.html)
[![textlint](https://img.shields.io/badge/textlint-15.7-blue.svg)](https://textlint.org/)
[![Vite](https://img.shields.io/badge/vite-8.0-blue.svg)](https://vite.dev)
[![Rollup](https://img.shields.io/badge/rollup-4.61-blue.svg)](https://rollupjs.org)
[![WordPress](https://img.shields.io/badge/WordPress-6.3+-blue.svg)](https://wordpress.org/)
[![Swift](https://img.shields.io/badge/Swift-5.9+-blue.svg)](https://www.swift.org/)
[![Xcode](https://img.shields.io/badge/Xcode-15.0+-blue.svg)](https://developer.apple.com/xcode/)

## 📝 Description

Markdown ドキュメントを lint (構文・文体チェック) するためのルールセットです。
WordPress プラグイン/テーマ開発、Xcode (Swift/SwiftUI) アプリケーション開発の両方で利用可能です。
また、それらに関連するドキュメント制作での表記統一にも利用可能です。
さらに、GitHub Actions に対応した lint 体制を構築できます。

## ✨ Features

* **複数プリセット統合**:
  * Swift Docs / WordPress Docs など、複数のプリセットを統合して利用可能。
* **柔軟な導入方法**:
  * npm パッケージとして利用可能（推奨）。Git Submodule は [Git Submodule での利用](./docs/git_submodule.md) を参照（後方互換・非推奨）。
* **CI/CD 対応**:
  * GitHub Actions による自動 lint 検証が、安定稼働。
* **エディター統合**:
  * VS Code / Cursor / JetBrains 製エディターに対応。
* **カスタマイズ可能**:
  * プロジェクト固有のルールを追加可能。
* **WordPress PRH**:
  * `npm install` / `postinstall` のたびに [jawordpressorg の `wordpress.yml`](https://github.com/jawordpressorg/textlint-rule-preset-wp-docs-ja) に対し、コロン直後スペースと鉤括弧前スペース禁止の往復衝突を避けるパッチ (`scripts/patch-wp-prh-colon-quote.cjs`) を idempotent に適用。
  上流が同一内容を取り込んだ場合は、自動でスキップ。

## Requirements

* Node.js v20以上
* npm v10以上
* Git

## Quick Start

```zsh
npm install --save-dev @s2j/docs-linter
npx s2j-docs-linter init
npx s2j-docs-linter doctor
npm run lint:docs
```

## ⚙️ Installation

S2J Docs Linter は、npm パッケージとして利用することを推奨します。

### macOS での事前準備

Homebrew、Node.js が未導入の場合は、先にインストールしてください。

1. `node -v` を実行する。
  1. 失敗する場合は、`brew install node` または `nvm install` などで、`Node.js` をインストールする。
2. `node --version`、`npm --version` でバージョンを確認する。

### Windows での事前準備

Node.js LTS が未導入の場合は、先にインストールしてください。

1. `node -v` を実行する。
  1. 失敗する場合は、[Node.js 公式サイト](https://nodejs.org/ja) などから、`Node.js` をインストールする。
  2. PowerShell で `where.exe node`、`where.exe npm` を実行して、`Node.js` が正常にインストールされているか確認。
2. PowerShell でスクリプトの実行権限を `Get-ExecutionPolicy` (勤務先 PC の場合は、`Get-ExecutionPolicy -List`) で確認する。
  1. `Restricted` の場合は、`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` を実行する。
  2. 改めて、`Get-ExecutionPolicy` で `RemoteSigned` になってるか確認する。
3. `node --version`、`npm --version` でバージョンを確認する。

### 「npm パッケージ」の導入

npm レジストリからは **`@s2j/docs-linter`** をインストールし、CLI **`s2j-docs-linter`** で lint します (互換のため **`docs-lint`** も利用可能)。手順の詳細は [npm 使い方ガイド](docs/npm_usage.md) を参照してください。

#### npm パッケージの追加 (グローバル・インストールする場合)

```zsh
npm install -g @s2j/docs-linter
```

インストール後、以下のコマンドで利用できます。

```zsh
# デフォルト (WordPress プリセット) で lint
s2j-docs-linter

# プリセットを指定して lint
s2j-docs-linter --profile swift ./README.md ./docs/**/*.md
s2j-docs-linter --profile base ./README.md ./docs/**/*.md

# 対象ファイルのみ指定 (デフォルトは ./README.md と ./docs/**/*.md)
s2j-docs-linter ./README.md ./docs/**/*.md
```

ユーザー設定 (`.textlintrc.json` など) がある場合はそちらを優先します。設定がない場合のデフォルトは WordPress プリセットです。

#### npm パッケージの追加 (プロジェクト依存としてインストールする場合)

```zsh
cd /path/to/your-project
npm init -y
npm install --save-dev @s2j/docs-linter
```

プロジェクトの `package.json` に、スクリプトとして登録します。

**WordPress 開発** (デフォルトプリセット。`--profile` 省略可) の場合は、下記の通りです。

```json
{
  "scripts": {
    "lint:docs": "s2j-docs-linter ./README.md ./docs/**/*.md"
  }
}
```

**Swift 開発** の場合は、下記の通りです。

```json
{
  "scripts": {
    "lint:docs": "s2j-docs-linter --profile swift ./README.md ./docs/**/*.md"
  }
}
```

**基本設定 (base)** の場合は、下記の通りです。

```json
{
  "scripts": {
    "lint:docs": "s2j-docs-linter --profile base ./README.md ./docs/**/*.md"
  }
}
```

#### インストール後の確認

doctor コマンドで環境を診断できます。

```zsh
npx s2j-docs-linter doctor
```

正常な場合は、下記の様に表示されます。

```text
✔ PASS Node.js
✔ PASS package.json
✔ PASS Config
✔ PASS Preset
✔ PASS textlint
✔ PASS VSCode
✔ PASS GitHub Actions
✔ PASS
```

`⚠ WARN` または `✖ FAIL` が表示された場合は、ファイルの出力先を指定したセットアップコマンド (たとえば `npx @s2j/s2j-docs-linter init --preset wordpress --output .sandbox/wordpress`) を使って、ファイルの欠落を是正してください。

#### セットアップ

初めて利用する場合は、下記の様に、`init` コマンドで設定ファイルを生成します。

```zsh
npx @s2j/docs-linter init
```

これにより生成される主なファイルは、下記の通りです。

* `.textlintrc.json`
* `.vscode/settings.json`
* `.github/workflows/docs-lint.yml`

生成後は、下記の様に対象ドキュメントに対して、lint を実行できます。

```zsh
npx textlint docs/**/*.md
```

## Quick Help

`npx s2j-docs-linter --help` でクイックヘルプが表示されます。

## Postinstall Script

S2J Docs Linter は、依存ライブラリの既知問題を回避するため、インストール時に `postinstall` スクリプトを実行します。
`./scripts/patch-wp-prh-colon-quote.cjs` が、**利用側プロジェクトの `node_modules` 内** にある依存パッケージ `textlint-rule-preset-wp-docs-ja` の PRH 設定 (`prh-rules/wordpress.yml`) だけを書き換えます。
利用側リポジトリの `.textlintrc.json` や VSCode 設定などは変更しません。
WordPress プリセット向け textlint ルールの安定動作を目的とし、実行内容はリポジトリ内で公開されており、外部サービスへの送信やネットワーク通信は行いません。

対象スクリプトは、下記の通りです。

* `./scripts/patch-wp-prh-colon-quote.cjs` — 上記 `wordpress.yml` の「コロンの後に半角スペースを入れる」ルールを idempotent に調整 (未インストール時はスキップ)

一部の環境では `npm warn allow-scripts` が表示される場合がありますが、これは npm のセキュリティ機能による確認のための通知であり、インストール失敗を意味するものではありません。

## 📋 Configuration Files

設定ファイルを、3つ用意してます。

### `presets/base/.textlintrc.base.json` - 基本設定

すべてのプロジェクトで共通して使用する基本設定です。

**含まれるルール:**

* `preset-ja-technical-writing`: 技術文書の基本的なルール
* `preset-jtf-style`: JTF 日本語標準スタイルガイド
  * ただし、`3.1.1.全角文字と半角文字の間`、`4.3.1.丸かっこ（）`、`4.2.7.コロン(：)`、`4.2.8.セミコロン(；)` は、除外
* `prh`: 用語統一ルール (空のルールパス)
* `no-dead-link`: リンク切れチェック

**`使用例:**

```json
{
  "textlint.configPath": "./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"
}
```

### `presets/wordpress/.textlintrc.wp.json` - WordPress 開発用

WordPress プラグイン・テーマ開発に特化した設定です。

**含まれるルール:**

* 基本設定を継承 (`extends: "../base/.textlintrc.base.json"` - `presets/base/` から見た相対パス)
* `preset-wp-docs-ja`: WordPress 日本語ドキュメント用ルール

**使用例:**

```json
{
  "textlint.configPath": "./node_modules/@s2j/docs-linter/presets/wordpress/.textlintrc.wp.json"
}
```

**コマンドライン実行:**

```zsh
npm run lint:wp
```

### `presets/swift/.textlintrc.swift.json` - Xcode 開発用

Swift/SwiftUI アプリケーション開発に特化した設定です。

**含まれるルール:**

* 基本設定を継承 (`extends: "../base/.textlintrc.base.json"`)
* **`textlint-rule-preset-swift-docs-ja`**: Swift 日本語ドキュメント向けの textlint ルールプリセット
  * `prh` ルールで Swift 用語辞書 (`../../node_modules/textlint-rule-preset-swift-docs-ja/prh-rules/swift.yml`) を明示的に指定
  * ~~`preset-ja-technical-writing`: 技術文書の基本的なルール~~
  * `preset-jtf-style`: JTF 日本語標準スタイルガイド
    * ただし、`3.1.1.全角文字と半角文字の間`、`4.3.1.丸かっこ（）`、`4.2.7.コロン(：)`、`4.2.8.セミコロン(；)` は、除外。
    * `1.1.3.箇条書き`、`4.3.7.山かっこ<>` は、警告。

**主な機能:**

* Swift 関連用語の統一 (SwiftUI、UIKit、Xcode、Auto Layout など)
* Apple の日本語翻訳ガイドラインに準拠した用語チェック
* 半角カナ禁止、文体統一、句読点統一
* コードブロック周りのスペース、文の長さ制限
* 英単語前後のスペースチェック

**使用例:**

```json
{
  "textlint.configPath": "./node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json"
}
```

**コマンドライン実行:**

```zsh
npm run lint:swift
```

### 設定ファイルの配置 (任意)

プロジェクト直下に `.textlintrc.json` を置く場合は、パッケージ内プリセットを `extends` で参照できます。

```json
{
  "extends": ["./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"]
}
```

WordPress / Swift 向けは、次のファイルをコピーするか、上記と同様に `extends` で参照してください。

```zsh
cp node_modules/@s2j/docs-linter/presets/wordpress/.textlintrc.wp.json .textlintrc.wp.json
cp node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json .textlintrc.swift.json
```

### 設定ファイルの自動検出

`docs-linter` は以下の順序で、設定ファイルを検出します。

1. `./.textlintrc`
2. `./.textlintrc.json`
3. `./.textlintrc.jsonc`
4. `./.textlintrc.wp.json`
5. `./.textlintrc.swift.json`
7. `./tools/docs-linter/.textlintrc.local.json`
8. `./tools/docs-linter/presets/wordpress/.textlintrc.wp.json` あるいは `./tools/docs-linter/presets/swift/.textlintrc.swift.json`
9. `./tools/docs-linter/presets/base/.textlintrc.base.json` (フォールバック)

## 🔧 Editor-Specific Settings

代表的なエディターでの設定例を紹介します。

### VS Code / Cursor

`.vscode/settings.json` に以下を追記します。

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

「プロジェクト」が、WordPress 開発の場合は、「textlint.configPath」を `./.textlintrc.wp.json` に変更してください。
「プロジェクト」が、Swift 開発の場合は、「textlint.configPath」を `./.textlintrc.swift.json` に変更してください。

**エクステンション機能のインストール**

* [textlint](https://marketplace.visualstudio.com/items?itemName=taichi.vscode-textlint)

### JetBrains 製エディター (IntelliJ IDEA、WebStorm、PyCharm など)

**1. textlint プラグインのインストール**

* `File` → `Settings` → `Plugins` → `Marketplace` で "textlint" を検索してインストール

**2. 設定ファイルの指定**

* `File` → `Settings` → `Languages & Frameworks` → `textlint`
* `Configuration file` に `./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json` を指定

「プロジェクト」が、WordPress 開発の場合は、「Configuration file」を `./node_modules/@s2j/docs-linter/presets/wordpress/.textlintrc.wp.json` に変更してください。
Swift 開発の場合は、「Configuration file」を `./node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json` に変更してください。

**3. プロジェクト設定**

```json
// .idea/textlint.xml
<component name="TextlintConfiguration">
  <option name="configPath" value="./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json" />
  <option name="autoFix" value="true" />
</component>
```

「プロジェクト」が、WordPress 開発の場合は、「configPath」を `./node_modules/@s2j/docs-linter/presets/wordpress/.textlintrc.wp.json` に変更してください。
Swift 開発の場合は、「configPath」を `./node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json` に変更してください。

### Xcode

Xcode では直接 textlint を統合できませんが、以下の方法で利用できます。

**1. ターミナルでの実行**

```zsh
# プロジェクトルートで実行
cd /path/to/your/project
npm run lint:swift
```

**2. Xcode ビルドスクリプトでの自動実行**

* `Build Phases` → `+` → `New Run Script Phase`。
* スクリプトに以下を追加。

```zsh
if [ -f "docs-linter/package.json" ]; then
    cd docs-linter
    npm run lint:swift
fi
```

**3. 外部エディターとの併用**

* VS Code や JetBrains 製エディターで Markdown ファイルを編集
* リアルタイムで textlint チェックを実行

## 💻 Command-line execution

コマンドラインでの実行例です。

### npm パッケージの場合

**グローバル・インストールの場合**

```zsh
# プリセットを指定して lint 実行 (設定ファイルの自動解決)
s2j-docs-linter --profile base ./README.md ./docs/**/*.md
s2j-docs-linter --profile swift ./README.md ./docs/**/*.md
# WordPress (デフォルト)
s2j-docs-linter ./README.md ./docs/**/*.md
```

互換 CLI `docs-lint` でも同じ引数を指定できます。詳細は [npm 使い方ガイド](docs/npm_usage.md) を参照してください。

**プロジェクト依存の場合**

```zsh
npm run lint:docs
```

#### 環境チェック

設定内容や依存関係を確認したい場合は、下記の様に、`doctor` コマンドを利用します。`doctor` は設定ファイルを変更せず、診断のみを実施します。

```zsh
npx @s2j/docs-linter doctor
```

特定ディレクトリを診断する場合は、下記の様に `--path` 引数で指定します。

```zsh
npx @s2j/docs-linter doctor --path ./my-project
```

診断結果は、下記の形式で表示されます。

```text
✔ PASS Config
✔ PASS Preset
✔ PASS textlint
⚠ WARN VSCode
✖ FAIL Node.js
```

## 🛠️ Custom Rules

プロジェクト固有ルールを、カスタムルールとして追加できます。

### `presets/base/rules/no-long-kanji.js`

7文字以上の漢字が連続する場合に警告を出すルールです。

**例:**

```
❌ 日本語技術文書
✅ 日本語の技術文書
```

### `presets/swift/rules/space-around-english.js`

英単語の前後に適切なスペースが入っているかをチェックするルールです。

**例:**

```
❌ SwiftUIでアプリを作成する
✅ SwiftUI でアプリを作成する
```

### 利用側プロジェクトでの `.textlintrc` 例

* 1センテンスを100文字から150文字に制限緩和。
* 全角文字と半角文字の間にスペースを挟む。
* 全角括弧ではなく、半角括弧を使用。

```
{
  "filters": {},
  "rules": {
    "preset-ja-technical-writing": {
      "sentence-length": {
        "max": 150
      }
    },
    "preset-jtf-style": {
      "3.1.1.全角文字と半角文字の間": false,
      "4.3.1.丸かっこ（）": false
    },
    "no-dead-link": true,
    "ja-space-around-code": {
      "before": true,
      "after": true
    }
  }
}
```

## 💡 Examples (Usage Samples)

このリポジトリは、さまざまな開発環境向けの設定例を提供します。
各例には、Textlint 設定と GitHub Actions 用の CI テンプレートの両方が含まれています。

| 対象環境 | Textlint 設定ファイル | CI テンプレート | 概要 |
|---|---|---|---|
| 一般的な技術ドキュメント | [`examples/.textlintrc.jsonc`](examples/.textlintrc.jsonc) | [`examples/lint-docs.yml`](examples/lint-docs.yml) | 一般的なドキュメント・プロジェクト向けの基本設定。 |
| WordPress 開発 | [`examples/.textlintrc.wp.jsonc`](examples/.textlintrc.wp.jsonc) | [`examples/lint-docs.wp.yml`](examples/lint-docs.wp.yml) | WordPress プラグインまたはテーマのドキュメント用に調整されたルール (和訳スタイル)。 |
| Swift / SwiftUI 開発 | [`examples/.textlintrc.swift.jsonc`](examples/.textlintrc.swift.jsonc) | [`examples/lint-docs.swift.yml`](examples/lint-docs.swift.yml) | Apple 開発者向けドキュメントおよび技術用語向けに最適化されたルール。**textlint-rule-preset-swift-docs-ja** を統合。 |

## 📚 Glossary of Terms

共通用語集 (Swift/Xcode 用語など) について。

WordPress 用語集については、`node_modules/textlint-rule-preset-wp-docs-ja/prh-rules/wordpress.yml` を参照してください。

### Swift 用語集の統合

Swift 開発でよく使われる用語の統一ルールは、**`textlint-rule-preset-swift-docs-ja`** プリセットに統合されました。Swift 用語集については、`node_modules/textlint-rule-preset-swift-docs-ja/prh-rules/swift.yml` を参照してください。

**主な用語:**

* `SwiftUI` (<!-- textlint-disable -->Swift UI、swiftui<!-- textlint-enable --> を統一)
* `UIKit` (<!-- textlint-disable -->UI Kit<!-- textlint-enable --> を統一)
* `Xcode` (<!-- textlint-disable -->Xcode、Xcode<!-- textlint-enable --> を統一)
* `Auto Layout` (<!-- textlint-disable -->AutoLayout、Auto-Layout<!-- textlint-enable --> を統一)
* その他 Swift 関連用語

**カスタム用語の追加:**

プロジェクト固有の用語を追加する場合は、`presets/swift/dictionary/swift-terms.yml` に追加してください。

```yaml
version: 1
rules:
  - expected: "カスタム用語"
    patterns: ["カスタム用語の誤表記"]
```

## ⚡ CI/CD Integration

### 🚀 CI でのベストプラクティス

GitHub Actions での CI 実行時には、以下のベスト・プラクティスを推奨します。

* **textlint バージョンの固定**:
  * 破壊的アップデートの予防として、CI では `npm install textlint@15.4.0` を実行してバージョンを固定することを推奨。
* **npm キャッシュの最適化**:
  * `actions/cache@v4` を使用して `~/.npm` をキャッシュすることで、実行速度が約3倍になり、CI 失敗時のパッケージ破損防止にも効果的。
* **CI では docs のみを対象**:
  * `README.md` と `docs/**/*.md` を対象とし、自動 fix は off にする (他フォルダーへの影響を避ける lint という方針)。
* **Submodule は read-only 運用**:
  * 編集は原則として本体リポジトリで行い、利用側プロジェクトでの Submodule 内の直接編集を避けること。

詳細は [`docs/SPEC.md`](docs/SPEC.md) を参照してください。

## 🧭 Updates and Operations

### npm パッケージの場合

**グローバル・インストールの場合**

`package.json` 記載の範囲内でマイナーアップデートする場合は、下記の方法があります。

```zsh
# パッケージを最新化
npm update -g @s2j/docs-linter
```

**プロジェクト依存の場合**

`npm-check-updates` を利用して、一括してモジュールを更新できます。

```zsh
npx npm-check-updates -u
npm install
```

`package.json` 記載の範囲内でマイナーアップデートする場合は、下記の方法もあります。

```zsh
# パッケージを最新化
npm update @s2j/docs-linter
```

## ⚡ Practical Points

実務での使い方ヒント (CI 連携、PR チェックなど) について。

* **WordPress 開発者** は `.textlintrc.wp.json` を指定
* **Swift 開発者** は `.textlintrc.swift.json` を指定
* **Cursor/VS Code** は `.vscode/settings.json` の設定を自動で読み込み
* **全プロジェクト** で共通ルールを継承可能
* **Git submodule によりルール更新が一括反映**
* **`prelint:docs` によりサブモジュールの最新化が自動化**
* **npm パッケージにより簡単なインストールとアップデート**
* **Swift 開発では textlint-rule-preset-swift-docs-ja を活用**

## レガシー移行リファレンス (Git サブモジュール)

Git サブモジュールでの利用は、非推奨です。
新しいプロジェクトでは、npm パッケージのインストールを使用する必要があります。

手順の詳細は [docs/git_submodule.md](./docs/git_submodule.md) を参照してください。

## ロードマップ

* プロジェクトのロードマップと実装状況
  * [docs/archive/mod-npm/status.md](./docs/archive/mod-npm/status.md)
* ガバナンス
  * [メンテナンス方針](./docs/maintenance_policy.md)
  * [SemVer 方針](./docs/versioning_policy.md)

## ❓ FAQ

**Q: textlint が動作しない**

A: 以下の点を確認してください。

* `npm install` が完了しているか
* 設定ファイルのパスが正しいか
* エディターの textlint エクステンション機能がインストールされているか

**Q: カスタムルールが認識されない**

A: 設定ファイル内でカスタムルールのパスが正しく指定されているか確認してください。

**Q: 用語辞書が適用されない**

A: `prh` ルールの `rulePaths` に辞書ファイルのパスが正しく指定されているか確認してください。

**Q: `s2j-docs-linter` / `docs-lint` コマンドが動作しない**

A: 以下の点を確認してください。

* `npm install -g @s2j/docs-linter` でグローバルインストールされているか
* プロジェクトルートで実行しているか
* `node_modules` に必要な依存関係がインストールされているか

**Q: サブモジュールで `postinstall` が失敗する**

A: 以下の点を確認してください。

* サブモジュール内で `npm install` が完了しているか
* `dist/scripts/setup-npmignore.js` が存在するか
* パッケージのビルドが完了しているか (`npm run build` を実行)

**Q: `prelint:docs` が失敗する**

A: 以下の点を確認してください。

* サブモジュールが正しく初期化されているか
* ネットワーク接続が正常か
* サブモジュール内の `package-lock.json` が存在するか

**Q: `lint:docs` で古いルールが適用される**

A: `prelint:docs` が正常に実行されているか確認してください。このスクリプトにより、サブモジュールが最新化され、依存関係が再インストールされ、ビルドが実行されます。

**Q: npm パッケージで設定ファイルが見つからない**

A: 以下の点を確認してください。

* 設定ファイルをプロジェクトルートにコピーしているか
* 設定ファイルのパスが正しいか
* `node_modules/@s2j/docs-linter/` 内に設定ファイルが存在するか

**Q: プロジェクト依存でインストールした場合の使い方**

A: 以下の手順で設定してください。

1. `npm install --save-dev @s2j/docs-linter` でインストール
2. 設定ファイルをプロジェクトルートにコピー
3. `package.json` にスクリプトを追加
4. `npm run lint:docs` で実行

**Q: Swift 開発で textlint-rule-preset-swift-docs-ja が適用されない**

A: 以下の点を確認してください。

* `presets/swift/.textlintrc.swift.json` で `textlint-rule-preset-swift-docs-ja` が正しく継承されているか
* 依存関係が正しくインストールされているか
* 設定ファイルの構文が正しいか

**Q: サブモジュールの変更が反映されない**

A: 以下の手順を確認してください。

1. サブモジュール内で変更をコミット・プッシュしているか
2. 親リポジトリで `git submodule update --remote --merge` を実行しているか
3. 親リポジトリでサブモジュールの変更をコミットしているか

## Contributing

貢献をお待ちしています。**詳細は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。**

以下はクイックスタートです。

1. リポジトリをフォークしてください。
2. 機能ブランチを作成してください (`git checkout -b feature/amazing-feature`)。
3. 変更をコミットしてください (`git commit -m 'Add some amazing feature'`)。
4. 機能ブランチにプッシュしてください (`git push origin feature/amazing-feature`)。
5. Pull Request を開いてください。

### 開発ガイドライン

本プロジェクトは **textlint 用ルールセット** を提供することを目的としています。開発にあたっては以下のガイドラインに従ってください。

#### 依存更新時チェックリスト (daily routine / ncu 運用)

※ ここで、**ncu** とは [npm-check-updates](https://github.com/raineorshine/npm-check-updates) の略記です。

依存関係の定期更新時には、次の手順で進めると差分管理しやすくなります。

1. **作業ツリーを確認する**  
   * 先に未コミット変更を整理し、依存更新の差分と混ざらない状態にする。

2. **依存関係を更新する**  
   * `ncu` で更新候補を確認し、`ncu -u` で `package.json` を更新する。

3. **lockfile を再生成する**  
   * 通常は `npm install` で `package-lock.json` を最新化する。

**ただし** 本リポジトリは `github:...` 形式の Git 依存を含む。npm **11.12.0** 付近では、Git 依存の準備時に `--prefer-offline` / `--prefer-online` の扱いの不整合により `npm install` が失敗することがある (たとえば `git dep preparation failed` / `--prefer-online cannot be provided when using --prefer-offline`)。その場合は **グローバルの npm を下げずに**、次のスクリプトでインストールすること。

```zsh
npm run install:compat
```  

`install:compat` は、一時的に **npm v11.11.1** で `install` だけを実行。
**npm v11.12.0** 単体に起因する不具合は [npm/cli#9133](https://github.com/npm/cli/issues/9133) で追跡・クローズ済みで、**v11.12.1以降** では通常の `npm install` に戻せます (リリース後は `package.json` の `engines.npm` および `install:compat` / 本説明を見直してください)。
peer 依存の都合で通常の `npm install` が失敗する場合は、`npm install --legacy-peer-deps` を検討 (上記の Git 依存エラーとは別問題)。

4. **ビルド成果物を更新する**  
   * `npm run build` を実行し、`dist/` 配下を更新。

5. **差分を確認してコミットする**  
   * `package.json` / `package-lock.json` / ビルド成果物の差分が意図どおりか確認してからコミット。

公開時 (`npm pack` / `npm publish`) は `prepare` でビルドと `.npmignore` 生成が走るため、公開物の取りこぼしに注意してください。

#### npm リリース (メンテナー向け)

GitHub Actions による tag 連動 publish の手順は [docs/release.md](./docs/release.md) を参照してください。初回運用前にリポジトリ Secret `NPM_TOKEN` (npm automation token) の登録が必要です。

#### ルールの追加・修正

* **新しいルールの追加**:
  * 新しい textlint ルールを追加する際は、既存の設定ファイル構造を維持し、適切なディレクトリ (`presets/base/`、`presets/wordpress/`、`presets/swift/`) に配置してください。
* **既存ルールの修正**:
  * 既存のルールを修正する際は、後方互換性を考慮し、既存のユーザーに影響を与えないよう注意してください。
* **カスタムルールの開発**:
  * プロジェクト固有のカスタムルールを追加する場合は、`presets/base/rules/` または `presets/swift/rules/` ディレクトリに配置し、適切なテストを追加してください。
* **参考資料**:
  * textlint の公式ドキュメントや他のルールセット (たとえば [textlint-rule-preset-JTF-style](https://github.com/textlint-ja/textlint-rule-preset-JTF-style)、[textlint-rule-preset-ja-technical-writing](https://github.com/textlint-ja/textlint-rule-preset-ja-technical-writing)) を参考にしてください。

#### 設定ファイルの管理

* **設定ファイルの構造**:
  * 設定ファイルは JSON 形式で、`extends` を使用して基本設定を継承する構造を維持してください。
* **設定ファイルの命名**:
  * 設定ファイルは `.textlintrc.*.json` の命名規則に従ってください。
* **設定ファイルの配置**:
  * 各環境向けの設定ファイルは、適切なディレクトリ (`presets/base/`, `presets/wordpress/`, `presets/swift/`) に配置してください。

#### 用語辞書の管理

* **用語辞書の追加**:
  * 新しい用語を追加する場合は、適切な辞書ファイル (`presets/swift/dictionary/swift-terms.yml` など) に追加してください。
* **用語辞書の形式**:
  * 用語辞書は PRH (Proofreading Helper) 形式の YAML ファイルとして管理してください。
* **用語の統一**:
  * 既存の用語集と整合性を保ち、重複を避けてください。

#### テストと検証

* **テストの実施**:
  * 変更を加えた際は、必ずテストを実施し、既存の機能に影響がないことを確認してください。
* **lint の実行**:
  * 変更後は `npm run lint`、`npm run lint:wp`、`npm run lint:swift` を実行し、エラーがないことを確認してください。
* **ビルドの確認**:
  * `npm run build` を実行し、ビルドが正常に完了することを確認してください。

#### コードスタイル

* **コードの可読性**:
  * コードの可読性を保つため、統一されたコードスタイルを遵守してください。
* **コメントの追加**:
  * 複雑なロジックには適切なコメントを追加してください。
* **TypeScript の使用**:
  * 可能な限り TypeScript を使用し、型安全性を確保してください。

#### ドキュメントの更新

* **README の更新**:
  * 新機能や変更点がある場合は、README.md を適切に更新してください。
* **設定例の追加**:
  * 新しい設定オプションがある場合は、使用例を追加してください。
* **FAQ の更新**:
  * よくある質問がある場合は、FAQ セクションに追加してください。

#### 依存関係の管理

* **依存関係の追加**:
  * 新しい依存関係を追加する際は、`package.json` に適切に追加し、`package-lock.json` を更新してください。
* **依存関係の更新**:
  * 定期的に依存関係を更新し、セキュリティパッチを適用してください。手順の詳細は上記「依存更新時チェックリスト (daily routine / ncu 運用)」を参照してください。
* **`npm run install:compat`**:
  * Git 依存を含む状態で `npm install` が **npm v11.12.0** の不具合で失敗する場合の回避用です (上記チェックリストの手順3)。`package.json` の `engines.npm` が v11.12.0を弾くため、該当バージョンではインストール時に EBADENGINE 警告が出る。凌ぎが必要なら `scripts.install:compat` 内の `npm@11.11.1` を別の安全な版へ差し替えてください。
* **peer dependencies**:
  * 必要に応じて peer dependencies を適切に設定してください。

## Contributors & Developers

**"Docs Linter"** はオープンソース・ソフトウェアです。以下の皆様がこのプロジェクトに貢献しています。

* **開発者**: Koutarou ISHIKAWA

## 📄 License

本プロジェクトは GPL v3 以降の下でライセンスされています - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 💬 Support and Contact

サポート、機能リクエスト、またはバグ報告については、[GitHub Issues](https://github.com/stein2nd/docs-linter/issues) ページをご覧ください。
