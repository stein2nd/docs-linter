# 📘 S2J Docs Linter - init コマンド

## CLI コマンド - init

### 1. 設計意図 (ゴール)

`init` コマンドは、S2J Docs Linter を利用するプロジェクトに対して、下記を目的として、推奨される初期設定ファイル群を生成するための骨組みコマンドです。

* textlint 導入時の初期設定を簡略化する
* VSCode との連携設定を標準化する
* GitHub Actions との連携設定を標準化する
* 設定ファイルの記述ミスを削減する
* npm パッケージとしての推奨構成を提供する
* 導入・検証・移行コストを低減する

### 2.1. 実行モード - 通常モード

指定されたディレクトリ (未指定時は、カレントディレクトリ) に対して、設定ファイルを生成します。

コマンド例…`npx s2j-docs-linter init`

### 2.2. 実行モード - Dry Run モード

Dry Run モードでは、設定ファイルは生成せず、生成予定の内容のみを表示します。つまり、ファイルシステムの変更を伴いません。

コマンド例…`npx s2j-docs-linter init --dry-run`

出力例は、下記の様になります。

```text
[Dry Run]

Preset:
  swift

Would create:
  .textlintrc.json
  .vscode/settings.json
  .github/workflows/docs-lint.yml

Would skip:
  (none)
```

Dry Run では **`--output` を指定できない** ため、存在確認および表示の基準ディレクトリは、常に **カレントディレクトリ** (`process.cwd()`) です。

`package.json` がカレントディレクトリに存在する場合、`Would create` または `Would skip` に `package.json scripts.lint:docs` を含めます。存在しない場合は `Would skip` に `(package.json not found)` 相当として扱い、ラベル `package.json scripts.lint:docs` を `Would skip` に列挙します。

Dry Run では **`Would skip` に該当が無い場合** は `(none)` を表示します。既存ファイルがある環境では `Would create` と `Would skip` が併存しても可とします (INIT-001 は「`Would create` が表示される」ことと「ファイル変更なし」を検証する)。

### 2.3. 実行モード - ディレクトリ出力モード

下記の用途で、指定されたディレクトリ配下に、設定ファイルを生成します。

* テンプレート検証
* CI スモークテスト
* プリセットごとの比較
* ドキュメント作成用サンプル生成

コマンド例…`npx s2j-docs-linter init --output .sandbox/swift`

生成先は、下記の様に、`.sandbox/` 配下を利用することを、ユーザーに推奨してください。

```text
docs-linter/
└┬─ .sandbox/
　├─ base/
　├─ swift/
　└─ wordpress/
```

`--output` に指定するパスは、**カレントディレクトリからの相対パス** (または絶対パス) として解決します。未存在の親ディレクトリは `mkdir -p` 相当で自動作成します。

生成ファイルの配置先は `{outputRoot}/` 配下です (たとえば、`--output .sandbox/base` の場合、`.sandbox/base/.textlintrc.json` が生成される)。

`package.json` の `scripts.lint:docs` 更新は、**`{outputRoot}/package.json`** を参照します (カレントディレクトリの `package.json` ではない点に注意)。

### 3.1. 引数 - --preset

下記の中から、利用するプリセットを指定します (デフォルトは、`base`)。

* base
* swift
* wordpress

コマンド例…`npx s2j-docs-linter init --preset swift`

### 3.2. 引数 - --output

出力先ディレクトリを指定します (未指定時は、カレントディレクトリ)。

コマンド例…`npx s2j-docs-linter init --output .sandbox/swift`

### 3.3. 引数 - --dry-run

生成予定の内容を表示し、ファイル生成は行いません。

コマンド例…`npx s2j-docs-linter init --dry-run`

### 3.4. 引数 - --force

既存ファイルの上書きを許可します。

コマンド例…`npx s2j-docs-linter init --force`、または、`npx s2j-docs-linter init --output .sandbox/swift --force`

### 3.5. 引数 - --help

`init` サブコマンドのヘルプを表示します。ファイル生成は行いません。

コマンド例…`npx s2j-docs-linter init --help`、または `npx s2j-docs-linter init -h`

