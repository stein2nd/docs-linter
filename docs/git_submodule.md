# 📘 S2J Docs Linter — Git サブモジュールとして利用する

npm パッケージでの導入（推奨）は [README.md](../README.md) と [npm 使い方ガイド](./npm_usage.md) を参照してください。

## ⚙️ Installation

## 「Git サブモジュール」として利用する

> この方式は後方互換性の維持のために残されています。
> 新規導入では npm パッケージ版を推奨します。

⚠️ **Submodule 運用の基本方針**

**Submodule は基本 read-only 運用とします。**

* **編集は原則、本リポジトリ (docs-linter) で実施してください**。
* 利用側プロジェクトでの Submodule 内の直接編集は避けてください。
* ルール変更や設定変更が必要な場合は、本リポジトリで変更し、利用側プロジェクトで `git submodule update --remote --merge` を実行し、更新を反映してください。

### 1. リポジトリの追加 (既存プロジェクトに追加する場合)

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
git submodule update --init --recursive --remote

# npm を初期化してない場合は、このタイミングで実施
npm init -y
```

続いて、VS Code / Cursor 設定を追加します。
`.vscode/settings.json` に以下を追記します。
「既存プロジェクト」が、WordPress 開発の場合は、「textlint.configPath」を `./tools/docs-linter/presets/wordpress/.textlintrc.wp.json` に変更してください。

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

「既存プロジェクト」の package.json に、スクリプトとして登録します (例は、「既存プロジェクト」が、WordPress 開発の場合)。
以降は、`npm run lint:docs` で lint 可能になります。

```json
{
  "scripts": {
    "postinstall": "cd tools/docs-linter && npm install",
    "prelint:docs": "cd tools/docs-linter && git restore . && cd ../.. && git submodule update --remote --merge && cd tools/docs-linter && (npm ci || (rm -f package-lock.json && npm install)) && npm run build",
    "lint:docs": "NODE_PATH=./tools/docs-linter/node_modules textlint --config ./tools/docs-linter/presets/wordpress/.textlintrc.wp.json ./README.md ./docs/**/*.md"
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

### 2. リポジトリの追加 (新規プロジェクト作成と同時に追加する場合)

新規プロジェクトのリポジトリを作成します (たとえば `s2j-new-plugin`)。

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
npm pkg set scripts.lint:docs="NODE_PATH=./tools/docs-linter/node_modules textlint --config ./tools/docs-linter/presets/base/.textlintrc.base.json ./README.md ./docs/**/*.md"
```

「新規プロジェクト」が、WordPress 開発の場合は、上記の「presets/base/.textlintrc.base.json」を `presets/wordpress/.textlintrc.wp.json` に変更してください。

続いて、VS Code / Cursor 設定を追加します。
「新規プロジェクト」が、WordPress 開発の場合は、「textlint.configPath」を `./tools/docs-linter/presets/wordpress/.textlintrc.wp.json` に変更してください。

```zsh
mkdir -p .vscode
cat <<'JSON' > .vscode/settings.json
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

## 💻 Command-line execution

コマンドラインでの実行例です。

### Git サブモジュールの場合

```zsh
# 基本設定で実行
npm run lint:docs
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

💡 `docs-linter` 側のルール変更をすぐ反映したいときは、各プロジェクトで上記 `prelint:docs` を実行します。

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
* 自リポジトリでサブモジュールの変更をコミットする前に、サブモジュール内の作業を完了させるように。
* コミットメッセージは、実際の変更内容に合わせて適切に変更するように。

**トラブルシューティング:**

* サブモジュール内で未コミットの変更がある場合、自リポジトリでのサブモジュール更新が失敗する。
* サブモジュールの状態を確認するには `git submodule status` を使用するように。
* サブモジュールを特定のコミットに固定したい場合は `git submodule update --remote --merge` の代わりに `git submodule update` を使用するように。
