# 📘 S2J Docs Linter - @s2j/docs-linter-rest (配送契約)

## 1. 概要

`@s2j/docs-linter-rest` は、`@s2j/docs-linter-core` を REST API として公開するためのアダプター・パッケージです。

本パッケージは、文章品質判定ロジックを保持しません。全ての判定処理を `@s2j/docs-linter-core` に委譲します。

REST API は、`WordPress`、`Forwarder-PRO` / `配配メール` 等の外部システムとの連携手段として利用されます。

## 2. 設計原則

### アダプター・パターン

REST 層は、アダプターとして振る舞います。REST 層は、薄く保ちます。

REST 層に、業務ロジックを実装してはなりません。

### ドメイン分離

REST 層は、ドメイン・オブジェクトを公開してはなりません。

### コア・ファースト

全ての診断処理は Core に委譲します。

例は、下記のようになります。

```mermaid
flowchart TD
  A["POST /lint"] --> B["LintService"]
  B --> C["docs-linter-core"]
```

### アプリケーション・サービス First

REST 層は、アプリケーション・サービスのみを利用します。

下記のような、REST コントローラーからのフローは許可されます。

```mermaid
flowchart TD
  A["REST コントローラー"] --> B["アプリケーション・サービス"]
```

下記のような、REST コントローラーからのフローは許可されません。

```mermaid
flowchart TD
  A["REST コントローラー"] --> B["リポジトリ"]
```

```mermaid
flowchart TD
  A["REST コントローラー"] --> B["ResourceProvider"]
```

### ステートレス

REST API はステートレスとします。

セッション状態を保持しません。

## 3. 設計意図 (ゴール)

* Core API の REST 化
* プラットフォーム非依存化
* 外部アプリケーションとの連携
* プロファイル管理 API
* 辞書管理 API

## 4. REST 境界

### 責務

REST 層は、下記のみを担当します。

* リクエストの検証
* DTO マッピング
* 認証の連携
* 応答のシリアライゼーション
* エラーの翻訳

### 非責務

REST 層は、下記を担当しません。

* 検証ロジック
* Lint ロジック
* ルールの評価
* ルールの実行
* プロファイルの解決
* 辞書の解決
* 辞書の評価
* UI
* 認証
* 認可

## 5. API 契約

REST API は、アプリケーション・サービスの公開インターフェースです。

## 6. DTO 契約

REST 層は、DTO を公開します。

ドメイン・オブジェクトを公開してはなりません。

## 7. Core マッピング契約

REST 層は、DTO をアプリケーション・リクエストに変換します。

## 8. エラー契約

REST 層は、ランタイムエラーをエラー DTO に変換します。

## 9. OpenAPI 契約

REST API は、OpenAPI 仕様を提供します。

## 10. REST トランスポート契約

`@s2j/docs-linter-rest` は、`@s2j/docs-linter-core` のトランスポート・アダプターです。

本モジュールは、HTTP / REST を介して Core ランタイムを利用可能にします。

## 11. 運用契約

トランスポート層の互換性、運用性、および拡張性を保証するためのルールを定めます。

## 12. ページネーション契約

一覧取得 API は、ページネーションをサポートします。

## 13. データ絞り込み契約

一覧取得 API は、「絞り込み」をサポートできます。

## 14. 並べ替えの契約

一覧取得 API は、「並べ替え」をサポートできます。

## 15. 非同期ジョブ契約

長時間の実行処理は、非同期ジョブとして実行します。

## 16. 相関 ID 契約

すべてのリクエストは、相関 ID を持つことを推奨します。

## 17. 「利用側」駆動契約

「利用側」は、下記を想定します。

* `WordPress`
* `Forwarder-PRO`
* `配配メール`

## 18. トランスポート統制

### 原則1

後方互換性 First - 既存「利用側」を破壊しない。

### 原則2

Core 分離 - REST 層は、Core ランタイムを汚染しない。