### 3.6. 引数の記法

下記の `--key=value` 形式も受け付けます。

* `--preset=swift`
* `--output=.sandbox/swift`

`--preset` および `--output` に値が無い場合 (たとえば、`--preset` のみで終端) は、エラー終了 (exit code `1`) とします。

未対応のオプション名を指定した場合も、エラー終了 (exit code `1`) とします。

### 3.7. 引数の組み合わせ制約

`--dry-run` は、ファイルシステムを変更しないため、`--output` および `--force` と意味的に両立できません。

下記に挙げる「引数の組み合わせ」は、許可します。

* `npx s2j-docs-linter init`
* `npx s2j-docs-linter init --preset swift`
* `npx s2j-docs-linter init --output .sandbox/swift`
* `npx s2j-docs-linter init --output .sandbox/swift --force`
* `npx s2j-docs-linter init --force`
* `npx s2j-docs-linter init --dry-run`
* `npx s2j-docs-linter init --dry-run --preset swift` (および `--preset wordpress` 等、`--preset` のみの追加は可)

一方で、下記に挙げる「引数の組み合わせ」は、禁止します。不正な組み合わせが指定されたと見做し、エラー終了とする (その際の exit コードは、`1`)。

* `npx s2j-docs-linter init --dry-run --force`
* `npx s2j-docs-linter init --dry-run --output .sandbox/swift`
* `npx s2j-docs-linter init --dry-run --output .sandbox/swift --force`

エラーメッセージは、下記のいずれかとします (stderr)。

* `❌ --dry-run cannot be combined with --force.`
* `❌ --dry-run cannot be combined with --output.`
* `❌ --dry-run cannot be combined with --output and --force.`

### 3.8. 不正な preset 指定

`base` / `swift` / `wordpress` 以外を `--preset` に指定した場合は、エラー終了 (exit code `1`) とします。

stderr に `Invalid preset` を含むメッセージを表示します (たとえば、`❌ Invalid preset: invalid`)。

### 4. 上書きポリシー

標準動作では、既存ファイルを上書きしません。

上書きポリシーの対象は、下記4種類です。

* `.textlintrc.json`
* `.vscode/settings.json`
* `.github/workflows/docs-lint.yml`
* `package.json` の `scripts.lint:docs` (キーが既に存在する場合)

既存ファイル (または既存スクリプト) を検出した場合は、スキップとします。

```text
⚠ Skipped .textlintrc.json (already exists)
⚠ Skipped package.json scripts.lint:docs (already exists)
```

`--force` 指定時のみ、上書きとします。

```text
✔ Overwrite .textlintrc.json
✔ Overwrite package.json scripts.lint:docs
```

対象が存在しない場合の新規作成は、下記とします。

```text
✔ Created .textlintrc.json
✔ Created package.json scripts.lint:docs
```

### 4.1. 実行サマリー (通常モード)

通常モードでは、各対象の処理後に下記のサマリーを stdout に出力します。

```text
Done. 2 created/updated, 2 skipped.
```

(すべてスキップ等) 作成・更新が1件も無かった場合、**exit code は `0`** とし、追加で下記を表示します。

```text
⚠ No files were created or updated. Use --force to overwrite existing files.
```

### 5.1. 生成ファイル - `.textlintrc.json`

textlint の設定ファイルのテンプレートです。プリセット指定に応じて、適切な設定を生成します。

プリセット内容例は、下記の通りです。

```json
{
  "extends": [
    "./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"
  ]
}
```

### 5.1.1. init プリセットの選択

* `npx s2j-docs-linter init --preset base` 指定時
    * 対応するプリセットファイルは、`presets/base/.textlintrc.base.json`
    * 生成される `.textlintrc.json` の `extends` 配列の内容は、`"./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"`
* `npx s2j-docs-linter init --preset wordpress` 指定時
    * 対応するプリセットファイルは、`presets/wordpress/.textlintrc.wp.json`
    * 生成される `.textlintrc.json` の `extends` 配列の内容は、`"./node_modules/@s2j/docs-linter/presets/wordpress/.textlintrc.wp.json"`
