## S2J Docs Linter - Contributing to S2J Docs Linter

S2J Docs Linter への貢献にご関心をお寄せいただき、ありがとうございます。
このプロジェクトでは、開発者向けドキュメント向けに、再利用可能な textlintプ リセット、CLI ツール、およびドキュメントの lint ワークフローを提供しています。
皆様からの貢献を歓迎いたします。

Thank you for your interest in contributing to S2J Docs Linter.
This project provides reusable textlint presets, CLI tooling, and documentation lint workflows for developer documentation.
Contributions are welcome.

### Goals - 目標

本プロジェクトは、下記を提供することを目的としています。貢献は、これらの目標に沿ったものである必要があります。

* 再利用可能なドキュメント lint ツール
* 安定したnpmパッケージの配布
* メンテナンス性の高い textlint プリセットの統合
* 実用的な CI / GitHub Actions ワークフロー
* マイグレーションしやすい開発者向けツール

The purpose of this project is to provide the following. Contributions must align with these objectives.

* reusable documentation lint tooling
* stable npm package distribution
* maintainable textlint preset integration
* practical CI / GitHub Actions workflows
* migration-friendly developer tooling

### Ways to Contribute - 貢献の方法

貢献には、下記の方法があります。

* バグ報告
* ドキュメントの改善
* lint ルールの修正
* プリセットの改善
* 互換性の修正
* CI ワークフローの改善
* 移行ガイドの改善
* 開発者体験の向上

You can contribute in the following ways:

* Reporting bugs
* Improving documentation
* lint rules corrections
* Improving presets
* Compatibility fixes
* Improving CI workflows
* Improving migration guides
* Enhancing the developer experience

役立つ貢献とは、下記の様なものが挙げられます。

* 不具合のある設定例を修正する
* npm 移行に関するドキュメントを改善する
* GitHub Actions のサンプルを更新する
* Node.js との互換性を向上させる
* プリセットの動作を最適化する

Examples of useful contributions include the following:

* fixing broken config examples
* improving npm migration docs
* updating GitHub Actions examples
* improving Node compatibility
* refining preset behavior

### Before You Start - 始める前に

下記のドキュメントには、プロジェクトの現在の方向性とガバナンスが定義されています。

* `README.md`
* `docs/archive/mod-npm/status.md`
* `docs/release.md`
* `docs/maintenance_policy.md`
* `docs/versioning_policy.md`

These documents below define the project's current direction and governance.

* `README.md`
* `docs/archive/mod-npm/status.md`
* `docs/release.md`
* `docs/maintenance_policy.md`
* `docs/versioning_policy.md`

### Development Setup - 開発環境のセットアップ

下記の様にして、リポジトリのローカルクローンを作成します。

```zsh
git clone https://github.com/stein2nd/docs-linter.git
cd docs-linter
```

利用 npm モジュールを `npm install` でインストールします。
その後、`npm run build` でビルド、`npm run pack:check`、`npm run pack:artifact` で検証します。

Follow the steps below to create a local clone of the repository.

```zsh
git clone https://github.com/stein2nd/docs-linter.git
cd docs-linter
```

Install the required npm modules using `npm install`.
Then, run `npm run build` to build the package, then run `npm run pack:check` and `npm run pack:artifact` to verify it.

### Project Structure - プロジェクト構成

主なディレクトリを下記に示します。

```text
src/        TypeScript ソース
dist/       ビルド出力
presets/    npm パッケージ用プリセットレイアウト
base/       互換プリセットレイアウト
swift/      互換プリセットレイアウト
wordpress/  互換プリセットレイアウト
examples/   ワークフロー / 使用例
docs/    設計 / ガバナンスに関するドキュメント
```

Key directories are listed below.

```text
src/        TypeScript source
dist/       build output
presets/    npm package preset layout
base/       compatibility preset layout
swift/      compatibility preset layout
wordpress/  compatibility preset layout
examples/   workflow / usage examples
docs/    design / governance docs
```

### Contribution Workflow - 貢献ワークフロー

推奨されるワークフローは、下記の通りです。

1. リポジトリをフォークする
2. `git checkout -b feature/improve-docs` の様に、新しい作業ブランチを作り作業する
3. 変更を実装する
4. 検証する
5. プルリクエストを送信する

The recommended workflow is as follows.

1. fork repository
2. create feature branch and work on it, like `git checkout -b feature/improve-docs`
3. implement changes
4. run verification
5. submit pull request

### Verification Expectations - 検証に関する要件

変更を送信する前に、下記を確認してください。

Before submitting your changes, please verify the following.

```zsh
npm run build
npm run pack:check
npm publish --dry-run --access public
```

ドキュメントに関する場合は、下記を実行します。

If this concerns the documentation, please do the following.

```zsh
npx textlint --config ./presets/base/.textlintrc.base.json README.md
```

