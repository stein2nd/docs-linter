# 📘 Docs Linter

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![textlint](https://img.shields.io/badge/textlint-15.2.3-green.svg)](https://textlint.github.io/)
[![WordPress](https://img.shields.io/badge/WordPress-6.3+-blue.svg)](https://wordpress.org/)
[![Swift](https://img.shields.io/badge/Swift-5.9+-orange.svg)](https://swift.org/)
[![Xcode](https://img.shields.io/badge/Xcode-15.0+-blue.svg)](https://developer.apple.com/xcode/)

## Description

WordPress プラグイン／テーマ開発、Xcode (Swift/SwiftUI) アプリ開発の両方で利用可能です。
また、それらに関連するドキュメント制作での表記統一にも利用可能です。

## License

このプロジェクトは GPL v2以降の下でライセンスされています - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## Support and Contact

サポート、機能リクエスト、またはバグ報告については、[GitHub Issues](https://github.com/stein2nd/docs-linter/issues) ページをご覧ください。

## 利用方法

### 1. リポジトリの追加

```zsh
git submodule add https://github.com/stein2nd/docs-linter.git docs-linter
cd docs-linter
npm install
```

### 2. 設定ファイルの選択

プロジェクトの種類に応じて、適切な設定ファイルを選択してください。

## 設定ファイル一覧

### `base/.textlintrc.base.json` - 基本設定

すべてのプロジェクトで共通して使用する基本設定です。

**含まれるルール:**

* `preset-ja-technical-writing`: 技術文書の基本的なルール
* `preset-jtf-style`: JTF 日本語標準スタイルガイド
* `no-dead-link`: リンク切れチェック
* `no-long-kanji`: 7文字以上の漢字連続を禁止 (カスタムルール)

**使用例:**

```json
{
  "textlint.configPath": "./docs-linter/base/.textlintrc.base.json"
}
```

### `wordpress/.textlintrc.wp.json` - WordPress 開発用

WordPress プラグイン・テーマ開発に特化した設定です。

**含まれるルール:**

* 基本設定を継承
* `preset-wp-docs-ja`: WordPress 日本語ドキュメント用ルール
* `prh`: WordPress 用用語統一ルール

**使用例:**

```json
{
  "textlint.configPath": "./docs-linter/wordpress/.textlintrc.wp.json"
}
```

**コマンドライン実行:**

```zsh
npm run lint:wp
```

### `xcode/.textlintrc.xc.json` - Xcode 開発用

Swift/SwiftUI アプリ開発に特化した設定です。

**含まれるルール:**

* 基本設定を継承
* `prh`: Swift 用語統一ルール (`swift-terms.yml`)
* `terminology`: Swift 関連用語の統一
* `no-hankaku-kana`: 半角カナ禁止
* `no-mix-dearu-desumasu`: 文体統一 (ヘッダーは「ですます」、本文は「である」)
* `ja-space-arround-code`: コードブロック周りのスペース
* `ja-no-mixed-period`: 句読点統一
* `sentence-length`: 文の長さ制限 (120文字)
* `xcode/space-around-english`: 英単語前後のスペース (カスタムルール)

**使用例:**

```json
{
  "textlint.configPath": "./docs-linter/xcode/.textlintrc.xc.json"
}
```

**コマンドライン実行:**

```zsh
npm run lint:xcode
```

## エディター別設定

### VS Code / Cursor

`.vscode/settings.json` に以下の設定を追加してください:

```json
{
  "textlint.configPath": "./docs-linter/base/.textlintrc.base.json",
  "textlint.enable": true,
  "textlint.autoFixOnSave": true
}
```

**拡張機能のインストール:**

* [textlint](https://marketplace.visualstudio.com/items?itemName=taichi.vscode-textlint)

### JetBrains 製エディター (IntelliJ IDEA、WebStorm、PyCharm など)

**1. textlint プラグインのインストール:**

* `File` → `Settings` → `Plugins` → `Marketplace` で "textlint" を検索してインストール

**2. 設定ファイルの指定:**

* `File` → `Settings` → `Languages & Frameworks` → `textlint`
* `Configuration file` に `./docs-linter/base/.textlintrc.base.json` を指定

**3. プロジェクト設定:**

```json
// .idea/textlint.xml
<component name="TextlintConfiguration">
  <option name="configPath" value="./docs-linter/base/.textlintrc.base.json" />
  <option name="autoFix" value="true" />
</component>
```

### Xcode

Xcode では直接 textlint を統合できませんが、以下の方法で利用できます:

**1. ターミナルでの実行:**

```zsh
# プロジェクトルートで実行
cd /path/to/your/project
npm run lint:xcode
```

**2. Xcode ビルドスクリプトでの自動実行:**

* `Build Phases` → `+` → `New Run Script Phase`
* スクリプトに以下を追加:

```bash
if [ -f "docs-linter/package.json" ]; then
    cd docs-linter
    npm run lint:xcode
fi
```

**3. 外部エディターとの併用:**

* VS Code や JetBrains 製エディターで Markdown ファイルを編集
* リアルタイムで textlint チェックを実行

## カスタムルール

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

## 用語辞書

### `xcode/dictionary/swift-terms.yml`

Swift 開発でよく使われる用語の統一ルールを定義しています。

**主な用語:**

* `SwiftUI` (Swift UI, swiftui を統一)
* `UIKit` (UI Kit を統一)
* `Xcode` (Xcode, Xcode を統一)
* `Auto Layout` (AutoLayout, Auto-Layout を統一)
* その他 Swift 関連用語

## コマンドライン実行

```zsh
# 基本設定で実行
npm run lint

# WordPress 用設定で実行
npm run lint:wp

# Xcode 用設定で実行
npm run lint:xcode
```

## FAQ

**Q: textlint が動作しない**

A: 以下の点を確認してください:

* `npm install` が完了しているか
* 設定ファイルのパスが正しいか
* エディターの textlint 拡張機能がインストールされているか

**Q: カスタムルールが認識されない**

A: 設定ファイル内でカスタムルールのパスが正しく指定されているか確認してください。

**Q: 用語辞書が適用されない**

A: `prh` ルールの `rulePaths` に辞書ファイルのパスが正しく指定されているか確認してください。
