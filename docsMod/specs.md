# S2J Docs Linter - 仕様書の変更案の起点

本プロジェクトの仕様は、以下のドキュメントに分散して定義しています。
各ドキュメントへの導線のみを提供し、詳細な仕様は個別ファイルに委譲します。

## 修正案ドキュメント一覧

| ドキュメント | 内容 |
|--------------|------|
| [npm パッケージ仕様](./npm_package_spec.md) | `@s2j/docs-linter` として npmjs で運用する。 |
| [npm 使い方ガイド](./npm_usage.md) | Git サブモジュールではなく npm モジュールとして利用する。 |
| [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md) | フェーズ2での、GitHub Actions secret 利用 |
| [npm リリース手順](./release.md) | GHA tag publish、`NPM_TOKEN` 登録、dry-run 検証 |
| [実装状況](./status.md) | 実装状況サマリー、移行タスク、Backlog |

## プロジェクトのロードマップ

* プロジェクト実装ロードマップ
    * [実装状況 / ロードマップ](./status.md)
* フェーズの概要
    * フェーズ 1…npm パッケージの基盤構築
    * フェーズ 2…GitHub Actions による OIDC 公開
    * フェーズ 3…コンシューマーの移行完了
    * フェーズ 4…OSS 運用の成熟度向上

---

*元の仕様書は `docs/` フォルダーを参照してください。*