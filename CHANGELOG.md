# S2J Docs Linter - CHANGELOG

`@s2j/docs-linter` の npm 公開版における主な変更を記録します。

## [1.0.13] - 2026-05-25

- GitHub Actions (npm Trusted Publishing / OIDC) による初の自動 publish
- tag `v*` push 連動の release workflow 運用開始
- tarball artifact (`s2j-docs-linter-v1.0.13`) の GHA 保存

## [1.0.12] - 2026-05-24

- 手動 publish (`npm login` 経由) — ローカル publish 手順の運用確認

## [1.0.11]

- `sudachi-synonyms-dictionary` を `dependencies` に追加
- 利用側で peer 依存不足により lint が失敗する問題を解消

## [1.0.10] - 2026-05-23

- npmjs 初回公開 (`@s2j/docs-linter`)
- CLI `s2j-docs-linter` (互換 `docs-lint`)、presets (`base` / `swift` / `wordpress`)
- tarball 検証 (`verify:tarball`)、artifact 生成 (`pack:artifact`)、publish dry-run 基盤
