## S2J Docs Linter - CLI ツール仕様

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

#### CLI 命名規則

CLI コマンドには、一貫した命名規則を採用します。

下記を標準パターンとします。将来のコマンドも、同様の命名規則に従う必要があります。

```bash
npx s2j-docs-linter <command>
```

コマンド例は、下記が挙げられます。

```bash
npx s2j-docs-linter init
npx s2j-docs-linter doctor
```

下記がコマンド名の禁止事項になります。

* コマンドごとに別々のパッケージ化
* 一貫性のないコマンド名
* 隠れたコマンドの動作

#### 安全なファイル変更ポリシー

CLI は、既存ファイルがある場合、明示的に `--force` が付与された場合のみ、上書きを許可します。

プロジェクトルートに下記の既存ファイルが存在する場合は、上書きしません。

* `.textlintrc.json`
* `.vscode/settings.json`
* `.github/workflows/docs-lint.yml`
* `package.json` の `scripts.lint:docs` (当該キーのみ。`init` 実行時)

#### npm パッケージレイアウトへの準拠

CLI が生成する設定は、npm パッケージレイアウトを前提とします。

標準プリセットパスは、`./node_modules/@s2j/docs-linter/presets/...` とします。
旧 Git サブモジュールレイアウト `./tools/docs-linter/...` は、新規生成の対象としません。

#### 推奨されるデフォルト設定

CLI は、下記に挙げる推奨構成を生成します。すべての利用ケースの最適化よりも、標準ベストプラクティスを優先します。

* npm パッケージのインストール
* `.textlintrc.json`
* VSCode textlint 連携
* GitHub Actions のドキュメント lint ワークフロー

#### プリセットの選択方針

`init` は、プリセット (`base`、`wordpress`、`swift`) 対応とします。
プリセットのデフォルトは、`base` とします。
未対応プリセット指定時は、fail とします。

#### デフォルトでは、非対話型 UI

CLI は、CI / 自動化との互換性を考慮します。
標準は、`npx s2j-docs-linter init --preset swift` の様な「非対話型」での実行とします。
現状では、対話型 UI を必須としません。

#### 診断の透明性

`doctor` の診断結果は、曖昧な「サイレント・サクセス」を避け、`PASS`、`WARN`、`FAIL` に区分して明示します。

#### 隠れたネットワーク依存関係の排除

`init` / `doctor` では、下記を禁止事項とし、外部通信は不要です。

* テレメトリ
* バックグラウンドでのパッケージインストール
* リモート設定の取得

CLI は、ローカル優先とします。

#### ドキュメントの同期

CLI の挙動が変更された場合、下記の関連ドキュメントの更新が必要になります。

* README.md
* docsMod/npm_usage.md
* docsMod/cli_tooling_spec.md
* examples/

#### 後方互換性に関する方針

CLI コマンドの仕様は、安定性を重視します。
下記の様な破壊的変更については、SemVer ポリシーに従います。

* コマンド名の変更
* 引数名の変更
* 出力仕様の変更
* 生成ファイルの仕様の変更

#### 適用範囲

CLI の役割は、docs lint エコシステムに限定され、下記を対象とします。

* docs lint の導入支援
* 診断
* 設定のスケルトン生成

下記は、CLI の役割ではありません。

* npm publish
* リポジトリ管理
* GitHub 秘密情報の操作
* 任意のプロジェクトの自動化

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
│├┬─ bin/
││├─ init.ts
││└─ doctor.ts
│└┬─ templates/
│　├─ textlintrc.base.json
│　├─ vscode.settings.json
│　└─ docs-lint.yml
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

### CLI Entrypoint ポリシー

S2J Docs Linter CLI は、下記の様な、サブコマンドルーターを採用します。

```bash
npx s2j-docs-linter <command>
```

これにより、下記の様なコマンドとなります。

```bash
npx s2j-docs-linter init
npx s2j-docs-linter doctor
npx s2j-docs-linter lint
```

尚、引数なしの実行は、下位互換性のため、lint として扱います。

### 一時ワークスペースに関するポリシー

CLI が一時ワークスペースを必要とする場合、OS 固有のパスをハードコードしてはなりません。

下記の様な、「Node.js runtime API」の利用を標準とします。

```ts
os.tmpdir()
fs.mkdtemp()
```

つまり、下記の様な「固定パス」の使用を禁止します。

