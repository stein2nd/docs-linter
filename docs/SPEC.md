# 📘 **Docs Linter SPEC**

GitHub Actions での安定稼働を目標とした、**複数プリセット統合型 textlint 設計 / 運用ガイドライン** です。

## 🧭1. 概要・目的 (Overview)

| 項目 | 方針 |
| --- | --- |
| 目的 | 複数プリセット (例: Swift Docs / WordPress Docs) を統合し、汎用的に運用できる textlint 設計の提供 |
| 使用方法 | GitHub Submodule / npm / CI のいずれでも利用可能 |
| 主なユースケース | ドキュメント lint (Markdown / txt) をプロジェクト横断で統一 |
| CI 対応 | GitHub Actions による自動 lint 検証を安定稼働させる |

## 🏗️2. 設計方針・アーキテクチャー

### 2.1. 統合運用モデル

| レイヤ | 役割 |
| --- | --- |
| 🎯 Project | lint 対象 (`docs/**`) |
| 🧩 tools/docs-linter | 再利用モジュール |
| 🏗 GitHub Actions | CI 検証 |
| 🧑‍💻 VSCode | 開発者体験 |
| 🧪 npm scripts | CLI フロー |

これにより、**Docs Linter は Git Submodule / npm package のどちらにも適応可能**となり、**CI、VSCode、CLI すべてで統一した lint 体制が構築できます。**

## 🚀3. セットアップ・使用方法

### 3.1. Submodule として導入

利用側プロジェクトで、本プロジェクトを、「Git サブモジュール」として導入します。

```zsh
git submodule add https://github.com/stein2nd/docs-linter.git tools/docs-linter
```

### 3.2. Submodule 運用の基本方針

**Submodule は基本 read-only 運用とします。**

* **編集は原則、本リポジトリ (docs-linter) で実施してください**。
* 利用側プロジェクトでの Submodule 内の直接編集は避けてください。
* ルール変更や設定変更が必要な場合は、本リポジトリで変更し、利用側プロジェクトで `git submodule update --remote --merge` を実行し、更新を反映してください。

### 3.3. Docs Linter の構造例 (submodule 運用)

```
project-root/
├── docs/  # lint 対象 (md / txt / 等)
├── package.json
├── .github/workflows/textlint.yml
└┬─ tools/
　└┬─ docs-linter/  # Submodule (本リポジトリ)
　　└┬─ presets/
　　　├┬── base/
　　　│├── .textlintrc.base.json
　　　│└┬─ rules/
　　　│　└─ no-long-kanji.js
　　　├┬── swift/
　　　│├── .textlintrc.swift.json
　　　│├┬─ dictionary/
　　　││└─ swift-terms.yml
　　　│└┬─ rules/
　　　│　└─ space-around-english.js
　　　└┬── wordpress/
　　　　└── .textlintrc.wp.json
```

### 3.4. `package.json` でのスクリプト例

**基本設定を使用する場合:**

```json
{
  "scripts": {
    "lint:docs": "textlint --config tools/docs-linter/presets/base/.textlintrc.base.json docs/**/*.md",
    "lint:fix":  "textlint --config tools/docs-linter/presets/base/.textlintrc.base.json --fix docs/**/*.md"
  }
}
```

**WordPress 開発用設定を使用する場合:**

```json
{
  "scripts": {
    "lint:docs": "textlint --config tools/docs-linter/presets/wordpress/.textlintrc.wp.json docs/**/*.md",
    "lint:fix":  "textlint --config tools/docs-linter/presets/wordpress/.textlintrc.wp.json --fix docs/**/*.md"
  }
}
```

**Swift 開発用設定を使用する場合:**

```json
{
  "scripts": {
    "lint:docs": "NODE_PATH=./tools/docs-linter/node_modules textlint --config tools/docs-linter/presets/swift/.textlintrc.swift.json docs/**/*.md",
    "lint:fix":  "NODE_PATH=./tools/docs-linter/node_modules textlint --config tools/docs-linter/presets/swift/.textlintrc.swift.json --fix docs/**/*.md"
  }
}
```

### 3.5. VSCode 連携 (推奨)

`.vscode/settings.json`

**基本設定を使用する場合:**