* `npx s2j-docs-linter init --preset swift` 指定時
    * 対応するプリセットファイルは、`presets/swift/.textlintrc.swift.json`
    * 生成される `.textlintrc.json` の `extends` 配列の内容は、`"./node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json"`

### 5.2. 生成ファイル - `.vscode/settings.json`

VSCode 用 textlint 設定のテンプレートです。標準設定は、下記の通りです。

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

### 5.3. 生成ファイル - `.github/workflows/docs-lint.yml`

下記を目的とする、GitHub Actions 用ワークフローのテンプレートです。

* GitHub Actions 上での textlint 実行
* npm パッケージ版 S2J Docs Linter の利用例提供
* CI 導入の簡略化

標準構成は、下記の通りです。

* actions/checkout
* actions/setup-node
* npm ci
* npm run lint:docs

### 5.4. 生成 (更新) - `package.json` の `scripts.lint:docs`

上記3ファイルに加え、出力先ディレクトリ (`--output` 未指定時はカレントディレクトリ) の `package.json` に `scripts.lint:docs` を追加または更新します。

* 追加する値…`"s2j-docs-linter ./README.md ./docs/**/*.md"`。
* 生成される `.textlintrc.json` の `extends` がプリセットを決めるため、`--profile` は付けない。
* `package.json` が存在しない場合…スクリプト追加をスキップし、下記を表示する。

```text
⚠ Skipped package.json scripts.lint:docs (package.json not found)
```

