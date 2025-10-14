# 📘 docs-linter

共通 Markdown Lint 設定リポジトリ。  
WordPress プラグイン／テーマ開発、Xcode (Swift/SwiftUI) アプリ開発の両方で利用可能です。

## 利用方法
```bash
git submodule add https://github.com/stein2nd/docs-linter.git docs-linter
cd docs-linter
npm install
```

`.vscode/settings.json`:

```json
{
  "textlint.configPath": "./docs-linter/base/.textlintrc.base.json"
}
```

