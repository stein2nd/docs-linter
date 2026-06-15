# 📘 S2J Docs Linter - CLI ツール仕様

## 設計意図 (ゴール)

下記の目的で、S2J Docs Linter (`@s2j/docs-linter`) に対して、npm パッケージとしてのプリセット提供に加え、ユーザーの導入、診断、保守を支援する CLI ツールを提供する。

* 開発者のオンボーディングの簡素化
* マイグレーション時の摩擦の低減
* 設定ミスの削減
* CI 統合の標準化
* エコシステムの拡大の実現

フェーズ4「P2: エコシステムの拡張」の実装対象とする。

## 設計原則

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

## 設計方針 (規約)

### CLI 命名規則

CLI コマンドには、一貫した命名規則を採用します。

下記を標準パターンとします。将来のコマンドも、同様の命名規則に従う必要があります。

```zsh
npx s2j-docs-linter <command>
```

コマンド例は、下記が挙げられます。

```zsh
npx s2j-docs-linter init
npx s2j-docs-linter doctor
```

下記がコマンド名の禁止事項になります。

* コマンドごとに別々のパッケージ化
* 一貫性のないコマンド名
* 隠れたコマンドの動作

### 安全なファイル変更ポリシー

CLI は、既存ファイルがある場合、明示的に `--force` が付与された場合のみ、上書きを許可します。

プロジェクトルートに下記の既存ファイルが存在する場合は、上書きしません。

* `.textlintrc.json`
* `.vscode/settings.json`
* `.github/workflows/docs-lint.yml`
* `package.json` の `scripts.lint:docs` (当該キーのみ。`init` 実行時)

### npm パッケージレイアウトへの準拠

CLI が生成する設定は、npm パッケージレイアウトを前提とします。

標準プリセットパスは、`./node_modules/@s2j/docs-linter/presets/...` とします。
旧 Git サブモジュールレイアウト `./tools/docs-linter/...` は、新規生成の対象としません。

### 推奨されるデフォルト設定

CLI は、下記に挙げる推奨構成を生成します。すべての利用ケースの最適化よりも、標準ベストプラクティスを優先します。

* npm パッケージのインストール
* `.textlintrc.json`
* VSCode textlint 連携
* GitHub Actions のドキュメント lint ワークフロー

### プリセットの選択方針

`init` は、プリセット (`base`、`wordpress`、`swift`) 対応とします。
プリセットのデフォルトは、`base` とします。
未対応プリセット指定時は、fail とします。

### デフォルトでは、非対話型 UI

CLI は、CI / 自動化との互換性を考慮します。
標準は、`npx s2j-docs-linter init --preset swift` の様な「非対話型」での実行とします。
現状では、対話型 UI を必須としません。

### 診断の透明性

`doctor` の診断結果は、曖昧な「サイレント・サクセス」を避け、`PASS`、`WARN`、`FAIL` に区分して明示します。

### 隠れたネットワーク依存関係の排除

`init` / `doctor` では、下記を禁止事項とし、外部通信は不要です。

* テレメトリ
* バックグラウンドでのパッケージインストール
* リモート設定の取得

CLI は、ローカル優先とします。

### ドキュメントの同期

CLI の挙動が変更された場合、下記の関連ドキュメントの更新が必要になります。

* README.md
* docs/cli/doctor.md
* docs/cli/init.md
* docs/cli/npm_usage.md
* docs/specifications/cli_tooling_spec.md
* examples/

### 後方互換性に関する方針

CLI コマンドの仕様は、安定性を重視します。
下記の様な破壊的変更については、SemVer ポリシーに従います。

* コマンド名の変更
* 引数名の変更
* 出力仕様の変更
* 生成ファイルの仕様の変更

### 適用範囲

CLI の役割は、docs lint エコシステムに限定され、下記を対象とします。

* docs lint の導入支援
* 診断
* 設定のスケルトン生成

下記は、CLI の役割ではありません。

* npm publish
* リポジトリ管理
* GitHub 秘密情報の操作
* 任意のプロジェクトの自動化

## 非対象 (Out of Scope)

* 依存関係の自動更新
* セマンティック・リリースの自動化
* リモート CI による改変
* スケルトン生成を超えた GitHub リポジトリの自動更新
* パッケージ publish 自動化での変更

## 責務

* CLI エコシステムの定義
* init スケルトン生成挙動
* doctor 診断範囲
* ファイル生成ルール
* 上書き時の安全ルール

## 非責務

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

## CLI コマンドの範囲

標準コマンドは、下記とします。

```zsh
npx s2j-docs-linter init
npx s2j-docs-linter doctor
```

将来的な候補コマンドは、下記が挙げられます。

```zsh
npx s2j-docs-linter upgrade
npx s2j-docs-linter migrate
```

## CLI Entrypoint ポリシー

S2J Docs Linter CLI は、下記の様な、サブコマンドルーターを採用します。

```zsh
npx s2j-docs-linter <command>
```

これにより、下記の様なコマンドとなります。

```zsh
npx s2j-docs-linter init
npx s2j-docs-linter doctor
npx s2j-docs-linter lint
```

尚、引数なしの実行は、下位互換性のため、lint として扱います。

## 一時ワークスペースに関するポリシー

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

## CLI コマンド - init

`init` サブコマンドの仕様、INIT-001〜012テスト仕様、および実装方針の補足は [init.md](../cli/init.md) に定義しています。

## CLI コマンド - doctor コマンド

`doctor` サブコマンドの仕様、DOCTOR-001〜015テスト仕様、および実装方針の補足は [doctor.md](../cli/doctor.md) に定義しています。
