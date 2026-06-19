# 📘 S2J Docs Linter - Modification Plan-2

ルール内容も、ユーザー毎に変わってくる前提にしたいです。例えば「漢字は連続7文字まで」「(法律用語を前提にすると)漢字は連続30文字くらい許容したい」と言った様に、千差万別です。
  
---

その場合は、「ルールコード」と「ルール設定」を分離して考えるのが重要になります。

先ほど私が懸念したのは、下記のような JavaScript そのものを利用者がアップロードできる仕組みです。

```js
module.exports = function(context) {
  // 任意コード
}
```

これは Forwarder-Pro のような業務システムでは、問題になるのはほぼ確実です。

---

## まず分けるべきもの

### 1. ルールエンジン（開発者管理）

例えば、下記のようなものは `@s2j/docs-linter-core` に同梱します。

* max-kanji-continuous
* max-sentence-length
* max-heading-length
* forbidden-word
* required-word

---

### 2. ルール設定（利用者管理）

`max-kanji-continuous` で例示します。

```json
{
  "max-kanji-continuous": {
    "max": 7
  }
}
```

法律事務所なら下記の様な指定が想定されます。

```json
{
  "max-kanji-continuous": {
    "max": 30
  }
}
```

一方、医療機関なら下記の様な指定が想定されます。

```json
{
  "max-kanji-continuous": {
    "max": 20
  }
}
```

利用者ごとの差異は、こちらで吸収します。

---

## ESLint の考え方に近い

例えば ESLint も、下記のように、ルールそのものは固定です。利用者はパラメータだけ変えます。

```json
{
  "max-len": ["error", 120]
}
```

---

## WordPress 向けなら

内部DBに、「ルール定義」「利用者設定」のような構造を持てます。

* ルール定義
  * rule_id
  * rule_name
  * description
  * schema
* 利用者設定
  * user_id
  * rule_id
  * value

「ルール定義」テーブルが下記のように登録された場合で例示します。

|rule_id|rule_name|
|---|---|
|1|max-kanji-continuous|
|2|max-heading-length|

利用者 A の設定例が下記になります。

|user_id|rule_id|value|
|---|---|---|
|100|1|7|
|100|2|40|

利用者 B の設定例が下記になります。

|user_id|rule_id|value|
|---|---|---|
|200|1|30|
|200|2|80|

---

## さらに進めるなら「ルール DSL」

もし将来的に「利用者が独自ルールを作りたい」まで考えるなら、JavaScript を書かせるのではなく DSL（設定言語）を作る方が安全です。

下記のような DSL 例が挙げられます。

```yaml
name: legal-kanji-rule

type: max-kanji-continuous

params:
  max: 30
```

```yaml
name: prohibit-word

params:
  words:
    * ヤバい
    * 超
```

この形式なら、下記はすべて同じデータ構造で扱えます。

* `WordPress`
* `Forwarder-Pro`
* `配配メール`

---

## S2J Docs Linter の場合

現在の構想を見る限り、下記に分けるのが最も現実的でしょう。

* 利用者が変更可能
  * 禁止語辞書
  * 推奨語辞書
  * 固有名詞辞書
  * 漢字連続数
  * 文長
  * 見出し長
  * 空白ルール
  * 句読点ルール
* 開発者管理
  * textlint ルール実装
  * AST 解析処理
  * 判定ロジック

特に WordPress 展開を考えると、下記の境界を崩さない方が、管理画面設計もシンプルになります。

```text
ルール = コード

設定 = データ
```

むしろユーザーごとに差異が出るのは「ルールコード」ではなく「ルールパラメータ」の方が圧倒的に多いので、フェーズ2で考えておられる「辞書と設定を DB で持つ」という方向性はかなり理にかなっています。