### 原則3

OpenAPI First - すべてのエンドポイントを OpenAPI に記載する。

### 原則4

非同期 First - 長時間処理は、非同期ジョブを利用する。

### 原則5

マルチテナント分離 - テナント間のデータ共有を禁止する。

## 19. アーキテクチャ

```mermaid
flowchart TD
    subgraph ClientLayer ["クライアント"]
        direction TB
        c1["`WordPress`"]
        c2["`Forwarder-PRO`"]
        c3["`配配メール`"]
        c4["CLI"]
    end

    subgraph RestLayer ["`@s2j/docs-linter-rest`"]
        direction TB
        r1["REST コントローラー"]
        r2["リクエストの検証"]
        r3["DTO マッピング"]
    end

    core ["`@s2j/docs-linter-core`"]

    ClientLayer --> RestLayer
    RestLayer --> core
```

## 20. REST トランスポート

`@s2j/docs-linter-rest` は、`@s2j/docs-linter-core` のトランスポート・アダプターです。

本モジュールは、HTTP / REST を介して Core ランタイムを利用可能にします。

## 21. Core マッピング

REST 層は、DTO をアプリケーション・リクエストに変換します。

下記は、Core マッピング例です。

```mermaid
flowchart TD
  A["POST /lint"] --> B["LintRequestDto"]
  B --> C["LintRequest"]
  C --> D["LintApplicationService"]
```

### フロー

```mermaid
flowchart TD
  A["HTTP リクエスト"] --> B["リクエスト DTO"]
  B --> C["Mapper"]
  C --> D["アプリケーション・リクエスト"]
  D --> E["アプリケーション・サービス"]
```

## 22. ドメイン・マッピング

REST API は「ドメイン・モデル」を DTO に変換します。

### ドメイン

* Profile
* RuleConfiguration
* Dictionary
* LintResult
* Violation

### DTO

* ProfileDto
* DictionaryDto
* LintRequestDto
* LintResultDto

## 23. エンドポイント

### ヘルスチェック

サーバー状態を取得します。

* 応答

```json
{
  "status": "ok"
}
```

### Lint

```http
POST /api/v1/lint
```

* ターゲット - LintApplicationService

### 一括 Lint

```http
POST /api/v1/lint/batch
```

* ターゲット - BatchLintApplicationService

### プロファイル

```http
GET /api/v1/profiles
```

```http
GET /api/v1/profiles/{profileId}
```

### パッケージ

```http
POST /api/v1/packages/import
```

```http
GET /api/v1/packages/{packageId}/export
```

## 24. OpenAPI

REST API は、OpenAPI 仕様を提供します。

### 設計意図 (ゴール)

* クライアント生成
* SDK 生成
* 契約のテスト
* ドキュメント

### OpenAPI マッピング・ルール

全エンドポイントは、OpenAPI に記載しなければなりません。

### 出力

```text
/openapi.json
```

```text
/openapi.yaml
```

## 25. Lint API

### POST /lint

文章を品質診断します。

* リクエスト

```json
{
  "text": "# WordPress",
  "profileId": "wordpress"
}
```

* 応答

```json
{
  "errors": [],
  "warnings": [
    {
      "ruleId": "max-kanji-continuous",
      "message": "漢字の連続数が上限を超えています"
    }
  ]
}
```

## 26. プロファイル API

### GET /profiles

利用可能なプロファイル一覧を取得します。

* 応答

```json
[
  {
    "id": "wordpress",
    "name": "WordPress Profile"
  }
]
```

### GET /profiles/{id}

プロファイルを取得します。

* 応答

```json
{
  "id": "wordpress",
  "rules": {},
  "dictionary": {}
}
```

### POST /profiles

プロファイルを作成します。

* 応答

```json
{
  "id": "legal",
  "name": "Legal Profile"
}
```

### PUT /profiles/{id}

プロファイルを更新します。

