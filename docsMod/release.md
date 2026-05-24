# S2J Docs Linter — npm リリース手順 (フェーズ2)

本ドキュメントは、`@s2j/docs-linter` を GitHub Actions 経由で npm に publish する運用手順です。認証方針は [npm 認証およびシークレット管理仕様](./npm_auth_secret_manage_spec.md)、実装状況は [status.md](./status.md) を参照してください。

## 前提

| 項目 | 内容 |
| --- | --- |
| パッケージ | `@s2j/docs-linter` |
| ワークフロー | [`.github/workflows/npm-publish.yml`](../.github/workflows/npm-publish.yml) |
| トリガー | tag `v*` push、または手動 `workflow_dispatch` |
| 認証 (フェーズ2) | GitHub Secret `NPM_TOKEN` (npm automation token) |

## 1. 初回セットアップ (NPM_TOKEN)

1. [npmjs.com](https://www.npmjs.com/) にログインし、**Access Tokens** で **Automation** トークンを発行します (`Publish` 権限、`s2j` 組織スコープ)。
2. GitHub リポジトリ `stein2nd/docs-linter` → **Settings** → **Secrets and variables** → **Actions** で `NPM_TOKEN` を登録します。
3. **Settings** → **Actions** → **General** で workflow 実行権限を確認します (Read and write permissions は不要。`contents: read` のみ)。

```bash
# CLI で secret を登録する例 (トークンはプロンプトまたは stdin)
gh secret set NPM_TOKEN --repo stein2nd/docs-linter
```

## 2. 手動 dry-run 検証 (M1)

tag push 前に、GHA 上で tarball 検証と `npm publish --dry-run` を確認します。

1. GitHub → **Actions** → **Publish to npm** → **Run workflow**
2. **dry_run** を `true` のまま実行
3. 成功することを確認:
   - `npm ci` → `verify:tarball` → `pack:artifact` → `upload-artifact` → `publish:dry-run`

CLI から実行する例:

```bash
gh workflow run npm-publish.yml --repo stein2nd/docs-linter -f dry_run=true
gh run list --workflow=npm-publish.yml --limit 1
gh run watch
```

**注意**: 既に npm に公開済みのバージョンでは `publish:dry-run` が失敗します。dry-run 検証前に `package.json` の `version` を未公開の semver に上げてください。

## 3. バージョン更新と tag push (本番 publish)

1. `package.json` の `version` を更新 (semver)
2. 変更を main に merge
3. tag を作成して push:

```bash
# 例: 1.0.12 をリリース
git tag v1.0.12
git push origin v1.0.12
```

4. Actions で **Publish to npm** が起動し、以下が実行されます:
   - tag / `package.json` version 一致検証 (`scripts/verify-release-tag.cjs`)
   - `npm ci` → `verify:tarball` → `pack:artifact`
   - artifact 保存 (`s2j-docs-linter-v1.0.12`)
   - `npm publish --access public`

5. 公開確認:

```bash
npm view @s2j/docs-linter version
npx s2j-docs-linter@latest --version
```

## 4. ローカル検証 (push 前)

```bash
npm run verify:tarball
npm run verify:artifact
npm run publish:dry-run          # 未公開 version のみ成功
node ./scripts/verify-release-tag.cjs v1.0.12
npm run publish:whoami           # 手動 publish 時
```

## 5. フェーズ2 完了条件との対応

| 完了条件 | 検証方法 |
| --- | --- |
| npm registry 公開 | `npm view @s2j/docs-linter version` |
| GHA から publish 成功 | tag push 後 workflow 成功 |
| `npm ci` → `npm publish` 再現 | 同一 workflow ログ |
| tarball artifact (GHA) | workflow の **Artifacts** タブ |
| dry-run (推奨) | `workflow_dispatch` + `dry_run=true` |

## 6. トラブルシュート

| 症状 | 対処 |
| --- | --- |
| `NPM_TOKEN secret is not configured` | GitHub Secret に `NPM_TOKEN` を登録 |
| `Tag/version mismatch` | tag (`v1.0.12`) と `package.json` `version` (`1.0.12`) を一致させる |
| `You cannot publish over the previously published versions` | version を上げるか、dry-run 用に未公開 version を用意 |
| publish 403 / 401 | トークンの publish 権限・`s2j` org スコープを確認 |
| IDE 警告 `Context access might be invalid: NPM_TOKEN` | Secret 未登録時の静的警告。登録後も残ることがある |

## 7. 将来 (フェーズ3): Trusted Publishing (OIDC)

長期運用では [npm_auth_secret_manage_spec.md](./npm_auth_secret_manage_spec.md) の **npm trusted publishing (OIDC)** への移行を推奨します。移行後は `NPM_TOKEN` が不要になります。