CIに関連する場合は、GitHub Actionsのワークフロー構文を確認してください。

If relates to CI, please review the GitHub Actions workflow syntax.

### Versioning Expectations - バージョン管理に関する要件

バージョン管理は、下記の様に、セマンティック・バージョニングに従います。[バージョン管理ポリシー](docs/versioning_policy.md) をご覧ください。

* バグ修正 → PATCH
* 互換性のある新機能 → MINOR
* 互換性を損なう変更 → MAJOR

明示的な要請がない限り、貢献者はバージョン番号を変更する必要はありません。

Versioning follows semantic versioning, as shown below. Please see the [Versioning Policy](docs/versioning_policy.md)

* bug fix → PATCH
* new compatible capability → MINOR
* breaking change → MAJOR

Contributors do not need to change the version numbers, unless explicitly requested.

### Documentation Expectations - ドキュメントに関する要件

下記ドキュメントに対する変更では、一貫性を保つようにしてください。

* README.md
* docs/*
* examples/*
* マイグレーションガイド

実装の変更がユーザーのワークフローに影響を与える場合は、関連するドキュメントの更新を推奨します。

Please ensure consistency when making changes to the following documents.

* README.md
* docs/*
* examples/*
* migration guides

If implementation changes affect user workflows, we recommend updating relevant documentation.

### Compatibility Expectations - 互換性に関する要件

現在の要件基準では `Node.js >= 20` です。
変更をコミットする際は、不必要な互換性の後退を避けるようにしてください。

The current baseline is `Node.js >= 20`.

When commiting changes, please take care to avoid unnecessary compatibility regressions.

### CI / Security Expectations - CI / セキュリティに関する要件

* 推奨される publish 認証は、「npm Trusted Publishing (OIDC)」
* 下記は推奨しません。
    * コミットされた認証情報
    * `.npmrc` 内のシークレット
    * npm 公開用の長期有効な GitHub シークレット

* The recommended publish authentication method is “npm Trusted Publishing (OIDC)”
* The following are not recommended:
    * committed credentials
    * Secrets in `.npmrc`
    * long-lived GitHub Secrets for npm publish

### Pull Request Scope - プルリクエストの対象範囲

* 下記の様なものが推奨例となります
    * 小規模で焦点を絞ったプルリクエスト。
* 下記の様なものは、良い例になります
    * Swift プリセットのサンプルを修正。
    * ドキュメント移行のサンプルを改善。
    * パッケージングのメタデータを修正。
* 下記の様なものは、あまり好ましくない例になります
    * 関係のない大規模なリファクタリング。
    * 動作変更が混在した大規模な変更。

* The following are preferred examples
    * Small, focused pull requests.
* The following are good examples
    * fix Swift preset example.
    * improve docs migration example.
    * correct packaging metadata.
* The following are less desirable examples
    * unrelated sweeping refactors.
    * large mixed behavioral changes.

### Breaking Changes - 破壊的変更

下記の様な破壊的変更は認められますが、その理由を明確に説明する必要があります。[バージョン管理ポリシー](docs/versioning_policy.md) をご覧ください。

* プリセットパスの変更
* CLI 仕様の変更
* Node.js のベースラインの変更

The following breaking changes are permitted, but you must clearly explain the rationale. Please refer to the [Versioning Policy](docs/versioning_policy.md).

* preset path changes
* CLI contract changes
* Node.js baseline changes

### Issue Reports - 課題レポート

役立つ課題報告には、下記のものが含まれます。

* 環境
* Node.js のバージョン
* npm のバージョン
* 再現手順
* 設定の抜粋
* 期待される動作
* 実際の動作

A helpful issue report includes the following.

* environment
* Node version
* npm version
* reproduction steps
* config snippets
* expected behavior
* actual behavior

### Code Style - コードスタイル

下記に挙げるものが、一般的な要件となります。既存のリポジトリの規約に従ってください。

* 読みやすい実装
* 最小限の驚き
* 保守性の高い構造
* ドキュメントの一貫性

The following are general requirements. Please follow the guidelines of the existing repository.

* readable implementation
* minimal surprise
* maintainable structure
* documentation consistency

### Maintainer Discretion - メンテナーの裁量

メンテナーは下記ができます。

* 修正を依頼する
* 提案を保留にする
* 互換性のない変更を却下する
* 機能拡張よりも安定性を優先する

Maintainers can do the following.

* request revisions
* defer proposals
* reject incompatible changes
* prioritize stability over feature expansion

### License - ライセンス

貢献することにより、貢献内容はプロジェクトのライセンスに基づいて提供されることに同意したものとみなされます。[LICENSE](LICENSE) をご覧ください。

By contributing, you agree that your contributions are provided under the project license. Please see [LICENSE](LICENSE).

### Thank You - 感謝

ご協力、バグ報告、およびドキュメントの改善を歓迎します。

Contributions, bug reports, and documentation improvements are appreciated.
