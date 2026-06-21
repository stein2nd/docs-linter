# 📘 S2J Docs Linter - doctor コマンド

## CLI コマンド - doctor コマンド

本コマンドの目的は、下記を責務とする、環境診断です。

* 設定の検証
* 依存関係の検証
* CI 準備状況の検証

### doctor チェック

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

### 引数 --path

下記の様に、本コマンドが診断対象とする「プロジェクトルート」を指定します。

```zsh
npx s2j-docs-linter doctor --path ./my-project
```

省略時は、カレントディレクトリ (`process.cwd()`) を診断対象とします。

依存関係の解決は、診断対象ディレクトリ配下を基準として行います。

### doctor 出力ポリシー

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

`textlint` は、診断対象ディレクトリ配下の `node_modules` から解決できることを確認します。つまり、親ディレクトリの `node_modules` は参照しません。

プリセットの `extends` 解決について、下記の方針とします。

* プリセットは、`.textlintrc.json` の存在するディレクトリを基準として `extends` の各エントリを解決する。尚、`.textlintrc.json` が解決できない場合は、プリセット解決は、未評価とする。
* `extends` は `string` または `string[]` を受け付ける。
* `extends` が未指定、空配列、1件でも解決失敗、または不正な型の場合は `✖ FAIL Preset` とする。
* `extends` に記載された全てのプリセットが解決できた場合のみ `✔ PASS Preset` とする。

### doctor 総合結果

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

### doctor 診断ラベル

| ラベル | 内容 |
| --- | --- |
| Node.js | engines.node 検証 |
| textlint | textlint インストール確認 |
| Config | .textlintrc.json 存在確認 |
| Preset | extends 解決確認 |
| VSCode | settings.json 確認 |
| GitHub Actions | docs-lint.yml 確認 |
| package.json | package.json 存在確認 |

### doctor 終了コード

WARN は、ユーザーへの注意喚起であり、コマンド失敗と見做しません。

| 状態 | 終了コード |
|--- | --- |
| PASS のみ | 0 |
| WARN のみ | 0 |
| FAIL を1件以上含む | 1 |
| 不正引数 | 1 |
| --help | 0 |

## CLI コマンド - doctor テスト仕様

### 設計意図 (ゴール)

下記を対象に、`doctor` コマンドが利用環境を正しく診断し、ユーザーに適切な PASS / WARN / FAIL を通知できることを検証します。

* Node.js 環境
* npm 環境
* textlint 設定
* preset 解決
* VSCode 設定
* GitHub Actions 設定
* doctor 実行結果の整合性

### 設計原則

* doctor は、診断専用とし、ファイルの破壊的変更 (つまり、生成、削除、変更) を行わない。
* 診断結果は、必ず、PASS / WARN / FAIL のいずれかに分類する。
* テスト時は、`.sandbox/doctor/` 配下を利用する。

### 自動テスト - 方針

`scripts/test-doctor.sh` を用意し、`npm run test:doctor` で実行可能とします。

### 自動テスト - 完了条件

下記を満たした場合、doctor コマンド実装完了とします。

* DOCTOR-001 ～ DOCTOR-015 成功
* GitHub Actions 上で再現可能
* PASS / WARN / FAIL が適切に分類される
* `.sandbox/doctor/` を利用した検証が可能
* `npm run test:doctor` が成功する

### テスト対象 - Node.js 診断

* バージョン検出
* engines.node 準拠確認

### テスト対象 - textlint 診断

* textlint インストール確認
* config 存在確認
* preset 解決確認

### テスト対象 - VSCode 診断

* settings.json 存在確認
* textlint.configPath 確認

### テスト対象 - GitHub Actions 診断

* docs-lint workflow 存在確認

### validated フィクスチャ

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

### 依存関係の解決

doctor コマンドは、診断対象ディレクトリ直下の `node_modules` のみを検査対象とします。親ディレクトリの `node_modules` は参照しません。

textlint の存在確認は、Node.js のモジュール解決 (`require.resolve` 等) を利用せず、診断対象ディレクトリ配下を明示的に確認します。

### テストケース一覧

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

### 総合検証 - DOCTOR-001「正常環境」

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

### Node.js 検証 - DOCTOR-002「Node.js バージョン適合」

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

### Node.js 検証 - DOCTOR-013「Node.js バージョン不足」

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

### Node.js 検証 - DOCTOR-010「package.json 不在」

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

### textlint 検証 - DOCTOR-009「textlint 未導入」

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

### textlint 検証 - DOCTOR-003「textlint 設定あり」

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

### textlint 検証 - DOCTOR-007「.textlintrc.json 不在」

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

### プリセット検証 - DOCTOR-004「preset 解決成功」

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

### プリセット検証 - DOCTOR-008「preset パス不正」

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

### VSCode 検証 - DOCTOR-005「VSCode 設定あり」

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

### VSCode 検証 - DOCTOR-011「VSCode 設定なし」

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

### GitHub Actions 検証 - DOCTOR-006「workflow 存在」

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

### GitHub Actions 検証 - DOCTOR-012「workflow なし」

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

### CLI 検証 - DOCTOR-015「doctor 自体のヘルプ表示」

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

### CLI 検証 - DOCTOR-014「不正引数」

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

## 実装方針の補足 (doctor)

textlint の存在確認は、診断対象ディレクトリ直下の `node_modules` のみを確認します。

Node.js のモジュール解決 (`require.resolve` 等) は利用しません。

Preset の解決は、`.textlintrc.json` の所在ディレクトリを基準に resolve() + existsSync() で判定します。

### extends の解決

doctor は `.textlintrc.json` の `extends` に対して、`string` または `string[]` を受け付けます。
実装時は配列に正規化 (`normalizeExtends`) した上で、全てのエントリを `.textlintrc.json` 所在ディレクトリ基準で解決します。

```ts
const entries = Array.isArray(config.extends) ? config.extends : [config.extends];
```

```
resolve(dirname(configPath), entry)
```

判定規則は「[CLI コマンド - doctor コマンド - プリセット判定規則](#doctor-出力ポリシー)」に従います。
Config チェック失敗時は Preset を未評価とします。
