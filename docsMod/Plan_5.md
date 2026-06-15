# 📘 S2J Docs Linter - Modification Plan-5

改めて確認したい事項は、下記のとおりです。

* ブラウザ内textlint実行は、Chrome以外では実現できない…と言う「ブラウザ依存」か？

---

結論から言うと、**「ブラウザ内で textlint を実行する = Chrome 依存」ではありません。**

ただし、**「ブラウザ内で textlint を実行する = ブラウザの JavaScript 実行環境に依存する」** という意味ではブラウザ依存です。

---

## 私が前回言った「ブラウザ依存」とは

例えば WordPress Block Editor 上で、下記構成を考えます。

```text
Gutenberg
 ↓
React
 ↓
textlint
 ↓
警告表示
```

この場合、lint 処理は、下記のブラウザー内 JavaScript エンジン上で動きます。

- Chrome
- Edge
- Firefox
- Safari

つまり、流れは下記ではありません。

```text
サーバー側
↓
Node.js
↓
textlint
```

流れは下記になります。

```text
利用者PC
↓
ブラウザ
↓
textlint
```

---

## textlint自体はブラウザ対応可能

textlint は Node.js 前提で開発されていますが、最近のフロントエンド環境なら、下記などでバンドルできます。

```text
Webpack
Vite
Rollup
esbuild
```

技術的には、下記の流れは実現可能です。

```text
React
↓
textlint
```

---

## ただし問題がある

### 問題1: ブラウザごとの差異

例えば、下記の様な課題があります。

- Chromeでは動く
- Safariでは重い
- Firefoxで一部ルールが動かない

Node.js の場合は、下記を考慮すればよい構造です。

- Node 24

しかし、ブラウザ版は下記を考慮する必要があります。

- Chrome
- Edge
- Firefox
- Safari

---

### 問題2: パフォーマンス

例えば `5,000文字` なら問題ありません。
しかし `50,000文字` のマニュアルや記事群になると、利用者PCで解析することになります。

---

### 問題3: ルール実装制限

例えば現在や将来、`fs.readFileSync()` や `path.resolve()` を使うルールを書くと、ブラウザでは動きません。

---

## WordPress向けで現実的なのは？

私は、下記の「編集中」と「一括診断」のハイブリッドを提案します。

編集中は、ブラウザ実行を前提とします。

```text
Block Editor
↓
REST API
↓
Lint
```

一括診断は、サーバー実行を前提とします。

```text
投稿一覧
↓
Lint
↓
レポート
```

---

## ただし、あなたの構想だと…

以前から伺っている内容を見ると、あなたが重視しているのは下記への横展開です。

- `WordPress`
- `Forwarder-Pro`
- `配配メール`

その場合、私はむしろ、下記を正として設計する方をおすすめします。

```text
docs-linter-core
↓
Node.js
```

理由は、下記だからです。

- WordPress - REST経由で呼べる
- Spring Boot - REST経由で呼べる
- Java - REST経由で呼べる
- 将来のデスクトップアプリ - REST経由で呼べる

---

## 私ならこう考える

フェーズ1時点では、下記のみ対応。

```text
docs-linter-core
↓
Node.js
```

フェーズ3の WordPress で、`ブラウザ内 textlint` を検討。

---

ただし、`ブラウザ内 textlint が必須` とは考えない。
むしろ下記の方が、`Forwarder-Pro` や `配配メール` との共通化がしやすいです。

```text
WordPress
↓
REST API
↓
docs-linter-core
```

そのため、あなたの長期構想との整合性だけで言えば、**ブラウザ実行は「将来の最適化候補」であり、「アーキテクチャの前提」にしない方が良い** です。