### DELETE /profiles/{id}

プロファイルを削除します。

## 27. 辞書 API

### GET /dictionaries

辞書一覧を取得します。

### GET /dictionaries/{id}

辞書を取得します。

### POST /dictionaries

辞書を作成します。

* リクエスト

```json
{
  "id": "company-terms",
  "terms": [
    "WordPress",
    "Gutenberg"
  ]
}
```

### PUT /dictionaries/{id}

辞書を更新します。

### DELETE /dictionaries/{id}

辞書を削除します。

## 28. インポート API

### POST /import/profile

プロファイルをインポートします。

対応形式は、下記のようになります。

* JSON

### POST /import/dictionary

辞書をインポートします。

対応形式は、下記のようになります。

* JSON
* YAML

## 29. エクスポート API

### GET /export/profile/{id}

プロファイルをエクスポートします。

### GET /export/dictionary/{id}

辞書をエクスポートします。

## 30. リポジトリの関連付け

REST 層は、リポジトリ・インターフェースを実装します。

## 31. ランタイムエラー

REST 層は、ランタイムエラーをエラー DTO に変換します。

下記は、ランタイムエラー例です。

```json
{
  "code": "PROFILE_NOT_FOUND",
  "message": "Profile not found"
}
```

### 標準エラーコード

* PROFILE_NOT_FOUND
* DICTIONARY_NOT_FOUND
* UNSUPPORTED_VERSION
* VALIDATION_FAILED
* INTERNAL_ERROR

### エラー応答

#### 検証エラー

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Profile ID is required"
}
```

#### Not Found

```json
{
  "code": "NOT_FOUND",
  "message": "Profile not found"
}
```

#### 内部エラー

```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Unexpected error"
}
```

## 32. ランタイム要件

対応環境は、下記のようになります。

* Node.js
* Docker
* Linux
* macOS
* Windows

## 33. インターフェイス

### ProfileRepository

```ts
interface ProfileRepository {
  load(id: string);
  save(profile: Profile);
}
```

### DictionaryRepository

```ts
interface DictionaryRepository {
  load(id: string);
  save(dictionary: Dictionary);
}
```

### LintRequestDto

```ts
interface LintRequestDto {
    content: string;

    contentType: string;

    profileId: string;
}
```

### LintResponseDto

```ts
interface LintResponseDto {
    violations:
        ViolationDto[];

    summary:
        SummaryDto;
}
```

### ValidationReportDto

```ts
interface ValidationReportDto {
    totalViolations:
        number;

    warnings:
        number;

    errors:
        number;
}
```

### ErrorResponseDto

```ts
interface ErrorResponseDto {
    code: string;

    message: string;

    requestId?: string;
}
```

### TenantContext

```ts
interface TenantContext {
    tenantId: string;
}
```

## 34. 認証境界

REST 層は、認証を許可します。

Core ランタイムは、認証を知りません。

### 対応例

* Bearer Token
* JWT
* Cookie セッション
* API キー

### 禁止

```mermaid
flowchart TD
  A["Core ランタイム"] --> B["認証"]
```

## 35. シリアライゼーション方針

REST API は、JSON を標準フォーマットとします。

### 命名規則

JSON プロパティは、camelCase (キャメルケース) を採用します。

構成単語 (先頭以外の各単語の語頭は、全て大文字) を連結する「キャメルケース」は、許可されます。

```json
{
  "profileId": "wordpress/default"
}
```

一方、構成単語 (各単語は、全て小文字) をアンダースコアで連結する「スネークケース (snake_case)」は、許可されません。

```json
{
  "profile_id": "wordpress/default"
}
```

### 日付フォーマット

RFC3339 を採用します。

下記は、日付の例です。

```json
{
  "createdAt":
    "2026-06-24T12:00:00Z"
}
```

### API バージョニング

REST API は、URI バージョニングを採用します。

下記は、API バージョニング例です。

```http
POST /api/v1/lint

