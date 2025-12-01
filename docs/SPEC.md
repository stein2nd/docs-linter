# 📘 **Docs Linter SPEC**

GitHub Actions での安定稼働を目標とした、**複数プリセット統合型 textlint 設計 / 運用ガイドライン** です。

## 🧭 1. 設計方針 (Overview)

| 項目 | 方針 |
| --- | --- |
| 目的 | 複数プリセット (例: Swift Docs / WordPress Docs) を統合し、汎用的に運用できる textlint 設計を提供 |
| 使用方法 | GitHub Submodule / npm / CI のいずれでも利用可能 |
| 主なユースケース | ドキュメント lint (Markdown / txt) をプロジェクト横断で統一 |
| CI 対応 | GitHub Actions による自動 lint 検証を安定稼働させる |

## 🧠 2. 運用ベスト・プラクティス

| 項目 | 推奨度 |
| --- | --- |
| `--config` 明示 | ⭐⭐⭐⭐⭐ |
| submodule は read-only 運用 | ⭐⭐⭐⭐ |
| プロジェクト固有ルールは `.textlintrc.local.json` に分離 | ⭐⭐⭐ |
| VSCode の自動 Fix | ⭐⭐ |
| npm publish 併用 (OSS 配布) | ⭐⭐⭐ |

## 🔚 3. 統合運用モデル

| レイヤー | 役割 |
| --- | --- |
| 🎯 Project | lint 対象 (`docs/**`) |
| 🧩 tools/docs-linter | 再利用モジュール |
| 🏗 GitHub Actions | CI 検証 |
| 🧑‍💻 VSCode | 開発者体験 |
| 🧪 npm scripts | CLI フロー |

これにより、**Docs Linter は Git Submodule / npm package のどちらにも適応可能**となり、**CI・VSCode・CLI すべてで統一した lint 体制が構築できます。**

## ⚠️ 4. CI における重要ポイント

| 設定項目 | 必須 / 任意 | 内容 |
|---|---|---|
| `--config` の明示 | **必須** | `textlint --config tools/docs-linter/.textlintrc.json` |
| submodule 再帰指定 | 🟡 推奨 | `actions/checkout@v4 with: submodules: recursive` |
| Node.js バージョン固定 | 🟡 推奨 | `node-version: 20` |
| **textlint バージョン固定** | **🟡 推奨** | **破壊的アップデートの予防として `npm install textlint@15.4.0` を実行** |
| **npm キャッシュ最適化** | **🟡 推奨** | **`actions/cache@v4` を使用して実行速度を約3倍向上、パッケージ破損防止** |
| `npm ci` fallback | 🟡 推奨 | npm install 失敗時の対策 |
| lint 対象パスは明示する | 🟢 任意 | `"docs/**/*.md"` など |
| **CI では docs のみを対象** | **🟡 推奨** | **`README.md` と `docs/**/*.md` を対象とし、自動 fix は off** |

## 📌 5. CI での安定稼働ポイント (Checklist)

| 安定化項目 | 推奨設定 |
| --- | --- |
| Node.js | `>=18` or `>=20` |
| Submodule | Checkout 時 `recursive` |
| textlint の設定ファイル | `--config` を必ず指定 |
| **textlint バージョン** | **CI では version pin が望ましい (例: `textlint@15.4.0`)** |
| **npm キャッシュ** | **`actions/cache@v4` で `~/.npm` をキャッシュ (`package-lock.json` のハッシュを key に使用)** |
| npm install | `npm ci` を優先 |
| PR トリガー | Markdown / docs フォルダに限定可 |
| **lint 対象** | **`README.md` と `docs/**/*.md` のみ (他フォルダに影響を与えない lint という方針)** |
| **自動 fix** | **CI では off (検証のみ)** |
| 保存修正 | `lint:fix` スクリプトで自動化可 (ローカル開発時のみ) |

---

## 6. 利用側プロジェクトでの設定 (submodule 運用)

利用側プロジェクトで、本プロジェクトを、「Git サブモジュール」として導入します。

```zsh
git submodule add https://github.com/stein2nd/docs-linter.git tools/docs-linter
```

### ⚠️ 6.0. Submodule 運用の基本方針

**Submodule は基本 read-only 運用とします。**

