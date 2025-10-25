# 📘 Docs Linter

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![textlint](https://img.shields.io/badge/textlint-15.2.3-green.svg)](https://textlint.org/)
[![WordPress](https://img.shields.io/badge/WordPress-6.3+-blue.svg)](https://wordpress.org/)
[![Swift](https://img.shields.io/badge/Swift-5.9+-orange.svg)](https://www.swift.org/)
[![Xcode](https://img.shields.io/badge/Xcode-15.0+-blue.svg)](https://developer.apple.com/xcode/)
[![Vite](https://img.shields.io/badge/vite-7.1-blue.svg)](https://vite.dev)

## 📝 Description

Markdown ドキュメントを lint (構文・文体チェック) するためのルールセットです。
WordPress プラグイン/テーマ開発、Xcode (Swift/SwiftUI) アプリ開発の両方で利用可能です。
また、それらに関連するドキュメント制作での表記統一にも利用可能です。

## ⚙️ Installation

### 方法1.「Git サブモジュール」として利用する

### 1.1. リポジトリの追加 (既存プロジェクトに追加する場合)

既存プロジェクトの「tools」に追加すると仮定します。

```
other-project/
├┬─ tools/
│└─ docs-linter/  # 共通 lint モジュール
└── README.md
```

コマンドラインで下記のように実行します。

```zsh
# 既存プロジェクトの root に移動
cd /path/to/other-project

# docs-linter をサブモジュールとして追加
git submodule add https://github.com/stein2nd/docs-linter.git tools/docs-linter

# サブモジュールを初期化して取得
git submodule update --init --recursive

# npm を初期化してない場合は、このタイミングで実施
npm init -y
```

続いて、VS Code / Cursor 設定を追加します。
`.vscode/settings.json` に以下を追記します。
「既存プロジェクト」が、WordPress 開発の場合は、「textlint.configPath」を `./tools/docs-linter/wordpress/.textlintrc.wp.json` に変更してください。

```json
{
  "textlint.configPath": "./tools/docs-linter/base/.textlintrc.base.json",
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

「既存プロジェクト」の package.json に、スクリプトとして登録します (例は、「既存プロジェクト」が、WordPress 開発の場合)。
以降は、`npm run lint:docs` で lint 可能になります。

```json
{
  "scripts": {
    "postinstall": "cd tools/docs-linter && npm install",
    "prelint:docs": "git submodule update --remote --merge && cd tools/docs-linter && (npm ci || (rm -f package-lock.json && npm install)) && npm run build",
    "lint:docs": "NODE_PATH=./tools/docs-linter/node_modules textlint --config ./tools/docs-linter/wordpress/.textlintrc.wp.json ./README.md ./docs/**/*.md"
  }
}
```

サブモジュール内の依存 npm モジュールの導入などを行います。

```zsh
# サブモジュール内の依存 npm モジュールの導入、トランスパイル実行
npm run postinstall
```

以降は、`npm run prelint:docs` を実行することで、「Docs Linter」サブモジュールの最新化→依存関係の再インストール→トランスパイルが実行される様になります。

「既存プロジェクト」のリポジトリにコミットします。

```zsh
# ローカル・リポジトリに追加
git add .gitmodules tools/docs-linter .vscode/settings.json package.json
git commit -m "Add docs-linter as submodule for Markdown linting"

# リモート・リポジトリに反映
git push
```

### 1.2. リポジトリの追加 (新規プロジェクト作成と同時に追加する場合)

新規プロジェクトのリポジトリを作成します (例：`s2j-new-plugin`)。

```zsh
mkdir s2j-new-plugin
cd s2j-new-plugin
git init
```

新規プロジェクトの「tools」に追加すると仮定します。

```
s2j-new-plugin/
├┬─ tools/
│└─ docs-linter/  # 共通 lint モジュール
└── README.md
```

新規プロジェクトの root に移動し、コマンドラインで下記のように実行します。

```zsh
# docs-linter をサブモジュールとして追加
git submodule add https://github.com/stein2nd/docs-linter.git tools/docs-linter

# サブモジュールを初期化して取得
git submodule update --init --recursive

# npm を初期化
npm init -y

# スクリプトとして登録
npm pkg set scripts.postinstall="cd tools/docs-linter && npm install"
npm pkg set scripts.prelint:docs="git submodule update --remote --merge && cd tools/docs-linter && (npm ci || (rm -f package-lock.json && npm install)) && npm run build"
npm pkg set scripts.lint:docs="NODE_PATH=./tools/docs-linter/node_modules textlint --config ./tools/docs-linter/base/.textlintrc.base.json ./README.md ./docs/**/*.md"
```

「新規プロジェクト」が、WordPress 開発の場合は、上記の「base/.textlintrc.base.json」を `wordpress/.textlintrc.wp.json` に変更してください。

続いて、VS Code / Cursor 設定を追加します。
「新規プロジェクト」が、WordPress 開発の場合は、「textlint.configPath」を `./tools/docs-linter/wordpress/.textlintrc.wp.json` に変更してください。

```zsh
mkdir -p .vscode
cat <<'JSON' > .vscode/settings.json
{
  "textlint.configPath": "./tools/docs-linter/base/.textlintrc.base.json",
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
JSON
```

サブモジュール内の依存 npm モジュールの導入などを行います。

```zsh
# サブモジュール内の依存 npm モジュールの導入、トランスパイル実行
npm run postinstall
```

以降は、`npm run prelint:docs` を実行することで、「Docs Linter」サブモジュールの最新化→依存関係の再インストール→トランスパイルが実行される様になります。

「新規プロジェクト」のリポジトリにコミットします。

```zsh
# ローカル・リポジトリの main ブランチに追加
git add .
git commit -m "Initialize project with docs-linter submodule"
git branch -M main

# リモート・リポジトリを追加
git remote add origin https://github.com/stein2nd/s2j-new-plugin.git

# リモート・リポジトリの main ブランチに反映
git push -u origin main
```

### 方法2「npm パッケージ」として利用する

### 2.1. npm パッケージの追加 (グローバル・インストールする場合)

```zsh
# docs-linter をグローバル・インストール
npm install -g @stein2nd/docs-linter
```

インストール後、以下のコマンドで利用できます。

```zsh
# 基本設定で lint 実行
docs-lint

# 設定ファイル、対象ファイルを指定して lint 実行
docs-lint --config ./base/.textlintrc.base.json ./README.md ./docs/**/*.md
```

設定ファイルの選択肢は、他に WordPress 開発用 `/wordpress/.textlintrc.wp.json`、Xcode 開発用 `/xcode/.textlintrc.xc.json` があります。

### 2.2. npm パッケージの追加 (プロジェクト依存としてインストールする場合)

特定プロジェクト内でのみ使用する場合は、プロジェクト依存としてインストールします。

```zsh
# プロジェクトルートに移動
cd /path/to/your-project

# npm を初期化してない場合は、このタイミングで実施
npm init -y

# docs-linter をプロジェクト依存としてインストール
npm install --save-dev @stein2nd/docs-linter
```

プロジェクトの `package.json` に、スクリプトとして登録します。

**基本設定** を利用する場合は、下記になります。

```json
{
  "scripts": {
    "lint:docs": "docs-lint --config ./base/.textlintrc.base.json ./README.md ./docs/**/*.md"
  }
}
```

**WordPress 開発用設定** を利用する場合は、下記になります。

```json
{
  "scripts": {
    "lint:docs": "docs-lint --config ./wordpress/.textlintrc.wp.json ./README.md ./docs/**/*.md"
  }
}
```

**Xcode 開発用設定** を利用する場合は、下記になります。

```json
{
  "scripts": {
    "lint:docs": "docs-lint --config ./xcode/.textlintrc.xc.json ./README.md ./docs/**/*.md"
  }
}
```

### 2.3. 設定ファイルの配置

npm パッケージとして利用する場合、プロジェクト内に設定ファイルを配置する必要があります。

**基本設定を使用する場合:**

```zsh
# プロジェクトルートに設定ファイルをコピー
cp node_modules/@stein2nd/docs-linter/base/.textlintrc.base.json .textlintrc.json
```

**WordPress 開発用設定を使用する場合:**

```zsh
# プロジェクトルートに設定ファイルをコピー
cp node_modules/@stein2nd/docs-linter/wordpress/.textlintrc.wp.json .textlintrc.wp.json
```

**Xcode 開発用設定を使用する場合:**

```zsh
# プロジェクトルートに設定ファイルをコピー
cp node_modules/@stein2nd/docs-linter/xcode/.textlintrc.xc.json .textlintrc.xc.json
```

### 2.4. VS Code / Cursor 設定

`.vscode/settings.json` に以下を追記します。
「プロジェクト」が、WordPress 開発の場合は、「textlint.configPath」を `./.textlintrc.wp.json` に変更してください。Swift 開発の場合は、 `./.textlintrc.xc.json` に変更してください。

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

## 💡 Examples (Usage Samples)

このリポジトリは、さまざまな開発環境向けの設定例を提供します。
各例には、Textlint 設定と GitHub Actions 用の CI テンプレートの両方が含まれています。

| 対象環境 | Textlint 設定ファイル | CI テンプレート | 概要 |
|---|---|---|---|
| 一般的な技術ドキュメント | [`examples/.textlintrc.jsonc`](examples/.textlintrc.jsonc) | [`examples/lint-docs.yml`](examples/lint-docs.yml) | 一般的なドキュメント・プロジェクト向けの基本設定。 |
| WordPress 開発 | [`examples/.textlintrc.wp.jsonc`](examples/.textlintrc.wp.jsonc) | [`examples/lint-docs.wp.yml`](examples/lint-docs.wp.yml) | WordPress プラグインまたはテーマのドキュメント用に調整されたルール (和訳スタイル)。 |
| Swift / SwiftUI 開発 | [`examples/.textlintrc.swift.jsonc`](examples/.textlintrc.swift.jsonc) | [`examples/lint-docs.swift.yml`](examples/lint-docs.swift.yml) | Apple 開発者向けドキュメントおよび技術用語向けに最適化されたルール。**textlint-rule-preset-swift-docs-ja** を統合。 |

## 📋 List of Configuration Files

設定ファイルを、3つ用意してます。

### `base/.textlintrc.base.json` - 基本設定

すべてのプロジェクトで共通して使用する基本設定です。

**含まれるルール:**

* `preset-ja-technical-writing`: 技術文書の基本的なルール
* `preset-jtf-style`: JTF 日本語標準スタイルガイド
* `prh`: 用語統一ルール (空のルールパス)
* `no-dead-link`: リンク切れチェック

**使用例:**

```json
{
  "textlint.configPath": "./tools/docs-linter/base/.textlintrc.base.json"
}
```

### `wordpress/.textlintrc.wp.json` - WordPress 開発用

WordPress プラグイン・テーマ開発に特化した設定です。

**含まれるルール:**

* 基本設定を継承 (`extends: "../base/.textlintrc.base.json"`)
* `preset-wp-docs-ja`: WordPress 日本語ドキュメント用ルール

**使用例:**

```json
{
  "textlint.configPath": "./tools/docs-linter/wordpress/.textlintrc.wp.json"
}
```

**コマンドライン実行:**

```zsh
npm run lint:wp
```

### `xcode/.textlintrc.xc.json` - Xcode 開発用

Swift/SwiftUI アプリ開発に特化した設定です。

**含まれるルール:**

* 基本設定を継承 (`extends: "../base/.textlintrc.base.json"`)
* **`textlint-rule-preset-swift-docs-ja`**: Swift 日本語ドキュメント向けの textlint ルールプリセット
* `xcode/space-around-english`: 英単語前後のスペース (カスタムルール)

**主な機能:**

* Swift 関連用語の統一 (SwiftUI、UIKit、Xcode、Auto Layout など)
* Apple の日本語翻訳ガイドラインに準拠した用語チェック
* 半角カナ禁止、文体統一、句読点統一
* コードブロック周りのスペース、文の長さ制限
* 英単語前後のスペースチェック

**使用例:**

```json
{
  "textlint.configPath": "./tools/docs-linter/xcode/.textlintrc.xc.json"
}
```

**コマンドライン実行:**

```zsh
npm run lint:xcode
```

### 設定ファイルの自動検出

`docs-linter` は以下の順序で、設定ファイルを検出します。

1. `./.textlintrc`
2. `./.textlintrc.json`
3. `./.textlintrc.jsonc`
4. `./.textlintrc.wp.json`
5. `./.textlintrc.swift.json`
6. `./.textlintrc.xc.json`
7. `./tools/docs-linter/.textlintrc.local.json`
8. `./tools/docs-linter/wordpress/.textlintrc.wp.json` 或いは `./tools/docs-linter/xcode/.textlintrc.xc.json`
9. `./tools/docs-linter/base/.textlintrc.base.json` (フォールバック)

## 🔧 Editor-Specific Settings

代表的なエディターでの設定例を紹介します。

### VS Code / Cursor

`.vscode/settings.json` に以下の設定を追加してください。

```json
{
  "textlint.configPath": "./tools/docs-linter/base/.textlintrc.base.json",
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

「プロジェクト」が、WordPress 開発の場合は、「textlint.configPath」を `./tools/docs-linter/wordpress/.textlintrc.wp.json` に変更してください。
Swift 開発の場合は、「textlint.configPath」を `./tools/docs-linter/xcode/.textlintrc.xc.json` に変更してください。

**拡張機能のインストール:**

* [textlint](https://marketplace.visualstudio.com/items?itemName=taichi.vscode-textlint)

### JetBrains 製エディター (IntelliJ IDEA、WebStorm、PyCharm など)

**1. textlint プラグインのインストール:**

* `File` → `Settings` → `Plugins` → `Marketplace` で "textlint" を検索してインストール

**2. 設定ファイルの指定:**

* `File` → `Settings` → `Languages & Frameworks` → `textlint`
* `Configuration file` に `./tools/docs-linter/base/.textlintrc.base.json` を指定

「プロジェクト」が、WordPress 開発の場合は、「Configuration file」を `./tools/docs-linter/wordpress/.textlintrc.wp.json` に変更してください。
Swift 開発の場合は、「Configuration file」を `./tools/docs-linter/xcode/.textlintrc.xc.json` に変更してください。

**3. プロジェクト設定:**

```json
// .idea/textlint.xml
<component name="TextlintConfiguration">
  <option name="configPath" value="./tools/docs-linter/base/.textlintrc.base.json" />
  <option name="autoFix" value="true" />
</component>
```

「プロジェクト」が、WordPress 開発の場合は、「configPath」を `./tools/docs-linter/wordpress/.textlintrc.wp.json` に変更してください。
Swift 開発の場合は、「configPath」を `./tools/docs-linter/xcode/.textlintrc.xc.json` に変更してください。

### Xcode

Xcode では直接 textlint を統合できませんが、以下の方法で利用できます。

**1. ターミナルでの実行:**

```zsh
# プロジェクトルートで実行
cd /path/to/your/project
npm run lint:xcode
```

**2. Xcode ビルドスクリプトでの自動実行:**

* `Build Phases` → `+` → `New Run Script Phase`
* スクリプトに以下を追加：

```bash
if [ -f "docs-linter/package.json" ]; then
    cd docs-linter
    npm run lint:xcode
fi
```

**3. 外部エディターとの併用:**

* VS Code や JetBrains 製エディターで Markdown ファイルを編集
* リアルタイムで textlint チェックを実行

## 💻 Command-line execution

コマンドラインでの実行例です。

### Git サブモジュールの場合

```zsh
# 基本設定で実行
npm run lint:docs
```

### npm パッケージの場合

**グローバル・インストールの場合**

```zsh
# 設定ファイル、対象ファイルを指定して lint 実行
docs-lint --config ./base/.textlintrc.base.json ./README.md ./docs/**/*.md
```

設定ファイルの選択肢は、他に WordPress 開発用 `/wordpress/.textlintrc.wp.json`、Xcode 開発用 `/xcode/.textlintrc.xc.json` があります。

**プロジェクト依存の場合**

```zsh
npm run lint:docs
```

## 🛠️ Custom Rules

プロジェクト固有ルールを、カスタムルールとして追加できます。

### `base/rules/no-long-kanji.js`

7文字以上の漢字が連続する場合に警告を出すルールです。

**例:**

```
❌ 日本語技術文書
✅ 日本語の技術文書
```

### `xcode/rules/space-around-english.js`

英単語の前後に適切なスペースが入っているかをチェックするルールです。

**例:**

```
❌ SwiftUIでアプリを作成する
✅ SwiftUI でアプリを作成する
```

### 利用側プロジェクトでの `.textlintrc` 例

* 1センテンスを100文字から150文字に制限緩和
* 全角文字と半角文字の間にスペースを挟む
* 全角かっこではなく、半角かっこを使用する

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

## 📚 Glossary of Terms

共通用語集 (Swift/Xcode 用語など) について。

WordPress 用語集については、`node_modules/textlint-rule-preset-wp-docs-ja/prh-rules/wordpress.yml` を参照してください。

### Swift 用語集の統合

Swift 開発でよく使われる用語の統一ルールは、**`textlint-rule-preset-swift-docs-ja`** プリセットに統合されました。Swift 用語集については、`node_modules/textlint-rule-preset-swift-docs-ja/prh-rules/swift.yml` を参照してください。

**主な用語:**

* `SwiftUI` (Swift UI、swiftui を統一)
* `UIKit` (UI Kit を統一)
* `Xcode` (Xcode、Xcode を統一)
* `Auto Layout` (AutoLayout、Auto-Layout を統一)
* その他 Swift 関連用語

**カスタム用語の追加:**

プロジェクト固有の用語を追加する場合は、`xcode/dictionary/swift-terms.yml` に追加してください。

```yaml
version: 1
rules:
  - expected: "カスタム用語"
    patterns: ["カスタム用語の誤表記"]
```

## 🧭 Updates and Operations

### Git サブモジュールの場合

サブモジュール更新、ルール拡張、メンテナンス手順です。

| 操作 | コマンド |
| --- | --- |
| **サブモジュールを最新化** | `git submodule update --remote --merge` |
| **新しい環境で clone 後に初期化** | `git clone --recurse-submodules` |
| **すでに clone 済みの場合** | `git submodule update --init --recursive` |
| **lint 実行前にサブモジュールを最新化** | `npm run prelint:docs` |

💡 `docs-linter` 側のルール変更をすぐ反映したいときは、各プロジェクトで上記「prelint:docs」を実行します。

#### サブモジュールに変動が発生した場合の操作

サブモジュール内に変動が発生した場合の、対処操作の手順です。

```zsh
# 先にサブモジュールを最新化
cd tools/docs-linter && git add . && git commit -m "Update" && git pull && git push

# 自リポジトリに戻って、サブモジュール更新をコミット
cd .. && git add tools/docs-linter && git commit -m "Update submodule" && git push
```

**注意事項:**

* サブモジュール内の変更は **必ず先に** コミットする必要がある。
* 自リポジトリでサブモジュールの変更をコミットする前に、サブモジュール内の作業を完了させること。
* コミットメッセージは、実際の変更内容に合わせて適切に変更すること。

**トラブルシューティング:**

* サブモジュール内で未コミットの変更がある場合、自リポジトリでのサブモジュール更新が失敗する。
* サブモジュールの状態を確認するには `git submodule status` を使用すること。
* サブモジュールを特定のコミットに固定したい場合は `git submodule update --remote --merge` の代わりに `git submodule update` を使用すること。

### npm パッケージの場合

**グローバル・インストールの場合**

```zsh
# パッケージを最新化
npm update -g @stein2nd/docs-linter
```

**プロジェクト依存の場合**

```zsh
# パッケージを最新化
npm update @stein2nd/docs-linter
```

## ⚡ Practical Points

実務での使い方ヒント (CI 連携、PR チェックなど) について。

* **WordPress 開発者**は `.textlintrc.wp.json` を指定
* **Xcode/Swift 開発者**は `.textlintrc.xc.json` を指定
* **Cursor/VS Code** は `.vscode/settings.json` の設定を自動で読み込み
* **全プロジェクト** で共通ルールを継承可能
* **Git submodule によりルール更新が一括反映**
* **`prelint:docs` によりサブモジュールの最新化が自動化**
* **npm パッケージにより簡単なインストールとアップデート**
* **Swift 開発では textlint-rule-preset-swift-docs-ja を活用**

## ❓ FAQ

**Q: textlint が動作しない**

A: 以下の点を確認してください。

* `npm install` が完了しているか
* 設定ファイルのパスが正しいか
* エディターの textlint 拡張機能がインストールされているか

**Q: カスタムルールが認識されない**

A: 設定ファイル内でカスタムルールのパスが正しく指定されているか確認してください。

**Q: 用語辞書が適用されない**

A: `prh` ルールの `rulePaths` に辞書ファイルのパスが正しく指定されているか確認してください。

**Q: `docs-lint` コマンドが動作しない**

A: 以下の点を確認してください。

* `npm install -g @stein2nd/docs-linter` でグローバルインストールされているか
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
* `node_modules/@stein2nd/docs-linter/` 内に設定ファイルが存在するか

**Q: プロジェクト依存でインストールした場合の使い方**

A: 以下の手順で設定してください。

1. `npm install --save-dev @stein2nd/docs-linter` でインストール
2. 設定ファイルをプロジェクトルートにコピー
3. `package.json` にスクリプトを追加
4. `npm run lint:docs` で実行

**Q: Swift 開発で textlint-rule-preset-swift-docs-ja が適用されない**

A: 以下の点を確認してください。

* `xcode/.textlintrc.xc.json` で `textlint-rule-preset-swift-docs-ja` が正しく継承されているか
* 依存関係が正しくインストールされているか
* 設定ファイルの構文が正しいか

**Q: サブモジュールの変更が反映されない**

A: 以下の手順を確認してください。

1. サブモジュール内で変更をコミット・プッシュしているか
2. 親リポジトリで `git submodule update --remote --merge` を実行しているか
3. 親リポジトリでサブモジュールの変更をコミットしているか

## 💬 Support and Contact

サポート、機能リクエスト、またはバグ報告については、[GitHub Issues](https://github.com/stein2nd/docs-linter/issues) ページをご覧ください。

## 📄 License

このプロジェクトは GPL v2以降の下でライセンスされています - 詳細は [LICENSE](LICENSE) ファイルを参照してください。
