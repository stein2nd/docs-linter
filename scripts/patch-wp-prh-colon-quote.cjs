#!/usr/bin/env node
/**
 * textlint-rule-preset-wp-docs-ja の wordpress.yml では次の二つが衝突する:
 * - 「、。「」『』の前には半角スペースを入れない」→ `: 「` のスペースを削除して `:「` へ
 * - 「コロンの後に半角スペースを入れる」→ `:「` を `: 「` へ
 * コロン直後が鉤括弧・読点・句点・改行のいずれかのときはスペース挿入を行わないよう pattern を絞る。
 * @see https://github.com/jawordpressorg/textlint-rule-preset-wp-docs-ja
 */
"use strict";

const fs = require("fs");
const path = require("path");

const pkg = "textlint-rule-preset-wp-docs-ja";
const rel = path.join("node_modules", pkg, "prh-rules", "wordpress.yml");
const target = path.resolve(__dirname, "..", rel);

if (!fs.existsSync(target)) {
  console.warn(`[docs-linter] ${rel} が無いため PRH コロン/鉤括弧パッチをスキップ`);
  process.exit(0);
}

let s = fs.readFileSync(target, "utf8");

const patchedMarker = "pattern: /:([^ \\n、。「」『』])/";
if (s.includes(patchedMarker)) {
  process.exit(0);
}

const needle = "  # コロンの後に半角スペースを入れる\n  - pattern: /:([^ ])/\n    expected: \": $1\"";
const idx = s.indexOf(needle);

if (idx === -1) {
  console.warn(
    "[docs-linter] wordpress.yml の「コロンの後に半角スペース」ルールが見つからないためパッチをスキップ（上流 PRH の更新を確認）"
  );
  process.exit(0);
}

const replacement =
  "  # コロンの後に半角スペースを入れる（「『 等の直後は除外。鉤括弧前のスペース禁止と両立）\n" +
  "  - pattern: /:([^ \\n、。「」『』])/\n" +
  "    expected: \": $1\"";

fs.writeFileSync(target, s.slice(0, idx) + replacement + s.slice(idx + needle.length), "utf8");
console.log("[docs-linter] PRH: colon / quote 衝突回避パッチを適用しました");