* **編集は原則、本リポジトリ (docs-linter) で実施してください**。
* 利用側プロジェクトでの Submodule 内の直接編集は避けてください。
* ルール変更や設定変更が必要な場合は、本リポジトリで変更し、利用側プロジェクトで `git submodule update --remote --merge` を実行し、更新を反映してください。

### 📌 6.1. Docs Linter の構造例 (submodule 運用)

```
project-root/
├── docs/  # lint 対象 (md / txt / 等)
├── package.json
├── .github/workflows/textlint.yml
└┬─ tools/
　└┬─ docs-linter/  # Submodule (本リポジトリ)
　　├── .textlintrc.json  # 総合プリセット設定
　　└┬─ presets/
　　　├─ swift/
　　　└─ wordpress/
```

### 🔧 6.2. 設定ファイル設計 (`.textlintrc`)

* 📌 **設定ファイルの名称の注意点**

| ファイル名 | textlint が自動検出するか否か | CI での利用 |
| --- | --- | --- |
| `.textlintrc` | ✔️ | 推奨 |
| `.textlintrc.json` | ✔️ | 推奨 |
| `.textlintrc.wp.json` / `.textlintrc.swift.json` | ❌ *自動検出されない* | **`--config` 指定必須** |

👉 textlint は自動検出に依存すべきではなく、**CI では常に `--config` を明記して、実行することが推奨されます**。

```bash
npx textlint --config tools/docs-linter/.textlintrc.swift.json ./docs/**/*.md
```

### 📌 6.3. プリセットの統合方法: `.textlintrc.json` (統合版例)

```jsonc
{
  "plugins": ["markdown"],
  "filters": {},
  "rules": {
    // Swift Docs 用プリセット
    "preset-swift-docs-ja": true,

    // WordPress Docs 用プリセット
    "preset-wp-docs-ja": true,

    // 共通
    "no-todo": true,
    "max-ten": {
      "max": 3
    }
  }
}
```

### 🧱 6.4. `package.json` でのスクリプト例 (S2J About Window より)

```json
{
  "scripts": {
    "lint:docs": "textlint --config tools/docs-linter/.textlintrc.json docs/**/*.md",
    "lint:fix":  "textlint --config tools/docs-linter/.textlintrc.json --fix docs/**/*.md"
  }
}
```

### 📌 6.5.. VSCode 連携 (推奨)

`.vscode/settings.json`

```json
{
  "textlint.configFile": "tools/docs-linter/.textlintrc.json",
  "editor.codeActionsOnSave": {
    "source.fixAll.textlint": true
  }
}
```

### 🚀 6.6. **CI 用 `.github/workflows/textlint.yml`** (GitHub Actions 専用版)

```yaml
name: Textlint (Docs Linter)

on:
  pull_request:
    paths:
      - "**/*.md"
      - "**/*.txt"
      - "docs/**"
      - "README.md"

jobs:
  lint-docs:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          submodules: "recursive"   # ← Docs Linter を Submodule で使う場合は必須

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      # npm キャッシュの最適化 (実行速度が約3倍になる、パッケージ破損防止にも効果的)
      - name: Cache npm dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.npm
          key: ${{ runner.os }}-npm-${{ hashFiles('package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-npm-

      - name: Install dependencies
        run: npm ci || npm install

      # textlint バージョンを固定 (破壊的アップデートの予防)
      - name: Install textlint (version pinned)
        run: npm install textlint@15.4.0

      # CI では docs のみを対象 (README.md と docs/**/*.md。自動 fix は off)
      - name: Run Docs Linter
        run: |
          npx textlint \
            --config tools/docs-linter/base/.textlintrc.base.json \
            ./README.md ./docs/**/*.md

      - name: Summary
        if: always()
        run: echo "Docs lint completed."
```

---

## 📌 7. まとめ (Best Practice)

**Docs Linter の設計指針**

1. **プリセットは分離しつつ統合可能に設計**
2. **`.textlintrc` 形式は自由にしてよい**
3. **ただし、CI では `--config` 強制指定** ← 最重要
4. Submodule / npm / GitHub Actions どれでも動作する形で提供
5. VSCode × textlint の相性は非常に良好 (推奨)

---

## 🎉 Appendix: Recommended npm Install

```bash
npm install --save-dev \
  textlint \
  textlint-plugin-markdown \
  textlint-rule-preset-swift-docs-ja \
  textlint-rule-preset-wp-docs-ja \
  @textlint/textlint-plugin-text \
  @textlint/ast-node-types
```
