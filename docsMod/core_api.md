# 📘 S2J Docs Linter - フェーズ0 - Core API 仕様

## 1. 概要

本ドキュメントは `@s2j/docs-linter-core` の公開 API およびドメインモデルを定義します。
本パッケージは文章の品質検査エンジンであり、CLI・REST API、`WordPress` / `Forwarder-PRO` / `配配メール` 等のアダプターから利用されることを想定します。

## 2. 設計原則

### textlint の隠蔽

ユーザーは textlint の存在を意識しません。

Core API が公開するのは下記のみとします。

* Text
* Profile
* ルール設定
* 辞書
* Lint 結果

textlint 固有オブジェクトは公開 API に含めません。

### ランタイムの独立性

Core API は下記ランタイムをサポートします。

* Node.js
* ブラウザー
* Web Worker

Core API 自体は fs / path / os / process への依存を持ちません。

### アダプターの独立性

Core API は特定プラットフォームに依存しません。

対象例は、下記のようになります。

* CLI
* REST API
* `WordPress`
* `Forwarder-PRO`
* `配配メール`

## 3. 非責務

現時点では下記を Adapter Layer の責務とします。

* Markdown Editor UI
* WordPress UI
* REST API 実装
* Database 実装
* User Management
* Authentication

## 4. 汎用言語

| Term | Description |
| --- | --- |
| Rule Definition | ルール定義 |
| Rule Configuration | ルール設定 |
| Dictionary | 辞書 |
| Profile | ルールと辞書の集合 |
| Lint Request | Lint 要求 |
| Lint Result | Lint 結果 |
| Violation | 指摘事項 |

## 5. ドメインモデル

### RuleDefinition

ルール定義です。開発者またはコントリビューターが提供します。ユーザーは変更できません。

ルール定義例は、下記のようになります。

```text
max-kanji-continuous
max-sentence-length
max-heading-length
forbidden-word
required-word
```

### RuleConfiguration

RuleDefinition に対する具体値です。

ルール設定例は、下記のようになります。

```json
{
  "max-kanji-continuous": {
    "max": 7
  }
}
```

### Dictionary

ユーザー固有の辞書です。

辞書例は、下記のようになります。

```yaml
forbidden:
  - ヤバい

recommended:
  - 利用する

properNouns:
  - WordPress
  - Gutenberg
```

### Profile

診断プロファイルです。

プロファイル例は、下記のようになります。

```json
{
  "id": "wordpress",
  "name": "WordPress Profile",
  "rules": {},
  "dictionary": {}
}
```

### Violation

指摘事項です。

指摘例は、下記のようになります。

```json
{
  "ruleId": "max-kanji-continuous",
  "severity": "warning",
  "message": "漢字の連続数が上限を超えています"
}
```

### LintResult

診断結果です。

結果例は、下記のようになります。

```json
{
  "errors": [],
  "warnings": []
}
```

## 6. 集約

### Profile 集約

Profile を集約ルートとします。

```text
┬ Profile
├─ RuleConfiguration
└─ Dictionary
```

RuleConfiguration および Dictionary は Profile 経由で管理します。

## 7. 値オブジェクト

### RuleId

```ts
type RuleId = string;
```

ルール id 例は、下記のようになります。

```text
max-kanji-continuous
forbidden-word
```

### ProfileId

```ts
type ProfileId = string;
```

プロファイル id 例は、下記のようになります。

```text
wordpress
business-mail
```

### Severity

```ts
type Severity =
    | "error"
    | "warning"
    | "info";
```

## 8. ドメインサービス

### LintEngine

文章を品質検査するドメインサービスです。

責務は、下記になります。

* ルール評価
* 辞書評価
* Result Generation

### RuleEngine

ルール評価を担当します。

責務は、下記になります。

* RuleDefinition の実行
* RuleConfiguration の適用

### DictionaryEngine

辞書評価を担当します。

責務は、下記になります。

* 禁止語の検査
* 推奨語の検査
* 固有名詞の検査

## 9. アプリケーションサービス

### LintService

文章診断ユースケースです。

```ts
lint(request: LintRequest): Promise<LintResult>
```

### ProfileService

プロファイル管理ユースケースです。

```ts
loadProfile(profileId)
```

### ConfigService

設定管理ユースケースです。

```ts
validateConfig(config)
```

## 10. リポジトリ

### ProfileRepository

責務は、下記になります。

* Profile 取得
* Profile 保存

Core API ではインターフェースのみ定義します。実装は Adapter 側に委譲します。

### DictionaryRepository

責務は、下記になります。

* 辞書取得
* 辞書保存

Core API では実装しません。

## 11. 公開 API

### `lint()`

文章の品質検査です。

```ts
const result = await lint({
    text,
    profile
});
```

* Request

```ts
interface LintRequest {
    text: string;
    profile: Profile;
}
```

* Response

```ts
interface LintResult {
    errors: Violation[];
    warnings: Violation[];
}
```

### `validateConfig()`

設定を検証します。

```ts
validateConfig(config);
```

### `validateDictionary()`

辞書を検証します。

```ts
validateDictionary(dictionary);
```

## 12. インフラストラクチャ境界

Core API が依存可能なものは、下記になります。

* textlint Engine
* Rule Adapter
* YAML Parser
* JSON Parser

Core API が依存してはならないものは、下記になります。

* WordPress
* React
* ブラウザー API
* Node.js API
* Database

## 13. 今後の拡張機能

下記は、今後追加を検討する機能です。これらは Core API の公開インターフェースを破壊しない形で追加します。

* Auto Fix
* Rule Marketplace
* Profile Marketplace
* Multi Language Support
* AI Assisted Review
