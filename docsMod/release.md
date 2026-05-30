# S2J Docs Linter — npm リリース手順 (フェーズ2)

本ドキュメントは、`@s2j/docs-linter` を GitHub Actions 経由で npm に publish する運用手順です。認証方針は [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md)、実装状況は [status.md](./status.md) を参照してください。

## 前提

| 項目 | 内容 |
| --- | --- |
| パッケージ | `@s2j/docs-linter` |
| 変更履歴 | [CHANGELOG.md](../CHANGELOG.md) |
| ワークフロー | [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml) |
| トリガー | tag `v*` push、または手動 `workflow_dispatch` |
| 認証 (推奨) | **npm Trusted Publishing (OIDC)** — GitHub Actions / `stein2nd` / `docs-linter` / `npm-publish.yml` |
| 認証 (レガシー) | GitHub Secret `NPM_TOKEN` — **不要** (Trusted Publisher 登録済み) |

## 1. 認証セットアップ (Trusted Publishing)

npm Trusted Publisher を登録済みです (2026-05-24)。

| 項目 | 値 |
| --- | --- |
| Publisher | GitHub Actions |
| Organization or user | `stein2nd` |
| Repository | `docs-linter` |
| Workflow filename | `npm-publish.yml` |
| Allowed actions | Allow publish、Allow stage publish |

ワークフロー側の要件は、下記の通りです。

```yaml
permissions:
  contents: read
  id-token: write
```

`NPM_TOKEN` や `NODE_AUTH_TOKEN` は **不要** です。GitHub Secret に `NPM_TOKEN` を登録しない運用を推奨します。

### ローカル手動 publish (メンテナー)

Trusted Publishing は GitHub Actions 専用です。ローカルから publish する場合は `npm login` 後に実行します。

```bash
npm whoami                    # => stein2nd
npm publish --dry-run --access public
npm publish --access public
```

## 1a. レガシー: NPM_TOKEN (非推奨)

Trusted Publisher 導入前のフェーズ2手順です。**新規セットアップでは使用しないでください。**

1. `npmjs.com` にログインし、**Access Tokens** で **Automation** トークンを発行 (`Publish` 権限、`s2j` 組織スコープ)。
2. GitHub リポジトリ `stein2nd/docs-linter` → **Settings** → **Secrets and variables** → **Actions** で `NPM_TOKEN` を登録。
3. **Settings** → **Actions** → **General** で workflow 実行権限を確認します (Read and write permissions は不要。`contents: read` のみ)。

```bash
# CLI で secret を登録する例 (トークンはプロンプトまたは stdin)
gh secret set NPM_TOKEN --repo stein2nd/docs-linter
```

## 2. 手動 dry-run 検証 (M1)

tag push 前に、GHA 上で tarball 検証と `npm publish --dry-run` を確認します。

1. GitHub → **Actions** → **Publish to npm** → **Run workflow**
2. **dry_run** を `true` のまま実行
3. 成功することを確認
   * `npm ci` → `verify:tarball` → `pack:artifact` → `upload-artifact` → `publish:dry-run`

CLI から実行する例は、下記になります。

```bash
gh workflow run npm-publish.yml --repo stein2nd/docs-linter -f dry_run=true
gh run list --workflow=npm-publish.yml --limit 1
gh run watch
```

**注意**: 既に npm に公開済みのバージョンでは `publish:dry-run` が失敗します。dry-run 検証前に `package.json` の `version` を未公開の semver に上げてください。

## 3. CHANGELOG 更新

リリース前に [CHANGELOG.md](../CHANGELOG.md) を更新します。`package.json` の `version` 更新および tag push **より前** に main へ merge してください。

1. 先頭 (最新バージョン) にエントリを追加する

   ```markdown
   ## [1.0.14] - 2026-05-26

   - 変更内容を箇条書き
   ```

2. 記載内容の目安
   * ユーザーに影響する変更 (CLI、presets、依存関係、互換性)
   * publish 基盤・CI の変更 (該当する場合)
   * パッチリリースでは修正・依存更新のみでも可

3. バージョン番号は、これから publish する `package.json` `version` と一致させる

## 4. バージョン更新と tag push (本番 publish)