```text
/tmp
C:\Temp
```

### CLI コマンド - init

#### 1. 設計意図 (ゴール)

`init` コマンドは、S2J Docs Linter を利用するプロジェクトに対して、下記を目的として、推奨される初期設定ファイル群を生成するための骨組みコマンドです。

* textlint 導入時の初期設定を簡略化する
* VSCode との連携設定を標準化する
* GitHub Actions との連携設定を標準化する
* 設定ファイルの記述ミスを削減する
* npm パッケージとしての推奨構成を提供する
* 導入・検証・移行コストを低減する

#### 2.1. 実行モード - 通常モード

指定されたディレクトリ (未指定時は、カレントディレクトリ) に対して、設定ファイルを生成します。

コマンド例…`npx s2j-docs-linter init`

#### 2.2. 実行モード - Dry Run モード

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

#### 2.3. 実行モード - ディレクトリ出力モード

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

#### 3.1. 引数 - --preset

下記の中から、利用するプリセットを指定します (デフォルトは、`base`)。

* base
* swift
* wordpress

コマンド例…`npx s2j-docs-linter init --preset swift`

#### 3.2. 引数 - --output

出力先ディレクトリを指定します (未指定時は、カレントディレクトリ)。

コマンド例…`npx s2j-docs-linter init --output .sandbox/swift`

#### 3.3. 引数 - --dry-run

生成予定の内容を表示し、ファイル生成は行いません。

コマンド例…`npx s2j-docs-linter init --dry-run`

#### 3.4. 引数 - --force

既存ファイルの上書きを許可します。

コマンド例…`npx s2j-docs-linter init --force`、または、`npx s2j-docs-linter init --output .sandbox/swift --force`

#### 3.5. 引数 - --help

`init` サブコマンドのヘルプを表示します。ファイル生成は行いません。

コマンド例…`npx s2j-docs-linter init --help`、または `npx s2j-docs-linter init -h`

#### 3.6. 引数の記法

下記の `--key=value` 形式も受け付けます。

* `--preset=swift`
* `--output=.sandbox/swift`

`--preset` および `--output` に値が無い場合 (たとえば、`--preset` のみで終端) は、エラー終了 (exit code `1`) とします。

未対応のオプション名を指定した場合も、エラー終了 (exit code `1`) とします。

#### 3.7. 引数の組み合わせ制約

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

#### 3.8. 不正な preset 指定

`base` / `swift` / `wordpress` 以外を `--preset` に指定した場合は、エラー終了 (exit code `1`) とします。

stderr に `Invalid preset` を含むメッセージを表示します (たとえば、`❌ Invalid preset: invalid`)。

#### 4. 上書きポリシー

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

#### 4.1. 実行サマリー (通常モード)

通常モードでは、各対象の処理後に下記のサマリーを stdout に出力します。

```text
Done. 2 created/updated, 2 skipped.
```

(すべてスキップ等) 作成・更新が1件も無かった場合、**exit code は `0`** とし、追加で下記を表示します。

```text
⚠ No files were created or updated. Use --force to overwrite existing files.
```

#### 5.1. 生成ファイル - `.textlintrc.json`

textlint の設定ファイルのテンプレートです。プリセット指定に応じて、適切な設定を生成します。

プリセット内容例は、下記の通りです。

```json
{
  "extends": [
    "./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"
  ]
}
```

#### 5.1.1. init プリセットの選択

* `npx s2j-docs-linter init --preset base` 指定時
    * 対応するプリセットファイルは、`presets/base/.textlintrc.base.json`
    * 生成される `.textlintrc.json` の `extends` 配列の内容は、`"./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"`
* `npx s2j-docs-linter init --preset wordpress` 指定時
    * 対応するプリセットファイルは、`presets/wordpress/.textlintrc.wp.json`
    * 生成される `.textlintrc.json` の `extends` 配列の内容は、`"./node_modules/@s2j/docs-linter/presets/wordpress/.textlintrc.wp.json"`
* `npx s2j-docs-linter init --preset swift` 指定時
    * 対応するプリセットファイルは、`presets/swift/.textlintrc.swift.json`
    * 生成される `.textlintrc.json` の `extends` 配列の内容は、`"./node_modules/@s2j/docs-linter/presets/swift/.textlintrc.swift.json"`

