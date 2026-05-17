# S2J Docs Linter - npm パッケージ仕様 (認証およびシークレット管理仕様)

## 概要

本ドキュメントは、S2J Docs Linter (`@s2j/docs-linter`) を npm レジストリ (`npmjs.com`) に publish する際の認証および secret 管理方針を定義します。

GitHub Actions を利用した publish 自動化を想定します。

## 1. 認証戦略

### 設計意図 (ゴール)

* npm publish を安全に自動化する
* 認証情報の漏洩を防止する
* 長期 secret の利用を最小化する
* 組織 S2J のパッケージ publish を安全に管理する

### 設計原則

* 必要最小限の権限のみ付与すること。
* 長期 secret を減らすこと。
* 認証情報の入れ替えを容易にすること。
* CI/CD の自動化に適した方式を採用すること。

### 設計方針 (規約)

認証方式の優先順位は、下記の通りです。

1. npm trusted publishing (OIDC)
2. npm 自動化トークン
3. 手動でのローカル publish

### 非対象 (Out of Scope)

下記は対象外です。

* パスワード認証
* レガシー認証トークン
* GitHub Packages 認証

### 責務

本仕様で定義すること。

* npm 認証モデル
* GitHub Actions secret 管理
* トークンの入れ替え方針
* インシデント対応の基準

### 非責務

本仕様では定義しないこと。

* エンタープライズ SSO
* 組織全体の IAM ガバナンス

## 2. GitHub Secret Management

### 設計意図 (ゴール)

GitHub Actions 上で安全に secret を扱います。

### 設計原則

* secret exposure をリポジトリ単位で制御すること。
* 漏洩時影響を最小化すること。

### 設計方針 (規約)

GitHub リポジトリで、secret として `NPM_TOKEN` を登録します。

```mermaid
flowchart TD
  A["Settings"] --> B["Security and quality"]
  B --> C["Secrets and variables"]
  C --> D["Actions"]
```

### 推奨設定

利用リポジトリのみ公開します。
組織全体の secret は、慎重に判断します。

### 禁止事項

下記を禁止します。

* ワークフローログへのトークン出力
* $NPM_TOKEN の echo 出力
* デバッグログでの secret 表示

### 責務

本仕様で定義すること。

* GitHub secret ストレージ

### 非責務

本仕様では定義しないこと。

* 開発者のローカルマシンにおける、認証情報の管理

## 3. フェーズ1: `NPM_TOKEN`

### 設計意図 (ゴール)

npm trusted publishing 導入前の publish 自動化を実現します。

### 設計原則

* 段階移行を許容すること。
* publish 専用トークンを使うこと。

### 設計方針 (規約)

GitHub Actions secret で `npm publish --access public` を実行する際に、`NPM_TOKEN` を使用します。
具体的な利用例は、「GitHub Actions 例」の [フェーズ1: `NPM_TOKEN`](#3-フェーズ1-npm_token) を参照してください。

### 必須要件

トークンは、下記を満たします。

* npm 自動化トークン
* publish 権限のみ
* `s2j` 組織のパッケージ publish 権限
* 最小スコープ

### 禁止事項

下記を禁止します。

* 個人用ログインパスワード
* 平文によるトークンコミット
* .npmrc コミット
* 再利用可能トークンの広範囲共有

### 責務

フェーズ1で定義すること。

* トークンベースの publish
* GitHub secret ストレージ

### 非責務

フェーズ1では定義しないこと。

* トークンの永続性

## 4. フェーズ2: npm trusted publishing (推奨)

### 設計意図 (ゴール)

GitHub Actions から secret なしで npm publish を可能にします。

### 設計原則

* CI に credential を保存しないこと。
* GitHub Actions 識別情報を npm レジストリに委譲すること。

### 設計方針 (規約)

最終的な推奨方式は、npm trusted publishing とします。

対象は、下記の順番です。

* GitHub リポジトリ
* GitHub Actions
* npmjs.com の組織 `s2j`

### 概要

GitHub Actions OIDC 識別情報を npm trusted publishing に登録します。
これにより、下記が不要になります。

```yaml
secrets.NPM_TOKEN
NODE_AUTH_TOKEN
```

### 責務

フェーズ2で定義すること。
npm trusted publishing に移行後は、下記が可能になります。

* 長期トークン廃止
* secret 入れ替え不要
* GitHub リポジトリの信頼境界に統合

### 非責務

フェーズ1では定義しないこと。

## 5. GitHub Actions 例

### フェーズ1: `NPM_TOKEN`

```yaml
permissions:
  contents: read

steps:
  - uses: actions/checkout@v4

  - uses: actions/setup-node@v4
    with:
      node-version: 20
      registry-url: 'https://registry.npmjs.org'

  - run: npm ci
  - run: npm publish --access public
    env:
      NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### フェーズ2以降: npm trusted publishing (Target State)

```yaml
permissions:
  contents: read
  id-token: write

steps:
  - uses: actions/checkout@v4

  - uses: actions/setup-node@v4
    with:
      node-version: 20
      registry-url: 'https://registry.npmjs.org'

  - run: npm ci
  - run: npm publish --access public
```

## 6. トークンの入れ替え方針

### 設計意図 (ゴール)

トークン漏洩時のリスクを下げます。

### 設計原則

* 漏洩前提で設計すること。

### 設計方針 (規約)

入れ替えトリガーは、下記の通りです。入れ替え期間は、`90–180日` を推奨します。

* メンテナーの変更
* 侵害の疑い
* publish 失敗
* 定期レビュー

### 責務

本仕様で定義すること。

* トークンの失効
* トークンの再発行

### 非責務

本仕様では定義しないこと。

* 自動入れ替えツール

## 7. インシデント対応

### 設計意図 (ゴール)

credential 漏洩時に迅速対応します。

### 設計方針 (規約)

対応順は、下記の通りです。

1. npm トークンの取り消し
2. GitHub secret の削除
3. 代替トークンの発行
4. publish 履歴の監査
5. リリースの整合性レビュー

### 責務

本仕様で定義すること。

* 最低限のインシデント対応手順書

### 非責務

本仕様では定義しないこと。

* 鑑識

## 8. 移行戦略

### 設計方針 (規約)

1. フェーズ1: NPM_TOKEN
2. フェーズ2: npm trusted publishing
3. フェーズ3: トークン廃止