POST /api/v2/lint
```

#### フォーマット

```text
/api/v1/*
```

### API バージョンの互換性

#### 互換

利用可能です。

#### 非推奨

利用可能です。警告を返します。

#### 非サポート

利用不可です。

## 36. リクエスト制限方針

REST 層は、「リクエスト制限」を提供できます。

### デフォルト設定の推奨

* Lint: `60 requests / minute`
* 一括 Lint: `10 requests / minute`

### 応答

```http
429 Too Many Requests
```

## 37. トランスポート・イベント

REST トランスポート・イベントを発行できます。

下記は、トランスポート・イベント例です。

* RequestReceived
* ResponseSent
* AuthenticationFailed

## 38. REST 可観測性

### 指標

* request.count
* request.duration
* request.error

### ログ

* アクセス・ログ
* エラー・ログ

## 39. 運用

本章は、`@s2j/docs-linter-rest` の長期にわたる運用契約を定義します。

トランスポート層の互換性、運用性、および拡張性を保証するためのルールを定めます。

### 冪等性 (べきとうせい) 方針

REST API は、エンドポイントごとの冪等性を明示します。

### 冪等 (べきとう) キー

必要に応じて、下記を利用できます。

```http
Idempotency-Key: 8a8f4d9e
```

### 冪等性 (べきとうせい) エンドポイント

複数回実行しても、同じ結果になります。

| エンドポイント | 冪等 (べきとう) |
| --- | --- |
| POST /api/v1/lint | Yes |
| POST /api/v1/lint/batch | Yes |
| GET /api/v1/profiles | Yes |
| GET /api/v1/profiles/{id} | Yes |

### 非冪等性 (べきとうせい) エンドポイント

複数回実行で、冪等性 (べきとうせい) は保証されません。

| エンドポイント | 冪等 (べきとう) |
| --- | --- |
| POST /api/v1/packages/import | No |

## 40. ページネーション

一覧取得 API は、ページネーションをサポートします。

### リクエスト・パラメータ

```http
GET /api/v1/profiles?page=1&pageSize=20
```

### 応答フォーマット

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "total": 120,
  "totalPages": 6
}
```

### デフォルト値

| プロパティ | 値 |
| -------- | ----- |
| page     | 1     |
| pageSize | 20    |

### 最大値

| プロパティ | 値 |
| -------- | ----- |
| pageSize | 100   |

## 41. データ絞り込み

一覧取得 API は、「絞り込み」をサポートできます。

下記は、絞り込み例です。

```http
GET /api/v1/profiles?category=wordpress

GET /api/v1/profiles?profileType=legal
```

### 絞り込みルール

フィルター・パラメータは、完全一致を基本とします。

部分一致での検索は、明示的に定義します。

## 42. 並べ替え

一覧取得 API は、「並べ替え」をサポートできます。

下記は、並べ替えの例です。

```http
GET /api/v1/profiles?sort=name

GET /api/v1/profiles?sort=-createdAt
```

### 並べ替えのルール

先頭の "-" は、降順を表します。

## 43. 非同期ジョブ

長時間の実行処理は、非同期ジョブとして実行します。

### 対象操作

* 一括検証
* パッケージ・インポート
* パッケージ・エクスポート

### ジョブ作成

```http
POST /api/v1/jobs
```

### 応答

```json
{
  "jobId": "job-123"
}
```

### ジョブ状態

```http
GET /api/v1/jobs/{jobId}
```

### 状態値

```ts
type JobStatus =
    | "pending"
    | "running"
    | "completed"
    | "failed";
```

### 完了結果

```json
{
  "jobId": "job-123",
  "status": "completed"
}
```

## 44. 相関 ID

すべてのリクエストは、相関 ID を持つことを推奨します。

### リクエスト・ヘッダー

```http
X-Correlation-Id: abc123
```

### 応答ヘッダー

```http
X-Correlation-Id: abc123
```

### トレースのフロー

同一相関 ID を利用します。

```mermaid
flowchart TD
  A["クライアント"] --> B["REST"]
  B --> C["アプリケーション・サービス"]
  C --> D["Core ランタイム"]
  D --> E["Worker"]
```

## 45. コントラクトテスト方針

REST 契約の後方互換性を保証します。

### 必須テスト

* リクエスト契約
* 応答契約
* エラー契約
* OpenAPI 契約

## 46. 「利用側」駆動

「利用側」は、下記を想定します。

* `WordPress`
* `Forwarder-PRO`
* `配配メール`

### 互換性ルール

既存「利用側」を破壊する変更は、禁止します。

## 47. API 非推奨化の方針

REST API の廃止手順を定義します。

### ライフサイクル

```mermaid
flowchart TD
  A["有効"] --> B["非推奨"]
  B --> C["削除"]
```

### 有効

通常利用可能です。

### 非推奨

利用可能だが、警告を表示します。

### 削除

利用不可です。

### 最低限の非推奨期間

| API タイプ | 期間 |
| --- | --- |
| 外部公開 API | 6か月 |
| 内部結合 API | 3か月 |

### 移行猶予ヘッダー

```http
Deprecation: true
```

### 廃止ヘッダー

```http
Sunset: 2027-12-31
```

## 48. マルチテナント境界

REST 層は、「テナント・コンテキスト」を扱います。

Core ランタイムは、テナントを知りません。

### 責務

REST 層の責務は、下記の通りです。

* テナントの解決
* テナント認証
* テナント認可

Core ランタイムの責務は、下記の通りです。

* 検証
* ルールの実行
* 辞書の評価

### テナント・フロー

```mermaid
flowchart TD
  A["テナント"] --> B["REST 層"]
  B --> C["アプリケーション・リクエスト"]
  C --> D["Core ランタイム"]
```

### 分離ルール

テナント間で、下記を共有してはなりません。

* プロファイル
* 辞書
* パッケージ
* 検証結果

## 49. 完了条件

`@s2j/docs-linter-rest` は、下記を実装した時点で完成とみなします。

* REST 境界
* API 契約
* DTO 契約
* Core マッピング契約
* シリアライゼーション方針
* API バージョニング
* エラー契約
* 認証境界
* リクエスト制限方針
* OpenAPI 契約
* トランスポート可観測性
* トランスポート ADR (アーキテクチャ決定記録)

運用層は、下記を実装した時点で完成とみなします。

* 冪等性 (べきとうせい) 方針
* ページネーション契約
* データ絞り込み契約
* ソートの契約
* 非同期ジョブ契約
* 相関 ID 契約
* コントラクトテスト方針
* API 非推奨化の方針
* マルチテナント境界
* トランスポート統制

## 50. 今後のロードマップ

`@s2j/docs-linter-rest` は、必須コンポーネントではありません。
`WordPress` やブラウザー・ランタイムが `@s2j/docs-linter-core` を直接利用する構成も許容します。

* フェーズ1
  * REST アダプターの実装
    * Health API
    * Lint API
* フェーズ2
  * プロファイル管理 API の実装
    * CRUD
    * インポート
    * エクスポート
* フェーズ3
  * 辞書管理 API の実装
    * CRUD
    * インポート
    * エクスポート
* フェーズ4
  * マルチテナント対応
* フェーズ5
  * 認証統合
    * JWT
    * OAuth2
    * SSO

## 51. ADR (アーキテクチャ決定記録)

### ADR-REST-001

REST 層は、トランスポート・アダプターとする。

### ADR-REST-002

REST 層は、ドメイン・オブジェクトを公開しない。

### ADR-REST-003

REST 層は、アプリケーション・サービスのみを呼び出す。

### ADR-REST-004

REST API は、OpenAPI を提供する。

### ADR-REST-005

認証は、REST 層の責務とする。