```json
{
  "textlint.configPath": "./tools/docs-linter/presets/base/.textlintrc.base.json",
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

**WordPress 開発用設定を使用する場合:**

`textlint.configPath` を `./tools/docs-linter/presets/wordpress/.textlintrc.wp.json` に変更してください。

**Swift 開発用設定を使用する場合:**

`textlint.configPath` を `./tools/docs-linter/presets/swift/.textlintrc.swift.json` に変更してください。

## 🔧4. 設定・カスタマイズ

### 4.1. 設定ファイル設計 (`.textlintrc`)

* 📌 **設定ファイルの名称の注意点**

| ファイル名 | textlint が自動検出するか否か | CI での利用 |
| --- | --- | --- |
| `.textlintrc` | ✔️ | 推奨 |
| `.textlintrc.json` | ✔️ | 推奨 |
| `.textlintrc.wp.json` / `.textlintrc.swift.json` | ❌ *自動検出されない* | **`--config` 指定必須** |

👉 textlint は自動検出に依存すべきではなく、**CI では常に `--config` を明記して、実行することが推奨されます**。

```bash
npx textlint --config tools/docs-linter/presets/swift/.textlintrc.swift.json ./docs/**/*.md
```

### 4.2. プリセットの実際の構成

#### 4.2.1. `presets/base/.textlintrc.base.json` - 基本設定

すべてのプロジェクトで共通して使用する基本設定です。

**含まれるルール:**

* `preset-ja-technical-writing`: 技術文書の基本的なルール
* `preset-jtf-style`: JTF 日本語標準スタイルガイド
  * ただし、`3.1.1.全角文字と半角文字の間`、`4.3.1.丸かっこ（）`、`4.2.7.コロン(：)`、`4.2.8.セミコロン(；)` は、除外
* `prh`: 用語統一ルール (空のルールパス)
* `no-dead-link`: リンク切れチェック

#### 4.2.2. `presets/wordpress/.textlintrc.wp.json` - WordPress 開発用

WordPress プラグイン・テーマ開発に特化した設定です。

**含まれるルール:**

* 基本設定を継承 (`extends: ["../base/.textlintrc.base.json"]`)
* `preset-wp-docs-ja`: WordPress 日本語ドキュメント用ルール

#### 4.2.3. `presets/swift/.textlintrc.swift.json` - Xcode 開発用

Swift/SwiftUI アプリケーション開発に特化した設定です。

**含まれるルール:**

* 基本設定を継承 (`extends: ["../base/.textlintrc.base.json"]`)
* `preset-ja-technical-writing`: `false` (無効化)
* `preset-jtf-style`: JTF 日本語標準スタイルガイド
  * ただし、`3.1.1.全角文字と半角文字の間`、`4.3.1.丸かっこ（）`、`4.2.7.コロン(：)`、`4.2.8.セミコロン(；)` は、除外
  * `1.1.3.箇条書き`、`3.3.かっこ類と隣接する文字の間のスペースの有無`、`4.3.7.山かっこ<>` は、警告
* `preset-swift-docs-ja`: Swift 日本語ドキュメント向けの textlint ルールプリセット
  * `prh` ルールで Swift 用語辞書 (`../../node_modules/textlint-rule-preset-swift-docs-ja/prh-rules/swift.yml`) を明示的に指定

## ⚙️5. CI/CD 統合

### 5.1. CI における重要ポイント

| 設定項目 | 必須 / 任意 | 内容 |
|---|---|---|
| `--config` の明示 | **必須** | `textlint --config tools/docs-linter/presets/base/.textlintrc.base.json` (基本設定の場合) |
| submodule 再帰指定 | 🟡 推奨 | `actions/checkout@v4 with: submodules: recursive` |
| Node.js バージョン固定 | 🟡 推奨 | `node-version: 20` |
| **textlint バージョン固定** | **🟡 推奨** | **破壊的アップデートの予防として `npm install textlint@15.4.0` を実行** |
| **npm キャッシュ最適化** | **🟡 推奨** | **`actions/cache@v4` を使用して実行速度を約3倍向上、パッケージ破損防止** |
| `npm ci` fallback | 🟡 推奨 | npm install 失敗時の対策 |
| lint 対象パスは明示 | 🟢 任意 | `"docs/**/*.md"` など |
| **CI では docs のみを対象** | **🟡 推奨** | **`README.md` と `docs/**/*.md` を対象とし、自動 fix は off** |

### 5.2. CI 用 `.github/workflows/textlint.yml` (GitHub Actions 専用版)

実際の CI テンプレートは `examples/` ディレクトリに用意されています。

* `examples/lint-docs.yml` - 一般的なドキュメント・プロジェクト向けの基本設定
* `examples/lint-docs.wp.yml` - WordPress プラグインまたはテーマのドキュメント用
* `examples/lint-docs.swift.yml` - Swift / SwiftUI 開発向け

以下は、Swift 開発用の CI テンプレート例です。

```yaml
name: Docs Linter

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  docs-linter:
    runs-on: ubuntu-latest
    env:
      # docs-linter のディレクトリパス
      DOCS_LINTER_DIR: tools/docs-linter
      # プロジェクト・ルート (GitHub Actions のワークスペース)
      PROJECT_ROOT: ${{ github.workspace }}

    steps:
    - name: Checkout
      uses: actions/checkout@v4
      with:
        submodules: recursive

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    # npm キャッシュの最適化 (実行速度が約3倍になり、パッケージ破損防止にも効果的)
    - name: Cache npm dependencies
      uses: actions/cache@v4
      with:
        path: |
          ~/.npm
        key: ${{ runner.os }}-npm-${{ hashFiles('tools/docs-linter/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-npm-

    - name: Install dependencies
      run: |
        cd "$DOCS_LINTER_DIR"
        npm ci
        npm run build
        # 依存関係の確認
        echo "=== Checking installed packages ==="
        ls -la node_modules | head -20
        echo "=== Checking textlint ==="
        ./node_modules/.bin/textlint --version || echo "textlint not found"
        echo "=== Checking textlint rules ==="
        ls -d node_modules/textlint-rule-* 2>/dev/null | head -10 || echo "No textlint rules found"
        echo "=== Checking preset packages ==="
        ls -d node_modules/textlint-rule-preset-* 2>/dev/null || echo "No preset packages found"
        echo "=== Checking swift-docs-ja preset ==="
        ls -d node_modules/textlint-rule-preset-swift-docs-ja 2>/dev/null || echo "swift-docs-ja preset not found"
        echo "=== Checking if rules can be resolved ==="
        node -e "console.log(require.resolve('textlint-rule-preset-jtf-style'))" 2>&1 || echo "Cannot resolve preset-jtf-style"
        echo "=== Checking NODE_PATH ==="
        NODE_PATH=./node_modules node -e "console.log(require.resolve('textlint-rule-preset-jtf-style'))" 2>&1 || echo "Cannot resolve with NODE_PATH"

    - name: Show textlint config
      run: |
        shopt -s globstar nullglob
        # 対象ファイルを1つ選んで設定を確認 (docs-linter ディレクトリからの相対パス)
        TARGET_FILE=""
        if [ -f ../../README.md ]; then
          TARGET_FILE="../../README.md"
        elif [ -d ../../docs ]; then
          # 最初に見つかった Markdown ファイルを使用
          for file in ../../docs/**/*.md; do
            if [ -f "$file" ]; then
              TARGET_FILE="$file"
              break
            fi
          done
        fi
        if [ -n "$TARGET_FILE" ]; then
          echo "=== Debug extends resolving ==="
          CONFIG_PATH="./presets/swift/.textlintrc.swift.json"
          NODE_PATH=./node_modules npx textlint --print-config --config "$CONFIG_PATH" "$TARGET_FILE" 2>&1 | head -100 || true
        fi
      working-directory: ${{ env.DOCS_LINTER_DIR }}

    - name: Run docs linter
      run: |
        shopt -s globstar nullglob

        # 対象ファイルのパスを調整 (docs-linter ディレクトリからの相対パス)
        # docs-linterディレクトリは tools/docs-linter なので、プロジェクトルートへの相対パスは ../../
        LINT_TARGETS=()
        if [ -f ../../README.md ]; then
          LINT_TARGETS+=("../../README.md")
        fi
        if [ -d ../../docs ]; then
          for file in ../../docs/**/*.md; do
            [ -f "$file" ] && LINT_TARGETS+=("$file")
          done
        fi

        if [ ${#LINT_TARGETS[@]} -eq 0 ]; then
          echo "No target files found"
          exit 0
        fi

        echo "=== START textlint ==="
        echo "Target files: ${LINT_TARGETS[*]}"

        # 設定ファイルの存在確認
        echo "=== Checking config file ==="
        if [ -f ./presets/swift/.textlintrc.swift.json ]; then
          echo "Config file exists: ./presets/swift/.textlintrc.swift.json"
          cat ./presets/swift/.textlintrc.swift.json
        else
          echo "ERROR: Config file not found: ./presets/swift/.textlintrc.swift.json"
          exit 1
        fi

        # ベース設定ファイルの存在確認
        echo "=== Checking base config file ==="
        if [ -f ./presets/base/.textlintrc.base.json ]; then
          echo "Base config file exists: ./presets/base/.textlintrc.base.json"
          echo "Base config content:"
          cat ./presets/base/.textlintrc.base.json
        else
          echo "ERROR: Base config file not found: ./presets/base/.textlintrc.base.json"
          exit 1
        fi

        # 現在のディレクトリと NODE_PATH の確認
        echo "=== Current directory ==="
        pwd
        echo "=== NODE_PATH ==="
        NODE_MODULES_PATH="$(pwd)/node_modules"
        echo "NODE_PATH will be set to: $NODE_MODULES_PATH"
        echo "=== Verifying node_modules exists ==="
        ls -la "$NODE_MODULES_PATH" | head -5 || echo "node_modules not found"
        echo "=== Verifying rule packages exist ==="
        ls -d "$NODE_MODULES_PATH"/textlint-rule-preset-* 2>/dev/null | head -5 || echo "No preset packages found"
        echo "=== Testing rule package resolution ==="
        export NODE_PATH="$NODE_MODULES_PATH"
        node -e "console.log(require.resolve('textlint-rule-preset-jtf-style'))" 2>&1 || echo "Cannot resolve preset-jtf-style"
        echo "=== Verifying NODE_PATH is set ==="
        echo "NODE_PATH=$NODE_PATH"

        # textlint の設定解決を確認
        echo "=== Testing textlint config resolution ==="
        # NODE_PATH は絶対パスで指定する必要がある
        CONFIG_PATH="./presets/swift/.textlintrc.swift.json"
        export NODE_PATH="$NODE_MODULES_PATH"
        # node_modules/.bin/textlint を直接実行することで、NODE_PATH が正しく機能する
        TEXTLINT_BIN="./node_modules/.bin/textlint"
        if [ ! -f "$TEXTLINT_BIN" ]; then
          echo "ERROR: textlint binary not found at $TEXTLINT_BIN"
          exit 1
        fi

        # textlint がルールを解決できるかテスト
        echo "=== Testing rule resolution with NODE_PATH ==="
        export NODE_PATH="$NODE_MODULES_PATH"
        node -e "console.log('NODE_PATH:', process.env.NODE_PATH); console.log('Resolved preset-jtf-style:', require.resolve('textlint-rule-preset-jtf-style')); console.log('Resolved preset-ja-technical-writing:', require.resolve('textlint-rule-preset-ja-technical-writing'));" 2>&1 || echo "Rule resolution test failed"

        # textlint の設定解決をテスト (--rules-base-directoryなしで)
        echo "=== Testing textlint config resolution (without --rules-base-directory) ==="
        export NODE_PATH="$NODE_MODULES_PATH"
        "$TEXTLINT_BIN" --print-config --config "$CONFIG_PATH" "${LINT_TARGETS[0]}" 2>&1 | head -50 || echo "Config resolution test failed"

        # extends は設定ファイル (swift/.textlintrc.swift.json) 基準で解決されるため、
        # 実行対象の Markdown のパスは docs-linter/ からの相対パスにする必要がある
        echo "=== Running textlint ==="
        # NODE_PATH を環境変数として設定し、node_modules/.bin/textlint を直接実行することで、ルールパッケージが見つけられるようになる
        # --rules-base-directory オプションは使用せず、NODE_PATH のみでルールを解決する
        export NODE_PATH="$NODE_MODULES_PATH"
        echo "NODE_PATH: $NODE_PATH"
        echo "Config file: $CONFIG_PATH"
        echo "Target files: ${LINT_TARGETS[*]}"
        "$TEXTLINT_BIN" --config "$CONFIG_PATH" "${LINT_TARGETS[@]}"
      working-directory: ${{ env.DOCS_LINTER_DIR }}

    - name: Log summary
      if: always()
      run: |
        echo "=== textlint finished ==="
        echo "Exit code: $?"
```

---

## 📌6. ベストプラクティス・チェックリスト

### 6.1. 運用ベスト・プラクティス

| 項目 | 推奨度 |
| --- | --- |
| `--config` 明示 | ⭐⭐⭐⭐⭐ |
| submodule は read-only 運用 | ⭐⭐⭐⭐ |
| プロジェクト固有ルールは `.textlintrc.local.json` に分離 | ⭐⭐⭐ |
| VSCode の自動 Fix | ⭐⭐ |
| npm publish 併用 (OSS 配布) | ⭐⭐⭐ |

### 6.2. CI での安定稼働ポイント (Checklist)

| 安定化項目 | 推奨設定 |
| --- | --- |
| Node.js | `>=18` or `>=20` |
| Submodule | Checkout 時 `recursive` |
| textlint の設定ファイル | `--config` を必ず指定 |
| **textlint バージョン** | **CI では version pin が望ましい (例: `textlint@15.4.0`)** |
| **npm キャッシュ** | **`actions/cache@v4` で `~/.npm` をキャッシュ (`package-lock.json` のハッシュを key に使用)** |
| npm install | `npm ci` を優先 |
| PR トリガー | Markdown / docs フォルダーに限定可 |
| **lint 対象** | **`README.md` と `docs/**/*.md` のみ (他フォルダーに影響を与えない lint という方針)** |
| **自動 fix** | **CI では off (検証のみ)** |
| 保存修正 | `lint:fix` スクリプトで自動化可 (ローカル開発時のみ) |

---

## 📌7. まとめ (Best Practice)

**Docs Linter の設計指針**

1. **プリセットは分離しつつ統合可能に設計**
2. **`.textlintrc` 形式は自由にしてよい**
3. **ただし、CI では `--config` 強制指定** ← 最重要
4. Submodule / npm / GitHub Actions どれでも動作する形で提供
5. VSCode × textlint の相性は非常に良好 (推奨)

---

## 🎉8. 付録 (Appendix)

### 8.1. npm パッケージとしての利用

本プロジェクトは npm パッケージ `@stein2nd/docs-linter` としても配布を検討しています。

**インストール:**

```zsh
# グローバル・インストール
npm install -g @stein2nd/docs-linter

# プロジェクト依存としてインストール
npm install --save-dev @stein2nd/docs-linter
```

**使用方法:**

```zsh
# グローバル・インストールの場合
docs-lint --config ./presets/base/.textlintrc.base.json ./README.md ./docs/**/*.md

# プロジェクト依存の場合
npm run lint:docs
```

**設定ファイルの配置:**

npm パッケージとして利用する場合、プロジェクト内に設定ファイルを配置する必要があります。

```zsh
# 基本設定を使用する場合
cp node_modules/@stein2nd/docs-linter/presets/base/.textlintrc.base.json .textlintrc.json

# WordPress 開発用設定を使用する場合
cp node_modules/@stein2nd/docs-linter/presets/wordpress/.textlintrc.wp.json .textlintrc.wp.json

# Swift 開発用設定を使用する場合
cp node_modules/@stein2nd/docs-linter/presets/swift/.textlintrc.swift.json .textlintrc.swift.json
```

### 8.2. カスタムルール

プロジェクト固有のカスタムルールを追加できます。

**利用可能なカスタムルール:**

* `presets/base/rules/no-long-kanji.js` - 7文字以上の漢字が連続する場合に警告を出すルール
* `presets/swift/rules/space-around-english.js` - 英単語の前後に適切なスペースが入っているかをチェックするルール

**カスタムルールの追加方法:**

プロジェクト固有のカスタムルールを追加する場合は、`presets/base/rules/` または `presets/swift/rules/` ディレクトリに配置してください。

### 8.3. 用語辞書

**Swift 用語辞書:**

Swift 開発でよく使われる用語の統一ルールは、`textlint-rule-preset-swift-docs-ja` プリセットに統合されています。Swift 用語集については、`node_modules/textlint-rule-preset-swift-docs-ja/prh-rules/swift.yml` を参照してください。

プロジェクト固有の用語を追加する場合は、`presets/swift/dictionary/swift-terms.yml` に追加してください。

**WordPress 用語辞書:**

WordPress 用語集については、`node_modules/textlint-rule-preset-wp-docs-ja/prh-rules/wordpress.yml` を参照してください。