1. [CHANGELOG.md](../CHANGELOG.md) を更新 ([CHANGELOG 更新](#3-changelog-更新))
2. `package.json` の `version` を更新 (semver)
3. 変更を main に merge
4. tag を作成して push:

```bash
# 例: 1.0.12 をリリース
git tag v1.0.12
git push origin v1.0.12
```

5. Actions で **Publish to npm** が起動し、以下が実行される

   * tag / `package.json` version 一致検証 (`scripts/verify-release-tag.cjs`)
   * `npm ci` → `verify:tarball` → `pack:artifact`
   * artifact 保存 (`s2j-docs-linter-v1.0.12`)
   * `npm publish --access public`

6. 公開確認

```bash
npm view @s2j/docs-linter version
npx s2j-docs-linter@latest --version
```

## 5. ローカル検証 (push 前)

```bash
npm run verify:tarball
npm run verify:artifact
npm run publish:dry-run          # 未公開 version のみ成功
node ./scripts/verify-release-tag.cjs v1.0.12
npm run publish:whoami           # 手動 publish 時
```

## 6. フェーズ2 完了条件との対応

| 完了条件 | 検証方法 |
| --- | --- |
| npm registry 公開 | `npm view @s2j/docs-linter version` |
| GHA から publish 成功 | tag push 後 workflow 成功 |
| `npm ci` → `npm publish` 再現 | 同一 workflow ログ |
| tarball artifact (GHA) | workflow の **Artifacts** タブ |
| dry-run (推奨) | `workflow_dispatch` + `dry_run=true` |

## 7. Trusted Publishing リリースフロー

### 設計意図 (ゴール)

GitHub Actions から secretless release を実現します。

### 設計方針 (規約)

npm Trusted Publishing を利用します。

### 事前準備

* npm organization: `s2j`
* npm package: `@s2j/docs-linter`
* GitHub repository: `stein2nd/docs-linter`

### npm Trusted Publisher 登録

所属 organization のパッケージ一覧 `https://www.npmjs.com/settings/所属組織/packages` の当該パッケージの「設定」`https://www.npmjs.com/package/@所属組織/リポジトリ名/access` で、Trusted Publisher を、下記の内容で登録します。

* Publisher: `GitHub Actions`
* Organization or user: GitHub のユーザー名
* Repository: GitHub のリポジトリ名
* Workflow filename: `npm-publish.yml`
* Allowed actions: `Allow publish`、`Allow stage publish`

### GitHub Actions

permissions:

```yaml
permissions:
  contents: read
  id-token: write
```

### Release

tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Verification

```bash
npm view @s2j/docs-linter version
```

## 8. GitHub リリースノート

タグ公開ワークフローにより、GitHub Releases が自動的に作成されます。
リリースノートは、`generate_release_notes: true` を使用して自動生成されます。
これは標準的なリリースノートの仕組みです。

## 9. トラブルシュート

| 症状 | 対処 |
| --- | --- |
| `404 Not Found` on `npm publish` (ローカル) | `npm logout` → `npm login` → `npm whoami` で再認証 ([Troubleshooting](#troubleshooting) 参照) |
| `Tag/version mismatch` | tag (`v1.0.13`) と `package.json` `version` (`1.0.13`) を一致させる |
| `You cannot publish over the previously published versions` | version を上げるか、dry-run 用に未公開 version を用意 |
| GHA publish 403 / OIDC 失敗 | npm Trusted Publisher の owner/repo/workflow 名が一致するか確認 |
| `NPM_TOKEN secret is not configured` | OIDC 運用では不要。ワークフローが `id-token: write` になっているか確認 |

### `npm publish` で `E404 Not Found` が出る

たとえば `404 Not Found - PUT https://registry.npmjs.org/@s2j%2fdocs-linter` の場合、「npm CLI 認証失敗」の可能性があります。

* `npm config get registry` の実行結果が、`https://registry.npmjs.org/`
* `npm config get userconfig` の実行結果が、`~/.npmrc`
* `cat ~/.npmrc` の実行結果が、`//registry.npmjs.org/:_authToken=省略`
* `npm whoami` の実行結果が、`ユーザー名`

この時、`npm whoami` 実行結果が `ユーザー名` ではない場合は、一旦 `npm logout` します。
`npm login` でログインし直した後、再認証後に、再試行します。下記が全てエラーなく実行できれば、publish 成功です。

* `npm whoami` を実行すると、`ユーザー名`
* `npm publish --dry-run --access public` が、エラーなく成功
* `npm publish --access public` が、エラーなく成功

## 9. 検証 (2026-05-25)

フェーズ2 GHA OIDC publish を確認済みです。

* `npm view @s2j/docs-linter version` → **`1.0.13`**
* tag `v1.0.13` push → run [`26381626088`](https://github.com/stein2nd/docs-linter/actions/runs/26381626088) 成功
* artifact `s2j-docs-linter-v1.0.13` 保存確認
* Trusted Publisher: GitHub Actions / `stein2nd` / `docs-linter` / `npm-publish.yml`

**ワークフロー注意**: OIDC では `setup-node` に `registry-url` を設定しないこと (placeholder `NODE_AUTH_TOKEN` が OIDC を阻害し 404 になる)。Node 24 + npm 11.6+ を使用。