* `scripts.lint:docs` が既にある場合…[上書きポリシー](#4-上書きポリシー)に従う (`--force` 時のみ上書き)。

JSON 更新時は `scripts` オブジェクトをマージし、他キーは保持します。フォーマットは `JSON.stringify` による2スペースインデント + 末尾改行とします。

### 6. テンプレートと実装

| 生成物 | 方式 |
| --- | --- |
| `.textlintrc.json` | コード生成 (`extends` は [init プリセットの選択](#511-init-プリセットの選択) のマッピング) |
| `.vscode/settings.json` | `src/templates/vscode.settings.json` → ビルド時 `dist/templates/` にコピー |
| `.github/workflows/docs-lint.yml` | `src/templates/docs-lint.yml` → 同上 |
| `package.json` `scripts.lint:docs` | 既存 `package.json` へのマージ (テンプレートファイルなし) |

実行時、CLI は `dist/templates/` からテンプレートをロードします (`npm run build` 内の `copy-templates` ステップ)。

## CLI コマンド - init テスト仕様

### 設計意図 (ゴール)

下記を対象に、`init` コマンドが仕様通りに設定ファイルを生成し、安全に利用できることを検証します。

* プリセットの選択
* 出力先の制御
* Dry Run の動作
* 上書きの制御
* 引数の組み合わせ制約
* 生成ファイルの内容

### 設計原則

* Dry Run を除き、実際にファイルを生成して検証する。
* テスト時は `.sandbox/` 配下を利用する。
* 可能な限り tarball (`npm pack`) または npm install 後の状態で検証する。

```text
docs-linter/
└┬─ .sandbox/
　├─ base/
　├─ swift/
　└─ wordpress/
```

### 自動テスト - 方針

`scripts/test-init.sh` を用意し、GitHub Actions ([ci.yml](../../.github/workflows/ci.yml)) から実行する。

ローカルでは、下記で同等の検証が可能です。

```zsh
npm run test:init
```

### 自動テスト - 実行方法

| 項目 | 内容 |
| --- | --- |
| エントリポイント | `node dist/bin/cli.js init ...` (`dist/bin/cli.js` は `npm run build` 後) |
| 作業ディレクトリ | リポジトリ root |
| 出力先 | `.sandbox/{base,swift,wordpress}/` (テスト開始時に当該配下を削除してから生成) |
| ビルド | スクリプト先頭で `npm run build --silent` を実行 |

`npx s2j-docs-linter` ではなく **`node dist/bin/cli.js`** を用いるのは、CI / ローカルで **ビルド直後の同一コミット** を検証するためです (tarball 検証は別途 `verify:tarball`)。

### 自動テスト - 非対象 (現行 INIT-001〜012)

下記は、現行テストケースの **明示的な検証対象外** です (実装は [生成 (更新) - `package.json` の `scripts.lint:docs`](#54-生成-更新---packagejson-の-scriptslintdocs) に従う)。

* `package.json` の `scripts.lint:docs` 追加・スキップ (`.sandbox/` 配下に `package.json` を置かないため)
* 通常モード (カレントディレクトリ直接生成、`--output` なし)
* `--help` / `-h`
* 実行サマリー (`Done. ...`) の文言

### 自動テスト - GitHub Actions 統合

[ci.yml](../../.github/workflows/ci.yml) の `Test init command` ステップで `bash scripts/test-init.sh` を実行します。

* 実行結果は、Node matrix (20 / 22 / 24) 各ジョブで INIT-001〜012が再現可能であること。

### 自動テスト - `.sandbox/` と Git 管理

* `.sandbox/` 配下の生成物は `.gitignore` 対象とする。
* リポジトリには `.sandbox/.gitkeep` のみを追跡し、テスト生成物をコミットしない。

### 自動テスト - 完了条件

下記を満たした場合、`init` コマンド実装完了とします。

* Dry Run モードが全テスト成功
* ディレクトリ出力モードが全テスト成功
* 上書き制御テスト成功
* 不正引数のテスト成功
* GitHub Actions 上で再現可能
* `.sandbox/` を利用した検証が可能

### テスト対象 - 実行モード

* 通常モード
* Dry Run モード
* ディレクトリ出力モード

### テスト対象 - 引数

* `--preset`
* `--output`
* `--dry-run`
* `--force`

### テストケース一覧

| ID | モード | 引数 | 期待結果 |
| ---- | --- | --- | --- |
| INIT-001 | Dry Run | なし | 生成予定ファイル一覧を表示 |
| INIT-002 | Dry Run | `--preset swift` | swift preset が表示される |
| INIT-003 | Dry Run | `--preset wordpress` | wordpress preset が表示される |
| INIT-004 | Output | `--output .sandbox/base` | base 用設定ファイル生成 · `extends` が base プリセット |
| INIT-005 | Output | `--preset swift --output .sandbox/swift` | swift 用設定ファイル生成 |
| INIT-006 | Output | `--preset wordpress --output .sandbox/wordpress` | wordpress 用設定ファイル生成 |
| INIT-007 | Output | `--output .sandbox/base` 再実行 | `⚠ Skipped` 表示 |
| INIT-008 | Output | `--output .sandbox/base --force` | `✔ Overwrite` 表示 |
| INIT-009 | Dry Run | `--dry-run --force` | エラー終了 |
| INIT-010 | Dry Run | `--dry-run --output .sandbox/base` | エラー終了 |
| INIT-011 | Dry Run | `--dry-run --output .sandbox/base --force` | エラー終了 |
| INIT-012 | Output | `--preset invalid` | エラー終了 |

### Dry Run モード検証 - INIT-001

* 実行…`npx s2j-docs-linter init --dry-run` (テストスクリプトでは `node dist/bin/cli.js init --dry-run`)
* 実行結果は、下記が全て成立すること
  * exit code が0である
  * ファイルシステムへの書き込みが発生しない (Dry Run のため)
  * stdout に `Would create` が含まれる
* 補足
  * リポジトリ root 等、既存ファイルとして `.textlintrc.json` が存在する環境では、`Would skip` として表示される可能性がある
  * 上記の可能性を考慮し、INIT-001 は **`Would create` の表示** と **非書き込み** をもって合格とする

### Dry Run モード検証 - INIT-002

* 実行…`npx s2j-docs-linter init --dry-run --preset swift`
* 実行結果は、下記が全て成立すること
  * exit code が0である
  * `Preset: swift` が表示される

### Dry Run モード検証 - INIT-003

* 実行…`npx s2j-docs-linter init --dry-run --preset wordpress`
* 実行結果は、下記が全て成立すること
  * exit code が0である
  * `Preset: wordpress` が表示される

### ディレクトリ出力モード検証 - INIT-004

* 実行…`npx s2j-docs-linter init --output .sandbox/base`
* 実行結果は、下記が全て成立すること
  * `.sandbox/base/.textlintrc.json` が生成される
  * `.sandbox/base/.vscode/settings.json` が生成される
  * `.sandbox/base/.github/workflows/docs-lint.yml` が生成される
  * `.sandbox/base/.textlintrc.json` の `extends[0]` が `./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json` である

### ディレクトリ出力モード検証 - INIT-005

* 実行…`npx s2j-docs-linter init --preset swift --output .sandbox/swift`
* 実行結果は、下記が全て成立すること
  * `.sandbox/swift/.textlintrc.json` が生成される
  * その内容は、下記である

```json
{
  "extends": [
    "./node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json"
  ]
}
```

### ディレクトリ出力モード検証 - INIT-006

* 実行…`npx s2j-docs-linter init --preset wordpress --output .sandbox/wordpress`
* 実行結果は、下記が全て成立すること
  * `.sandbox/wordpress/.textlintrc.json` が生成される
  * その内容は、下記である

```json
{
  "extends": [
    "./node_modules/@s2j/docs-linter/presets/wordpress/.textlintrc.wp.json"
  ]
}
```

### 上書き制御検証 - INIT-007

* 前提…`.sandbox/base` が生成済みである
* 実行…`npx s2j-docs-linter init --output .sandbox/base`
* 実行結果は、下記が全て成立すること
  * exit code が0である
  * `⚠ Skipped` が表示される

### 上書き制御検証 - INIT-008

* 前提…`.sandbox/base` が生成済みである
* 実行…`npx s2j-docs-linter init --output .sandbox/base --force`
* 実行結果は、下記が全て成立すること
  * exit code が0である
  * `✔ Overwrite` が表示される

### 不正引数の検証 - INIT-009

* 実行…`npx s2j-docs-linter init --dry-run --force`
* 実行結果は、下記が成立すること
  * exit code が0以外である

### 不正引数の検証 - INIT-010

* 実行…`npx s2j-docs-linter init --dry-run --output .sandbox/base`
* 実行結果は、下記が成立すること
  * exit code が0以外である

### 不正引数の検証 - INIT-011

* 実行…`npx s2j-docs-linter init --dry-run --output .sandbox/base --force`
* 実行結果は、下記が成立すること
  * exit code が0以外である

### 不正引数の検証 - INIT-012

* 実行…`npx s2j-docs-linter init --preset invalid`
* 実行結果は、下記が全て成立すること
  * exit code が0以外である
  * stderr に `Invalid preset` が含まれる

## 実装方針の補足 (init)

設計検討で確定した、init および CLI エントリポイントに関する方針です。詳細は [CLI コマンド - init](#cli-コマンド---init) および [CLI コマンド - init テスト仕様](#cli-コマンド---init-テスト仕様) を参照してください。

### プリセット `base` の位置づけ

`base` は、WordPress プラグイン/テーマや Swift アプリ/ツール向けではない、**一般的な Markdown 文書** 向けのプリセットとします。`init` のデフォルトプリセットは `base` です。

### init の終了コード

既存ファイルがあり `--force` もない場合、対象がすべてスキップされても **exit code は 0** とします ([実行サマリー (通常モード)](#41-実行サマリー-通常モード))。Dry Run および `--help` も exit code `0` です。不正な引数組み合わせ・不正 preset は exit code `1` です。

### CLI エントリポイント (`bin`) の切り替え

`init` 完成時に、`package.json` の `bin` を `dist/bin/run-textlint.js` から **`dist/bin/cli.js`** に切り替えます。

* `cli.ts` をサブコマンドルーターとし、`init` / `doctor` / lint (デフォルト) を振り分ける。
* 引数なし、またはサブコマンド以外の実行は、従来どおり lint として扱う (下位互換)。
* `doctor` 未実装時はルーターにスタブを置き、`doctor.ts` 完成後に差し替える。