#### 5.2. 生成ファイル - `.vscode/settings.json`

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

#### 5.3. 生成ファイル - `.github/workflows/docs-lint.yml`

下記を目的とする、GitHub Actions 用ワークフローのテンプレートです。

* GitHub Actions 上での textlint 実行
* npm パッケージ版 S2J Docs Linter の利用例提供
* CI 導入の簡略化

標準構成は、下記の通りです。

* actions/checkout
* actions/setup-node
* npm ci
* npm run lint:docs

#### 5.4. 生成 (更新) - `package.json` の `scripts.lint:docs`

上記3ファイルに加え、出力先ディレクトリ (`--output` 未指定時はカレントディレクトリ) の `package.json` に `scripts.lint:docs` を追加または更新します。

* 追加する値…`"s2j-docs-linter ./README.md ./docs/**/*.md"`。
* 生成される `.textlintrc.json` の `extends` がプリセットを決めるため、`--profile` は付けない。
* `package.json` が存在しない場合…スクリプト追加をスキップし、下記を表示する。

```text
⚠ Skipped package.json scripts.lint:docs (package.json not found)
```

* `scripts.lint:docs` が既にある場合…[上書きポリシー](#4-上書きポリシー)に従う (`--force` 時のみ上書き)。

JSON 更新時は `scripts` オブジェクトをマージし、他キーは保持します。フォーマットは `JSON.stringify` による2スペースインデント + 末尾改行とします。

#### 6. テンプレートと実装

| 生成物 | 方式 |
| --- | --- |
| `.textlintrc.json` | コード生成 (`extends` は [init プリセットの選択](#511-init-プリセットの選択) のマッピング) |
| `.vscode/settings.json` | `src/templates/vscode.settings.json` → ビルド時 `dist/templates/` にコピー |
| `.github/workflows/docs-lint.yml` | `src/templates/docs-lint.yml` → 同上 |
| `package.json` `scripts.lint:docs` | 既存 `package.json` へのマージ (テンプレートファイルなし) |

実行時、CLI は `dist/templates/` からテンプレートを読み込みます (`npm run build` 内の `copy-templates` ステップ)。

### CLI コマンド - init テスト仕様

#### 設計意図 (ゴール)

下記を対象に、`init` コマンドが仕様通りに設定ファイルを生成し、安全に利用できることを検証します。

* プリセットの選択
* 出力先の制御
* Dry Run の動作
* 上書きの制御
* 引数の組み合わせ制約
* 生成ファイルの内容

#### 設計原則

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

#### 自動テスト - 方針

`scripts/test-init.sh` を用意し、GitHub Actions ([ci.yml](../.github/workflows/ci.yml)) から実行する。

ローカルでは、下記で同等の検証が可能です。

```bash
npm run test:init
```

#### 自動テスト - 実行方法

| 項目 | 内容 |
| --- | --- |
| エントリポイント | `node dist/bin/cli.js init ...` (`dist/bin/cli.js` は `npm run build` 後) |
| 作業ディレクトリ | リポジトリ root |
| 出力先 | `.sandbox/{base,swift,wordpress}/` (テスト開始時に当該配下を削除してから生成) |
| ビルド | スクリプト先頭で `npm run build --silent` を実行 |

`npx s2j-docs-linter` ではなく **`node dist/bin/cli.js`** を用いるのは、CI / ローカルで **ビルド直後の同一コミット** を検証するためです (tarball 検証は別途 `verify:tarball`)。

#### 自動テスト - 非対象 (現行 INIT-001〜012)

下記は、現行テストケースの **明示的な検証対象外** です (実装は [生成 (更新) - `package.json` の `scripts.lint:docs`](#54-生成-更新---packagejson-の-scriptslintdocs) に従う)。

* `package.json` の `scripts.lint:docs` 追加・スキップ (`.sandbox/` 配下に `package.json` を置かないため)
* 通常モード (カレントディレクトリ直接生成、`--output` なし)
* `--help` / `-h`
* 実行サマリー (`Done. ...`) の文言

#### 自動テスト - GitHub Actions 統合

[ci.yml](../.github/workflows/ci.yml) の `Test init command` ステップで `bash scripts/test-init.sh` を実行します。

* 実行結果は、Node matrix (20 / 22 / 24) 各ジョブで INIT-001〜012が再現可能であること。

#### 自動テスト - `.sandbox/` と Git 管理

* `.sandbox/` 配下の生成物は `.gitignore` 対象とする。
* リポジトリには `.sandbox/.gitkeep` のみを追跡し、テスト生成物をコミットしない。

#### 自動テスト - 完了条件

以下を満たした場合、`init` コマンド実装完了とします。

* Dry Run モードが全テスト成功
* ディレクトリ出力モードが全テスト成功
* 上書き制御テスト成功
* 不正引数のテスト成功
* GitHub Actions 上で再現可能
* `.sandbox/` を利用した検証が可能

#### テスト対象 - 実行モード

* 通常モード
* Dry Run モード
* ディレクトリ出力モード

#### テスト対象 - 引数

* `--preset`
* `--output`
* `--dry-run`
* `--force`

#### テストケース一覧

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

#### Dry Run モード検証 - INIT-001

* 実行…`npx s2j-docs-linter init --dry-run` (テストスクリプトでは `node dist/bin/cli.js init --dry-run`)
* 実行結果は、下記が全て成立すること
  * exit code が0である
  * ファイルシステムへの書き込みが発生しない (Dry Run のため)
  * stdout に `Would create` が含まれる
* 補足
  * リポジトリ root 等、既存ファイルとして `.textlintrc.json` が存在する環境では、`Would skip` として表示される可能性がある
  * 上記の可能性を考慮し、INIT-001 は **`Would create` の表示** と **非書き込み** をもって合格とする

#### Dry Run モード検証 - INIT-002

* 実行…`npx s2j-docs-linter init --dry-run --preset swift`
* 実行結果は、下記が全て成立すること
  * exit code が0である
  * `Preset: swift` が表示される

#### Dry Run モード検証 - INIT-003

* 実行…`npx s2j-docs-linter init --dry-run --preset wordpress`
* 実行結果は、下記が全て成立すること
  * exit code が0である
  * `Preset: wordpress` が表示される

#### ディレクトリ出力モード検証 - INIT-004

* 実行…`npx s2j-docs-linter init --output .sandbox/base`
* 実行結果は、下記が全て成立すること
  * `.sandbox/base/.textlintrc.json` が生成される
  * `.sandbox/base/.vscode/settings.json` が生成される
  * `.sandbox/base/.github/workflows/docs-lint.yml` が生成される
  * `.sandbox/base/.textlintrc.json` の `extends[0]` が `./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json` である

#### ディレクトリ出力モード検証 - INIT-005

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

#### ディレクトリ出力モード検証 - INIT-006

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

#### 上書き制御検証 - INIT-007

* 前提…`.sandbox/base` が生成済みである
* 実行…`npx s2j-docs-linter init --output .sandbox/base`
* 実行結果は、下記が全て成立すること
  * exit code が0である
  * `⚠ Skipped` が表示される

#### 上書き制御検証 - INIT-008

* 前提…`.sandbox/base` が生成済みである
* 実行…`npx s2j-docs-linter init --output .sandbox/base --force`
* 実行結果は、下記が全て成立すること
  * exit code が0である
  * `✔ Overwrite` が表示される

#### 不正引数の検証 - INIT-009

* 実行…`npx s2j-docs-linter init --dry-run --force`
* 実行結果は、下記が成立すること
  * exit code が0以外である

#### 不正引数の検証 - INIT-010

* 実行…`npx s2j-docs-linter init --dry-run --output .sandbox/base`
* 実行結果は、下記が成立すること
  * exit code が0以外である

#### 不正引数の検証 - INIT-011

* 実行…`npx s2j-docs-linter init --dry-run --output .sandbox/base --force`
* 実行結果は、下記が成立すること
  * exit code が0以外である

#### 不正引数の検証 - INIT-012

* 実行…`npx s2j-docs-linter init --preset invalid`
* 実行結果は、下記が全て成立すること
  * exit code が0以外である
  * stderr に `Invalid preset` が含まれる

### CLI コマンド - doctor コマンド

本コマンドの目的は、下記を責務とする、環境診断です。

* 設定の検証
* 依存関係の検証
* CI 準備状況の検証

#### doctor チェック

下記を対象とします。

* Node.js バージョン
* textlint インストール
* `.textlintrc.json`
* プリセットの解決
* package.json
* VSCode 設定
* GitHub Actions ワークフロー

下記は、対象外とします。

* npm 利用可否
* @s2j/docs-linter インストール
* package.json スクリプト

#### 引数 --path

下記の様に、本コマンドが診断対象とする「プロジェクトルート」を指定します。

```bash
npx s2j-docs-linter doctor --path ./my-project
```

省略時は、カレントディレクトリ (`process.cwd()`) を診断対象とします。

依存関係の解決は、診断対象ディレクトリ配下を基準として行います。

#### doctor 出力ポリシー

doctor コマンドの結果は、`PASS`、`WARN`、`FAIL` に区分されます。

* ✔ は、PASS に対応
* ⚠ は、WARN に対応
* ✖ は、FAIL に対応

下記の形式で、1行につき1診断結果を出力します。

```
✔ PASS <Label>
⚠ WARN <Label>
✖ FAIL <Label>
```

下記は、表示例になります。

```text
✔ PASS Node.js
⚠ WARN GitHub Actions
✖ FAIL Preset
```

尚、`package.json` が存在しない場合、Node.js チェックは実施せず、診断結果として、下記を出力します。

```
✔ PASS Node.js (skip)
```

プリセットは、`.textlintrc.json` の存在するディレクトリを基準として extends の各エントリを解決します。
尚、`.textlintrc.json` が解決できない場合は、プリセット解決は、未評価とします。

プリセットの `extends` 解決について、下記の方針とします。

* extends は string または string[] を受け付ける。
* extends が未指定、空配列、または不正な型の場合は `✖ FAIL Preset` とする。
* extends に記載された全てのプリセットが解決できた場合のみ `✔ PASS Preset` とする。

`textlint` は、診断対象ディレクトリ配下の `node_modules` から解決できることを確認します。つまり、親ディレクトリの `node_modules` は参照しません。

#### doctor 総合結果

全チェック完了後に、総合結果を出力します。

```
✔ PASS
⚠ WARN
✖ FAIL
```

判定規則は、下記の通りです。

* FAIL が1件以上 → FAIL
* FAILなし、WARNあり → WARN
* PASSのみ → PASS

#### doctor 診断ラベル

| ラベル | 内容 |
| --- | --- |
| Node.js | engines.node 検証 |
| textlint | textlint インストール確認 |
| Config | .textlintrc.json 存在確認 |
| Preset | extends 解決確認 |
| VSCode | settings.json 確認 |
| GitHub Actions | docs-lint.yml 確認 |
| package.json | package.json 存在確認 |

#### doctor 終了コード

WARN は、利用者への注意喚起であり、コマンド失敗と見做しません。

| 状態 | 終了コード |
|--- | --- |
| PASS のみ | 0 |
| WARN のみ | 0 |
| FAIL を1件以上含む | 1 |
| 不正引数 | 1 |
| --help | 0 |

### CLI コマンド - doctor テスト仕様

#### 設計意図 (ゴール)

下記を対象に、`doctor` コマンドが利用環境を正しく診断し、利用者に適切な PASS / WARN / FAIL を通知できることを検証します。

* Node.js 環境
* npm 環境
* textlint 設定
* preset 解決
* VSCode 設定
* GitHub Actions 設定
* doctor 実行結果の整合性

#### 設計原則

* doctor は、診断専用とし、ファイルの破壊的変更 (つまり、生成、削除、変更) を行わない。
* 診断結果は、必ず、PASS / WARN / FAIL のいずれかに分類する。
* テスト時は、`.sandbox/doctor/` 配下を利用する。

#### 自動テスト - 方針

`scripts/test-doctor.sh` を用意し、`npm run test:doctor` で実行可能とします。

#### 自動テスト - 完了条件

以下を満たした場合、doctor コマンド実装完了とします。

* DOCTOR-001 ～ DOCTOR-015 成功
* GitHub Actions 上で再現可能
* PASS / WARN / FAIL が適切に分類される
* `.sandbox/doctor/` を利用した検証が可能
* `npm run test:doctor` が成功する

#### テスト対象 - Node.js 診断

* バージョン検出
* engines.node 準拠確認

#### テスト対象 - textlint 診断

* textlint インストール確認
* config 存在確認
* preset 解決確認

#### テスト対象 - VSCode 診断

* settings.json 存在確認
* textlint.configPath 確認

#### テスト対象 - GitHub Actions 診断

* docs-lint workflow 存在確認

#### validated フィクスチャ

DOCTOR-001 の正常環境で利用する本フィクスチャは、下記ディレクトリとします。本フィクスチャは、DOCTOR-001 の全 PASS を保証する基準環境とします。

`scripts/fixtures/doctor/pass/`

その構成は、下記の通りです。

```
scripts/fixtures/doctor/pass/
├─ package.json
├─ .textlintrc.json
├┬─ .vscode/
│└─ settings.json
└┬─ .github/
　└┬─ workflows/
　　└─ docs-lint.yml
```

#### 依存関係の解決

doctor コマンドは、診断対象ディレクトリ直下の `node_modules` のみを検査対象とします。親ディレクトリの `node_modules` は参照しません。

textlint の存在確認は、Node.js のモジュール解決 (`require.resolve` 等) を利用せず、診断対象ディレクトリ配下を明示的に確認します。

#### テストケース一覧

| ID | 項目 | 期待結果 |
| --- | --- | --- |
| DOCTOR-001 | 正常環境 | PASS |
| DOCTOR-002 | Node.js バージョン適合 | PASS |
| DOCTOR-003 | textlint 設定あり | PASS |
| DOCTOR-004 | preset 解決成功 | PASS |
| DOCTOR-005 | VSCode 設定あり | PASS |
| DOCTOR-006 | workflow 存在 | PASS |
| DOCTOR-007 | .textlintrc.json 不在 | FAIL |
| DOCTOR-008 | preset パス不正 | FAIL |
| DOCTOR-009 | textlint 未導入 | FAIL |
| DOCTOR-010 | package.json 不在 | WARN |
| DOCTOR-011 | VSCode 設定なし | WARN |
| DOCTOR-012 | workflow なし | WARN |
| DOCTOR-013 | Node.js バージョン不足 | FAIL |
| DOCTOR-014 | 不正引数 | FAIL |
| DOCTOR-015 | doctor 自体のヘルプ表示 | PASS |

#### 総合検証 - DOCTOR-001「正常環境」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/pass` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `--path` で指定した `.sandbox/doctor/pass/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

期待結果は、下記の通りです。

* `✔ PASS` である。
  * `✔ PASS package.json`、`✔ PASS Config`、`✔ PASS Preset`、`✔ PASS VSCode`、`✔ PASS GitHub Actions`、`✔ PASS Node.js`、`✔ PASS textlint` を網羅し、`⚠ WARN`、`✖ FAIL` ではないことを示す。
* 終了コードが `0` である。

#### Node.js 検証 - DOCTOR-002「Node.js バージョン適合」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。
  2. 下記ファイルの `engines.node` 値に、`>=20` を記載する。
    * `.sandbox/doctor/pass/package.json`

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/pass` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `--path` で指定した `.sandbox/doctor/pass/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

期待結果は、下記の通りです。

* `✔ PASS Node.js` である。

#### Node.js 検証 - DOCTOR-013「Node.js バージョン不足」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。
  2. 下記ファイルの `engines.node` 値に、`>=99` を記載する。
    * `.sandbox/doctor/pass/package.json`

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/pass` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `--path` で指定した `.sandbox/doctor/pass/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

* 判定意図…「事前バリデーション」が正しく動作するか否かの確認。
  * `process.version` が、「下記ファイルの `engines.node` 値に記載の node バージョンを満たす」に失敗する。
    * `.sandbox/doctor/pass/package.json`

期待結果は、下記の通りです。

* `✖ FAIL Node.js` である。

#### Node.js 検証 - DOCTOR-010「package.json 不在」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。
  2. 下記ファイルを削除する。
    * `.sandbox/doctor/pass/package.json`

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/pass` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `--path` で指定した `.sandbox/doctor/pass/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

* 判定意図…「事前バリデーション」が正しく動作するか否かの確認。
  * 下記ファイルが、`exists()` で失敗する。
    * `.sandbox/doctor/pass/package.json`

期待結果は、下記の通りです。

* `✔ PASS Node.js (skip)` である。
* `⚠ WARN package.json` である。
* `⚠ WARN` である。

#### textlint 検証 - DOCTOR-009「textlint 未導入」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。
  2. 下記ファイルを生成する。
    * `.sandbox/doctor/no-textlint/package.json`
  3. 下記フォルダを生成する (空の状態にする)。
    * `.sandbox/doctor/no-textlint/node_modules`
  4. 下記ファイルの `dependencies` 値に、ブランク `{}` を記載する。
    * `.sandbox/doctor/no-textlint/package.json`

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/no-textlint` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `--path` で指定した `.sandbox/doctor/no-textlint/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

* 判定意図…「事前バリデーション」が正しく動作するか否かの確認。
  * 「npm モジュール `textlint` が、`.sandbox/doctor/no-textlint/package.json` または `.sandbox/doctor/no-textlint/node_modules` から解決できる」に失敗する。

期待結果は、下記の通りです。

* `✖ FAIL textlint` である。

#### textlint 検証 - DOCTOR-003「textlint 設定あり」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/pass` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `--path` で指定した `.sandbox/doctor/pass/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

* 判定意図…「事前バリデーション」が正しく動作するか否かの確認。
  * 下記ファイルが、`exists()` で成功する。
    * `.sandbox/doctor/pass/.textlintrc.json`

期待結果は、下記の通りです。

* `✔ PASS Config` である。

#### textlint 検証 - DOCTOR-007「.textlintrc.json 不在」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。
  2. 下記ファイルを削除する。
    * `.sandbox/doctor/pass/.textlintrc.json`

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/pass` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `--path` で指定した `.sandbox/doctor/pass/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

* 判定意図…「事前バリデーション」が正しく動作するか否かの確認。
  * 下記ファイルが、`exists()` で失敗する。
    * `.sandbox/doctor/pass/.textlintrc.json`

期待結果は、下記の通りです。

* `✖ FAIL Config` である。
* 終了コードが `1` である。

#### プリセット検証 - DOCTOR-004「preset 解決成功」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。
  2. 下記ファイルの `extends` 配列に、実在する「プリセット」ファイルを記載する。
    * `.sandbox/doctor/pass/.textlintrc.json`
    * 「実在するプリセットファイル」とは、「利用側」と「本開発プロジェクト側」とでは異なる。
      * 利用側の場合…`"./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"` を指す。
      * 本開発プロジェクト側…`"./presets/base/.textlintrc.base.json"` を指す。

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/pass` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `--path` で指定した `.sandbox/doctor/pass/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

* 判定意図…「事前バリデーション」が正しく動作するか否かの確認。
  * 下記ファイルの `extends` 配列に記載する「プリセット」ファイルが、`fs.existsSync()` で成功する (つまり、プリセットファイルを解決できる)。
    * `.sandbox/doctor/pass/.textlintrc.json`

期待結果は、下記の通りです。

* `✔ PASS Preset` である。

#### プリセット検証 - DOCTOR-008「preset パス不正」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。
  2. 下記ファイルの `extends` 配列に、実在しない「プリセット」ファイルを記載する。
    * `.sandbox/doctor/pass/.textlintrc.json`
    * 「実在しないプリセットファイル」とは、「利用側」と「本開発プロジェクト側」とでは異なる。
      * 利用側の場合…`"./node_modules/@s2j/docs-linter/presets/invalid/config.json"` を指す。
      * 本開発プロジェクト側…`"./presets/invalid/config.json"` を指す。

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/pass` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `--path` で指定した `.sandbox/doctor/pass/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

* 判定意図…「事前バリデーション」が正しく動作するか否かの確認。
  * 下記ファイルの `extends` 配列に記載する「プリセット」ファイルが、`fs.existsSync()` で失敗する (つまり、プリセットファイルを解決できない)。
    * `.sandbox/doctor/pass/.textlintrc.json`

期待結果は、下記の通りです。

* `✖ FAIL Preset` である。

#### VSCode 検証 - DOCTOR-005「VSCode 設定あり」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/pass` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `--path` で指定した `.sandbox/doctor/pass/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

* 判定意図…「事前バリデーション」が正しく動作するか否かの確認。
  * 下記ファイルが、`exists()` で成功する。
    * `.sandbox/doctor/pass/.vscode/settings.json`

期待結果は、下記の通りです。

* `✔ PASS VSCode` である。

#### VSCode 検証 - DOCTOR-011「VSCode 設定なし」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。
  2. 下記ファイルを削除する。
    * `.sandbox/doctor/pass/.vscode/settings.json`

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/pass` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `--path` で指定した `.sandbox/doctor/pass/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

* 判定意図…「事前バリデーション」が正しく動作するか否かの確認。
  * 下記ファイルが、`exists()` で失敗する。
    * `.sandbox/doctor/pass/.vscode/settings.json`

期待結果は、下記の通りです。

* `⚠ WARN VSCode` である。

#### GitHub Actions 検証 - DOCTOR-006「workflow 存在」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/pass` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `--path` で指定した `.sandbox/doctor/pass/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

* 判定意図…「事前バリデーション」が正しく動作するか否かの確認。
  * 下記ファイルが、`exists()` で成功する。
    * `.sandbox/doctor/pass/.github/workflows/docs-lint.yml`

期待結果は、下記の通りです。

* `✔ PASS GitHub Actions` である。

#### GitHub Actions 検証 - DOCTOR-012「workflow なし」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。
  2. 下記ファイルを削除する。
    * `.sandbox/doctor/pass/.github/workflows/docs-lint.yml`

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --path .sandbox/doctor/pass` シェルスクリプト。

* 診断対象ディレクトリは、下記の通り (本開発プロジェクト側で普段使いしてる `./node_modules` は、診断対象外とする)。
  * `.sandbox/doctor/pass/` を起点とする。
    * `--path` 省略時は、`process.cwd()` を起点とする実装である為。

* 判定意図…「事前バリデーション」が正しく動作するか否かの確認。
  * 下記ファイルが、`exists()` で失敗する。
    * `--path` で指定した `.sandbox/doctor/pass/.github/workflows/docs-lint.yml`

期待結果は、下記の通りです。

* `⚠ WARN GitHub Actions` である。

#### CLI 検証 - DOCTOR-015「doctor 自体のヘルプ表示」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --help` シェルスクリプト。

期待結果は、下記の通りです。

* `Usage:` である。
* 終了コードが `0` である。

#### CLI 検証 - DOCTOR-014「不正引数」

下記の順番で準備作業と検査を実施し、期待結果の通りであるか否かを判定します。

* 「準備作業」は、下記の通り。
  1. 下記スクリプトで、「[テスト用の設定ファイル4つ](#validated-フィクスチャ)」を生成する (生成時点の記載内容は、全て validated なもの)。
    * `scripts/helpers/setup-doctor-pass.sh`
      * 内部的に右記を実行している `cp -R scripts/fixtures/doctor/pass .sandbox/doctor/pass` シェルスクリプト。

* 下記スクリプトで、テストを実施する。
  * `scripts/test-doctor.sh`
    * 内部的に右記を実行している `npx s2j-docs-linter doctor --unknown` シェルスクリプト。

期待結果は、下記の通りです。

* `Invalid option` である。
* 終了コードが `1` である。

### 実装方針の補足 (init)

設計検討で確定した、init および CLI エントリポイントに関する方針です。詳細は [CLI コマンド - init](#cli-コマンド---init) および [CLI コマンド - init テスト仕様](#cli-コマンド---init-テスト仕様) を参照してください。

#### プリセット `base` の位置づけ

`base` は、WordPress プラグイン/テーマや Swift アプリ/ツール向けではない、**一般的な Markdown 文書** 向けのプリセットとします。`init` のデフォルトプリセットは `base` です。

#### init の終了コード

既存ファイルがあり `--force` もない場合、対象がすべてスキップされても **exit code は 0** とします ([実行サマリー (通常モード)](#41-実行サマリー-通常モード))。Dry Run および `--help` も exit code `0` です。不正な引数組み合わせ・不正 preset は exit code `1` です。

#### CLI エントリポイント (`bin`) の切り替え

`init` 完成時に、`package.json` の `bin` を `dist/bin/run-textlint.js` から **`dist/bin/cli.js`** に切り替えます。

* `cli.ts` をサブコマンドルーターとし、`init` / `doctor` / lint (デフォルト) を振り分ける。
* 引数なし、またはサブコマンド以外の実行は、従来どおり lint として扱う (下位互換)。
* `doctor` 未実装時はルーターにスタブを置き、`doctor.ts` 完成後に差し替える。

#### 実装方針の補足 (doctor)

textlint の存在確認は、診断対象ディレクトリ直下の `node_modules` のみを確認します。

Node.js のモジュール解決 (`require.resolve` 等) は利用しません。

Preset の解決は、`.textlintrc.json` の所在ディレクトリを基準に resolve() + existsSync() で判定します。
